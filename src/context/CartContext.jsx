'use client';
// src/context/CartContext.jsx

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import {
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  APPLY_COUPON,
  REMOVE_COUPON,
  UPDATE_CUSTOMER_ADDRESS,
  UPDATE_SHIPPING_METHOD,
} from '../lib/queries/cart';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const client = useApolloClient();
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Guards a one-time silent refetch after a stale WooCommerce session is healed.
  const sessionHealRef = useRef(false);

  // GET_CART — always fetch fresh from network
  const { data, loading: cartLoading, refetch: refetchCart } = useQuery(GET_CART, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      const msg = err?.message || '';
      // An expired/invalid WooCommerce session token is auto-healed by the Apollo
      // errorLink (it drops the dead token; the next request mints a fresh one). This
      // is normal for returning visitors after ~48h — not an error. Quietly refetch
      // once so the cart loads cleanly with the fresh session, and don't log noise.
      if (/invalid[_ ]token|expired token|no session found/i.test(msg)) {
        if (!sessionHealRef.current) {
          sessionHealRef.current = true;
          Promise.resolve()
            .then(() => refetchCart?.())
            .catch(() => {})
            .finally(() => { sessionHealRef.current = false; });
        }
        return;
      }
      console.error('Cart fetch error:', msg);
    },
  });

  const cart = data?.cart || null;
  const cartItems = cart?.contents?.nodes || [];
  const itemCount = cart?.contents?.itemCount || 0;
  const cartTotal = cart?.total || '$0.00';
  const cartSubtotal = cart?.subtotal || '$0.00';

  // ── ADD TO CART ──
  const [addToCartMutation, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
    onCompleted: (data) => {
      const newCart = data?.addToCart?.cart;
      if (newCart) {
        // Write updated cart to cache so /cart page updates instantly
        client.writeQuery({ query: GET_CART, data: { cart: newCart } });
      }
      // Also refetch to make sure session is in sync
      refetchCart();
      showNotification('Added to cart!');
    },
    onError: (err) => {
      console.error('Add to cart error:', err.message);
      showNotification('Failed to add to cart', 'error');
    },
  });

  const addToCart = useCallback(async (productId, quantity = 1, variationId = null, extraData = null) => {
    // Account required to add to cart — no anonymous carts. Bounce logged-out
    // shoppers to sign in / create a 21+ account, then back to where they were.
    if (typeof window !== 'undefined' && !localStorage.getItem('jwt_token')) {
      const here = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(here)}&reason=cart`;
      return { success: false, requiresAuth: true };
    }
    try {
      const variables = { productId: parseInt(productId), quantity };
      if (variationId) variables.variationId = parseInt(variationId);
      // extraData: a plain object (e.g. gift-card recipient details) serialized
      // to JSON; WooGraphQL stores each key as cart-item metadata, which a backend
      // hook copies onto the order line item.
      if (extraData && typeof extraData === 'object') variables.extraData = JSON.stringify(extraData);
      await addToCartMutation({ variables });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [addToCartMutation]);

  // ── UPDATE QUANTITY ──
  const [updateItemMutation] = useMutation(UPDATE_CART_ITEM, {
    onCompleted: (data) => {
      const newCart = data?.updateItemQuantities?.cart;
      if (newCart) client.writeQuery({ query: GET_CART, data: { cart: newCart } });
      refetchCart();
    },
    onError: (err) => console.error('Update cart error:', err.message),
  });

  const updateQuantity = useCallback(async (key, quantity) => {
    if (quantity < 1) return removeItem(key);
    try {
      await updateItemMutation({ variables: { key, quantity } });
    } catch (err) {
      console.error(err);
    }
  }, [updateItemMutation]);

  // ── REMOVE ITEM ──
  const [removeItemMutation] = useMutation(REMOVE_CART_ITEM, {
    onCompleted: (data) => {
      const newCart = data?.removeItemsFromCart?.cart;
      if (newCart) client.writeQuery({ query: GET_CART, data: { cart: newCart } });
      refetchCart();
      showNotification('Item removed');
    },
    onError: (err) => console.error('Remove cart error:', err.message),
  });

  const removeItem = useCallback(async (key) => {
    try {
      await removeItemMutation({ variables: { key } });
    } catch (err) {
      console.error(err);
    }
  }, [removeItemMutation]);

  // ── APPLY COUPON ──
  const [applyCouponMutation, { loading: applyingCoupon }] = useMutation(APPLY_COUPON, {
    onCompleted: (data) => {
      const newCart = data?.applyCoupon?.cart;
      if (newCart) client.writeQuery({ query: GET_CART, data: { cart: newCart } });
      refetchCart();
      showNotification('Coupon applied!');
    },
    onError: (err) => {
      showNotification('Invalid coupon code', 'error');
      throw err;
    },
  });

  const applyCoupon = useCallback(async (code) => {
    await applyCouponMutation({ variables: { code } });
  }, [applyCouponMutation]);

  // ── REMOVE COUPON ──
  const [removeCouponMutation] = useMutation(REMOVE_COUPON, {
    onCompleted: (data) => {
      const newCart = data?.removeCoupons?.cart;
      if (newCart) client.writeQuery({ query: GET_CART, data: { cart: newCart } });
      refetchCart();
    },
    onError: (err) => console.error('Remove coupon error:', err.message),
  });

  const removeCoupon = useCallback(async (code) => {
    await removeCouponMutation({ variables: { code } });
  }, [removeCouponMutation]);

  // ── SHIPPING: set address (so rates calculate), then choose a rate ──
  const [updateAddressMutation, { loading: updatingAddress }] = useMutation(UPDATE_CUSTOMER_ADDRESS);
  const [updateShippingMutation, { loading: updatingShipping }] = useMutation(UPDATE_SHIPPING_METHOD);

  const setShippingAddress = useCallback(async (addr) => {
    try {
      await updateAddressMutation({ variables: {
        country: addr.country || 'US',
        state: addr.state || '',
        postcode: addr.zip || addr.postcode || '',
        city: addr.city || '',
        address1: addr.address || addr.address1 || '',
        firstName: addr.firstName || '',
        lastName: addr.lastName || '',
      } });
      await refetchCart(); // pulls availableShippingMethods + recalculated totals
      return { success: true };
    } catch (err) {
      console.error('Set shipping address error:', err.message);
      return { success: false, error: err.message };
    }
  }, [updateAddressMutation, refetchCart]);

  const setShippingMethod = useCallback(async (rateId) => {
    try {
      await updateShippingMutation({ variables: { methods: [rateId] } });
      await refetchCart();
      return { success: true };
    } catch (err) {
      console.error('Set shipping method error:', err.message);
      return { success: false, error: err.message };
    }
  }, [updateShippingMutation, refetchCart]);

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      itemCount,
      cartTotal,
      cartSubtotal,
      cartDiscount: cart?.discountTotal || '$0.00',
      shippingTotal: cart?.shippingTotal || null,
      availableShippingRates: cart?.availableShippingMethods?.[0]?.rates || [],
      chosenShippingMethods: cart?.chosenShippingMethods || [],
      cartLoading,
      addingToCart,
      applyingCoupon,
      updatingAddress,
      updatingShipping,
      notification,
      addToCart,
      updateQuantity,
      removeItem,
      applyCoupon,
      removeCoupon,
      setShippingAddress,
      setShippingMethod,
      refetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

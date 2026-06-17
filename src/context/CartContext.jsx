'use client';
// src/context/CartContext.jsx

import { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import {
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  APPLY_COUPON,
  REMOVE_COUPON,
} from '../lib/queries/cart';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const client = useApolloClient();
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // GET_CART — always fetch fresh from network
  const { data, loading: cartLoading, refetch: refetchCart } = useQuery(GET_CART, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      console.error('Cart fetch error:', err.message);
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

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      itemCount,
      cartTotal,
      cartSubtotal,
      cartLoading,
      addingToCart,
      applyingCoupon,
      notification,
      addToCart,
      updateQuantity,
      removeItem,
      applyCoupon,
      removeCoupon,
      refetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

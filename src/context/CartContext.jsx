'use client';
// src/context/CartContext.jsx
// FIX: Removed onError from useQuery (deprecated in Apollo 3.14+)
// Use the returned `error` value + useEffect for side effects instead.

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CART,
  ADD_TO_CART,
  ADD_VARIABLE_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  APPLY_COUPON,
  REMOVE_COUPON,
} from '../lib/queries/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [notification, setNotification] = useState(null);

  // ── FIX: No onError callback — use returned error instead ──
  const { data, loading: cartLoading, error: cartError, refetch } = useQuery(GET_CART, {
    fetchPolicy: 'network-only',
  });

  // Log cart errors via useEffect (correct Apollo 3.14+ pattern)
  useEffect(() => {
    if (cartError) {
      console.error('[Cart] Fetch error:', cartError.message);
    }
  }, [cartError]);

  const cart = data?.cart || null;
  const cartItems = cart?.contents?.nodes || [];
  const itemCount = cart?.contents?.itemCount || 0;
  const cartTotal = cart?.total || '$0.00';
  const cartSubtotal = cart?.subtotal || '$0.00';

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const [addToCartMutation, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
    onCompleted: () => { refetch(); showNotification('Added to cart!'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  const [addVariableMutation] = useMutation(ADD_VARIABLE_TO_CART, {
    onCompleted: () => { refetch(); showNotification('Added to cart!'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  const [updateItemMutation] = useMutation(UPDATE_CART_ITEM, {
    onCompleted: () => refetch(),
    onError: (err) => console.error('[Cart] Update error:', err.message),
  });

  const [removeItemMutation] = useMutation(REMOVE_CART_ITEM, {
    onCompleted: () => refetch(),
    onError: (err) => console.error('[Cart] Remove error:', err.message),
  });

  const [applyCouponMutation, { loading: applyingCoupon }] = useMutation(APPLY_COUPON, {
    onCompleted: () => { refetch(); showNotification('Coupon applied!'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  const [removeCouponMutation] = useMutation(REMOVE_COUPON, {
    onCompleted: () => refetch(),
    onError: (err) => console.error('[Cart] Remove coupon error:', err.message),
  });

  const addToCart = useCallback((productId, quantity = 1) => {
    addToCartMutation({ variables: { productId, quantity } });
  }, [addToCartMutation]);

  const addVariableToCart = useCallback((productId, variationId, quantity = 1) => {
    addVariableMutation({ variables: { productId, variationId, quantity } });
  }, [addVariableMutation]);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) {
      removeItemMutation({ variables: { key } });
      return;
    }
    updateItemMutation({ variables: { key, quantity } });
  }, [updateItemMutation, removeItemMutation]);

  const removeItem = useCallback((key) => {
    removeItemMutation({ variables: { key } });
  }, [removeItemMutation]);

  const applyCoupon = useCallback((code) => {
    applyCouponMutation({ variables: { code } });
  }, [applyCouponMutation]);

  const removeCoupon = useCallback((code) => {
    removeCouponMutation({ variables: { code } });
  }, [removeCouponMutation]);

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      itemCount,
      cartTotal,
      cartSubtotal,
      cartLoading,
      cartError,
      addingToCart,
      applyingCoupon,
      notification,
      addToCart,
      addVariableToCart,
      updateQuantity,
      removeItem,
      applyCoupon,
      removeCoupon,
      refetchCart: refetch,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

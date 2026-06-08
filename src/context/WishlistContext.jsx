'use client';
// src/context/WishlistContext.jsx
// Wishlist stored in localStorage — persists across sessions

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext({});

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) setWishlistItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (e) {}
  }, [wishlistItems]);

  const addToWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, {
        id: product.id,
        databaseId: product.databaseId,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image?.sourceUrl || null,
        stockStatus: product.stockStatus,
      }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  const isWishlisted = useCallback((productId) => {
    return wishlistItems.some(i => i.id === productId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isWishlisted,
      clearWishlist,
      wishlistCount: wishlistItems.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

'use client';
// src/context/WishlistContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'iwr_wishlist';

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  // ── Load from localStorage on mount ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setWishlistItems(parsed);
      }
    } catch {
      // corrupted storage — start fresh
      localStorage.removeItem(STORAGE_KEY);
    }
    setMounted(true);
  }, []);

  // ── Persist to localStorage whenever items change (after mount) ──
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      // storage full or unavailable — silently ignore
    }
  }, [wishlistItems, mounted]);

  // ── Add to wishlist ──
  const addToWishlist = useCallback((product) => {
    if (!product?.id) return;
    setWishlistItems(prev => {
      if (prev.some(item => item.id === product.id)) return prev; // already in list
      return [...prev, normalizeProduct(product)];
    });
  }, []);

  // ── Remove from wishlist ──
  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  // ── Toggle ──
  const toggleWishlist = useCallback((product) => {
    if (!product?.id) return;
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, normalizeProduct(product)];
    });
  }, []);

  // ── Clear all ──
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  // ── Check if product is wishlisted ──
  const isWishlisted = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      isWishlisted,
      mounted,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}

// ── Normalize product shape from any source (shop, product page, home) ──
function normalizeProduct(product) {
  return {
    id:           product.id,
    databaseId:   product.databaseId,
    slug:         product.slug         || '',
    name:         product.name         || '',
    price:        product.price        || '',
    image:        product.image?.sourceUrl || product.image || null,
    stockStatus:  product.stockStatus  || 'IN_STOCK',
    __typename:   product.__typename   || 'SimpleProduct',
  };
}

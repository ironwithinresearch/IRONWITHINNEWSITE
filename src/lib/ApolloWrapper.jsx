'use client';
// src/lib/ApolloWrapper.jsx

import { ApolloProvider } from '@apollo/client';
import { makeClient } from './apollo-client';
import { useRef } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';

export default function ApolloWrapper({ children }) {
  const clientRef = useRef(null);
  if (!clientRef.current) {
    clientRef.current = makeClient();
  }

  return (
    <ApolloProvider client={clientRef.current}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

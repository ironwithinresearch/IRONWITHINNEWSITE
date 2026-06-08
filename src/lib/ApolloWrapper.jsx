'use client';
// src/lib/ApolloWrapper.jsx
// Wraps the app with ApolloProvider, AuthProvider, and CartProvider

import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function ApolloWrapper({ children }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

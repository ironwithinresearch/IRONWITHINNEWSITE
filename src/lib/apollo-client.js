'use client';
// src/lib/apollo-client.js

import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export function makeClient() {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://bhidasowgm.onrocket.site/graphql',
    credentials: 'include',
  });

  // Reads token + session FRESH on every single request
  const authLink = setContext((_, { headers }) => {
    let token = null;
    let wooSession = null;

    if (typeof window !== 'undefined') {
      token = localStorage.getItem('jwt_token');
      wooSession = localStorage.getItem('woo_session');
    }

    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(wooSession ? { 'woocommerce-session': `Session ${wooSession}` } : {}),
      },
    };
  });

  // Captures NEW session token from WooCommerce response and saves it
  const sessionLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      try {
        const context = operation.getContext();
        const headers = context?.response?.headers;
        if (headers && typeof window !== 'undefined') {
          const sessionToken = headers.get('woocommerce-session');
          if (sessionToken) {
            // WooCommerce sends it as "Session <token>" or just "<token>"
            const clean = sessionToken.startsWith('Session ')
              ? sessionToken.replace('Session ', '')
              : sessionToken;
            localStorage.setItem('woo_session', clean);
          }
        }
      } catch (e) {
        // silently ignore
      }
      return response;
    });
  });

  return new ApolloClient({
    link: ApolloLink.from([sessionLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Cart: { keyFields: [] }, // treat cart as a singleton
        // Keep each product variation distinct (key by its own databaseId)...
        SimpleProductVariation: { keyFields: ['databaseId'] },
        // ...and do NOT normalize variation attributes: WooGraphQL gives them
        // colliding cache ids, so Apollo was merging every variation's
        // attributes into one set (breaking dose/quantity-tier resolution).
        VariationAttribute: { keyFields: false },
      },
    }),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  });
}

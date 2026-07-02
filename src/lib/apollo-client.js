'use client';
// src/lib/apollo-client.js

import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

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
      // Never send an expired JWT: the server would silently treat us as a guest and
      // return empty orders/profile. Drop it so requests go out unauthenticated and the
      // app can prompt a fresh login instead of showing a logged-in-but-empty account.
      if (token) {
        try {
          const exp = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp;
          if (exp && Date.now() >= exp * 1000) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('iwr_user');
            token = null;
          }
        } catch { /* malformed token — leave as-is */ }
      }
    }

    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(wooSession ? { 'woocommerce-session': `Session ${wooSession}` } : {}),
      },
    };
  });

  // Recovers from an expired/invalid WooCommerce session token.
  // WooGraphQL hands out a `woocommerce-session` JWT that expires after ~48h.
  // When a stale token is sent, the server replies with an error and NO new
  // token, so the dead token would otherwise stay pinned in localStorage
  // forever — breaking cart reads ("invalid_token: Expired token") and
  // checkout ("Sorry, no session found"). This link detects that error class,
  // drops the stale token(s), and retries ONCE so the server mints a fresh
  // session transparently.
  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (!graphQLErrors || typeof window === 'undefined') return;
    const isStaleSession = graphQLErrors.some((e) =>
      /invalid[_ ]token|expired token|no session found/i.test(e?.message || '')
    );
    if (!isStaleSession) return;

    // Guard against a retry loop: only retry the first time per operation.
    const ctx = operation.getContext();
    if (ctx._sessionRetried) return;

    const hadSession = !!localStorage.getItem('woo_session');
    localStorage.removeItem('woo_session'); // drop the dead cart session
    // If the auth JWT is what expired, clear it too (mirrors logoutUser()).
    const isAuthError = graphQLErrors.some((e) =>
      /jwt|authorization|wp_jwt|signature/i.test(e?.message || '')
    );
    if (isAuthError) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('iwr_user');
    }

    if (!hadSession && !isAuthError) return; // nothing to clear → don't loop
    operation.setContext({ ...ctx, _sessionRetried: true });
    return forward(operation); // retry → server issues a fresh session token
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
    link: ApolloLink.from([errorLink, sessionLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Cart: { keyFields: [] }, // treat cart as a singleton
      },
    }),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  });
}

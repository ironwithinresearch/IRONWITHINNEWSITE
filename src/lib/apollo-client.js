// src/lib/apollo-client.js
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: "include", // Required for WooCommerce session cookies
});

// Attach JWT token and WooCommerce session to every request
const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
  const wooSession =
    typeof window !== "undefined"
      ? localStorage.getItem("woo_session")
      : null;

  return {
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(wooSession && { "woocommerce-session": `Session ${wooSession}` }),
    },
  };
});

// Capture WooCommerce session token from response headers
const sessionLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const sessionToken =
      context.response?.headers?.get("woocommerce-session");
    if (sessionToken && typeof window !== "undefined") {
      localStorage.setItem("woo_session", sessionToken);
    }
    return response;
  });
});

const client = new ApolloClient({
  link: ApolloLink.from([sessionLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;

// src/lib/queries/cart.js
import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart {
    cart {
      subtotal
      total
      totalTax
      shippingTotal
      discountTotal
      appliedCoupons {
        code
        discountAmount
      }
      contents {
        itemCount
        nodes {
          key
          quantity
          subtotal
          total
          product {
            node {
              id
              databaseId
              name
              slug
              image {
                sourceUrl
                altText
              }
              ... on SimpleProduct {
                price
              }
              ... on VariableProduct {
                price
              }
            }
          }
          variation {
            node {
              id
              name
              price
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cartItem {
        key
        quantity
      }
      cart {
        total
        contents {
          itemCount
        }
      }
    }
  }
`;

export const ADD_VARIABLE_TO_CART = gql`
  mutation AddVariableToCart(
    $productId: Int!
    $variationId: Int!
    $quantity: Int!
  ) {
    addToCart(
      input: {
        productId: $productId
        variationId: $variationId
        quantity: $quantity
      }
    ) {
      cartItem {
        key
        quantity
      }
      cart {
        total
        contents {
          itemCount
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($key: ID!, $quantity: Int!) {
    updateItemQuantities(
      input: { items: [{ key: $key, quantity: $quantity }] }
    ) {
      cart {
        total
        contents {
          itemCount
        }
      }
      items {
        key
        quantity
      }
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($key: ID!) {
    removeItemsFromCart(input: { keys: [$key] }) {
      cart {
        total
        contents {
          itemCount
        }
      }
    }
  }
`;

export const APPLY_COUPON = gql`
  mutation ApplyCoupon($code: String!) {
    applyCoupon(input: { code: $code }) {
      cart {
        total
        discountTotal
        appliedCoupons {
          code
          discountAmount
        }
      }
    }
  }
`;

export const REMOVE_COUPON = gql`
  mutation RemoveCoupon($code: String!) {
    removeCoupons(input: { codes: [$code] }) {
      cart {
        total
        discountTotal
      }
    }
  }
`;

export const GET_SHIPPING_METHODS = gql`
  query GetShippingMethods {
    cart {
      availableShippingMethods {
        packageDetails
        rates {
          id
          instanceId
          methodId
          label
          cost
        }
      }
      chosenShippingMethods
    }
  }
`;

export const UPDATE_SHIPPING_METHOD = gql`
  mutation UpdateShippingMethod($shippingMethod: [String]) {
    updateShippingMethod(input: { shippingMethods: $shippingMethod }) {
      cart {
        total
        shippingTotal
        chosenShippingMethods
      }
    }
  }
`;

// src/lib/queries/cart.js
import { gql } from '@apollo/client';

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
              image { sourceUrl altText }
              ... on SimpleProduct { price stockStatus }
              ... on VariableProduct { price }
            }
          }
          variation {
            node {
              id
              name
              price
              attributes { nodes { name value } }
            }
          }
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!, $variationId: Int, $extraData: String) {
    addToCart(input: {
      productId: $productId
      quantity: $quantity
      variationId: $variationId
      extraData: $extraData
    }) {
      cartItem {
        key
        quantity
      }
      cart {
        subtotal
        total
        contents {
          itemCount
          nodes {
            key
            quantity
            total
            product {
              node {
                id
                databaseId
                name
                slug
                image { sourceUrl }
                ... on SimpleProduct { price }
                ... on VariableProduct { price }
              }
            }
            variation {
              node {
                id
                name
                price
                attributes { nodes { name value } }
              }
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: {
      items: [{ key: $key, quantity: $quantity }]
    }) {
      cart {
        subtotal
        total
        contents {
          itemCount
          nodes {
            key
            quantity
            total
            product { node { id name image { sourceUrl } } }
          }
        }
      }
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($key: ID!) {
    removeItemsFromCart(input: { keys: [$key] }) {
      cart {
        subtotal
        total
        contents {
          itemCount
          nodes {
            key
            quantity
            total
            product { node { id name image { sourceUrl } } }
          }
        }
      }
    }
  }
`;

export const APPLY_COUPON = gql`
  mutation ApplyCoupon($code: String!) {
    applyCoupon(input: { code: $code }) {
      cart {
        subtotal
        total
        discountTotal
        appliedCoupons { code discountAmount }
        contents {
          itemCount
          nodes { key quantity total product { node { id name } } }
        }
      }
    }
  }
`;

export const REMOVE_COUPON = gql`
  mutation RemoveCoupon($code: String!) {
    removeCoupons(input: { codes: [$code] }) {
      cart {
        subtotal
        total
        discountTotal
        appliedCoupons { code discountAmount }
        contents {
          itemCount
          nodes { key quantity total product { node { id name } } }
        }
      }
    }
  }
`;

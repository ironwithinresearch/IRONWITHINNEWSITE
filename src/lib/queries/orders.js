// src/lib/queries/orders.js
import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query GetOrders {
    customer {
      orders {
        nodes {
          id
          databaseId
          orderNumber
          date
          status
          total
          subtotal
          shippingTotal
          paymentMethodTitle
          lineItems {
            nodes {
              quantity
              total
              product {
                node {
                  name
                  image {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      date
      status
      total
      subtotal
      totalTax
      shippingTotal
      paymentMethodTitle
      customerNote
      billing {
        firstName
        lastName
        email
        phone
        address1
        city
        state
        postcode
        country
      }
      shipping {
        firstName
        lastName
        address1
        city
        state
        postcode
        country
      }
      lineItems {
        nodes {
          quantity
          total
          product {
            node {
              name
              image {
                sourceUrl
              }
            }
          }
          variation {
            node {
              name
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

export const GET_CUSTOMER = gql`
  query GetCustomer {
    customer {
      id
      databaseId
      firstName
      lastName
      email
      username
      billing {
        firstName
        lastName
        email
        phone
        address1
        address2
        city
        state
        postcode
        country
      }
      shipping {
        firstName
        lastName
        address1
        address2
        city
        state
        postcode
        country
      }
    }
  }
`;

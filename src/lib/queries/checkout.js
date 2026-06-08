// src/lib/queries/checkout.js
import { gql } from "@apollo/client";

export const CHECKOUT = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      result
      redirect
      order {
        id
        databaseId
        orderNumber
        status
        total
        subtotal
        totalTax
        shippingTotal
        discountTotal
        paymentMethod
        paymentMethodTitle
        date
        customerNote
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
`;

/**
 * Build checkout input variables from form data
 * @param {object} billing - billing address form fields
 * @param {object} shipping - shipping address form fields
 * @param {string} transactionId - Stripe paymentIntent ID
 * @param {string} customerNote - optional note
 * @param {boolean} shipToDifferentAddress
 */
export function buildCheckoutInput({
  billing,
  shipping,
  transactionId,
  customerNote = "",
  shipToDifferentAddress = false,
}) {
  return {
    input: {
      paymentMethod: "stripe",
      isPaid: false,
      shipToDifferentAddress,
      customerNote,
      transactionId: transactionId || "",
      billing: {
        firstName: billing.firstName,
        lastName: billing.lastName,
        address1: billing.address,
        address2: billing.address2 || "",
        city: billing.city,
        state: billing.state,
        postcode: billing.zip,
        country: billing.country || "US",
        email: billing.email,
        phone: billing.phone || "",
      },
      shipping: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        address1: shipping.address,
        address2: shipping.address2 || "",
        city: shipping.city,
        state: shipping.state,
        postcode: shipping.zip,
        country: shipping.country || "US",
      },
    },
  };
}

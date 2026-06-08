// src/lib/queries/checkout.js
import { gql } from '@apollo/client';

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
        paymentMethod
        paymentMethodTitle
        date
        customerNote
        billing {
          firstName lastName email phone
          address1 address2 city state postcode country
        }
        shipping {
          firstName lastName
          address1 address2 city state postcode country
        }
        lineItems {
          nodes {
            quantity
            total
            product {
              node { name image { sourceUrl } }
            }
          }
        }
      }
    }
  }
`;

// Build the checkout input object for the mutation
// paymentMethod: 'cod' for Cash on Delivery (no Stripe needed to test)
// paymentMethod: 'stripe' when Stripe is integrated
export function buildCheckoutInput({ billing, shipping, transactionId = '', paymentMethod = 'cod', customerNote = '' }) {
  const billingAddress = {
    firstName: billing.firstName || '',
    lastName: billing.lastName || '',
    address1: billing.address || billing.address1 || '',
    address2: billing.address2 || '',
    city: billing.city || '',
    state: billing.state || '',
    postcode: billing.zip || billing.postcode || '',
    country: billing.country || 'US',
    email: billing.email || '',
    phone: billing.phone || '',
  };

  const shippingAddress = {
    firstName: shipping.firstName || '',
    lastName: shipping.lastName || '',
    address1: shipping.address || shipping.address1 || '',
    address2: shipping.address2 || '',
    city: shipping.city || '',
    state: shipping.state || '',
    postcode: shipping.zip || shipping.postcode || '',
    country: shipping.country || 'US',
  };

  return {
    input: {
      paymentMethod,
      isPaid: paymentMethod === 'stripe' && !!transactionId,
      transactionId: transactionId || undefined,
      customerNote,
      billing: billingAddress,
      shipping: shippingAddress,
      shipToDifferentAddress: false,
    },
  };
}

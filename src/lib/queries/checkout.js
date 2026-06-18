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
export function buildCheckoutInput({ billing, transactionId = '', paymentMethod = 'cod', customerNote = '', affiliateRef = '', shippingMethod = '' }) {
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

  // Order meta:
  // - goaffpro_ref: affiliate referral, so GoAffPro can attribute server-side.
  // - _iw_ship_rate: the chosen shipping rate id; a backend plugin enforces the
  //   correct shipping line/cost from it (WooGraphQL's own chosen method is flaky).
  const metaData = [];
  if (affiliateRef) metaData.push({ key: 'goaffpro_ref', value: String(affiliateRef) });
  if (shippingMethod) metaData.push({ key: '_iw_ship_rate', value: String(shippingMethod) });

  // NOTE: we deliberately do NOT pass a `shipping` address here. The ship-to
  // address is set on the session beforehand (updateCustomer), and with
  // shipToDifferentAddress=false the order ships to billing. Re-sending the
  // shipping address in this mutation makes WooGraphQL recalculate and reset the
  // chosen shipping method to the cheapest — so we pass the chosen rate via
  // `shippingMethod` instead, which is honored.
  return {
    input: {
      paymentMethod,
      isPaid: paymentMethod === 'stripe' && !!transactionId,
      transactionId: transactionId || undefined,
      customerNote,
      ...(metaData.length ? { metaData } : {}),
      ...(shippingMethod ? { shippingMethod: [shippingMethod] } : {}),
      billing: billingAddress,
      shipToDifferentAddress: false,
    },
  };
}

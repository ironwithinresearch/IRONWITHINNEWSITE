// src/lib/subscriptions.js
// Subscribe & Save is tracked on the cart line itself: the product page tags the
// item via addToCart extraData { iw_subscribe: "<cadenceDays>" }, which WooGraphQL
// stores as cart-item data and a backend hook copies onto the order line item
// (iw-subscriptions.php). The cart reads that extraData to show the badge. The
// SUBSCRIBE10 coupon is only the discount mechanism (auto-applied; stacks with
// one affiliate code).

export const SUBSCRIBE_CODE = 'SUBSCRIBE10';

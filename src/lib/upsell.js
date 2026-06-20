// src/lib/upsell.js
// Pre-checkout upsell config. A rotating, cart-aware add-on offer shown when the
// shopper clicks "Proceed to Checkout": we feature one strong product they don't
// already have, at a small discount (coupon-free, via the iw_upsell price override
// in iw-subscriptions.php). Edit the pool / discount here.

export const UPSELL_DISCOUNT = 0.05; // 5% off the add-on (keep in sync with IW_UPSELL_FACTOR backend)

// Curated pool of strong, in-stock upsell candidates (Woo slugs).
export const UPSELL_POOL = [
  'bpc-157', 'mots-c', 'ghk-cu', 'nad', 'kpv', 'glow-bundle', 'semax', 'epitalon-10mg',
];

// Pick an upsell slug the cart doesn't already contain (rotating = random each time).
export function pickUpsellSlug(cartSlugs = []) {
  const inCart = new Set((cartSlugs || []).filter(Boolean));
  const eligible = UPSELL_POOL.filter((s) => !inCart.has(s));
  if (!eligible.length) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

// Lowest-priced in-stock variation = the default dose we one-click add.
export function defaultUpsellVariation(product) {
  const vars = (product?.variations?.nodes || []).filter((v) => v.stockStatus !== 'OUT_OF_STOCK');
  if (!vars.length) return null;
  const num = (p) => parseFloat(String(p || '').replace(/[^0-9.]/g, '')) || Infinity;
  return [...vars].sort((a, b) => num(a.price) - num(b.price))[0];
}

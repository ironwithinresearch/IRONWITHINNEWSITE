// src/lib/subscriptions.js
// Client-side store of which products the shopper chose to "Subscribe & Save",
// keyed by "<productId>:<variationId>" -> cadence (days). The first order carries
// these into `_iw_subscribe_items` order meta so the backend creates one
// subscription per product (iw-subscriptions.php).

const KEY = 'iw_sub_items';
export const SUBSCRIBE_CODE = 'SUBSCRIBE10';

export const subKey = (productId, variationId) => `${productId}:${variationId || 0}`;

export function getSubItems() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { return {}; }
}
function save(obj) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch { /* ignore */ }
}
export function setSubItem(productId, variationId, cadence) {
  const o = getSubItems(); o[subKey(productId, variationId)] = Number(cadence) || 30; save(o);
}
export function removeSubItem(productId, variationId) {
  const o = getSubItems(); delete o[subKey(productId, variationId)]; save(o);
}
export function clearSubItems() { save({}); }

// Reconcile stored selections against the actual cart; returns the subscribe
// payload [{product_id, variation_id, cadence, quantity}] for items still in cart.
export function subscribeItemsFromCart(cartItems = []) {
  const o = getSubItems();
  const out = [];
  for (const item of cartItems) {
    const pid = item.product?.node?.databaseId;
    const vid = item.variation?.node?.databaseId || 0;
    if (!pid) continue;
    const cadence = o[subKey(pid, vid)];
    if (cadence) out.push({ product_id: pid, variation_id: vid, cadence: Number(cadence), quantity: item.quantity || 1 });
  }
  return out;
}

// True if a given cart item is marked as a subscription.
export function isItemSubscribed(item) {
  const pid = item.product?.node?.databaseId;
  const vid = item.variation?.node?.databaseId || 0;
  if (!pid) return false;
  return !!getSubItems()[subKey(pid, vid)];
}

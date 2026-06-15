// src/lib/affiliate.js
// Capture + persist the GoAffPro affiliate referral (?ref=) and expose it for
// checkout. The storefront (ironwithin.io) and the payment rail are on different
// domains, so GoAffPro's JS conversion tracking on the confirmation page can't
// read the referral cookie across domains. Instead we persist our own copy and
// stamp it onto every order's meta (see buildCheckoutInput) so GoAffPro's
// WooCommerce order sync can attribute the commission server-side.

const KEY = 'iw_aff_ref';
const MAX_AGE = 60 * 60 * 24 * 60; // 60 days (typical affiliate attribution window)

// Read the referral from the URL on landing and persist it.
export function captureAffiliateRef() {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const ref =
      params.get('ref') ||
      params.get('aff') ||
      params.get('affiliate') ||
      params.get('aff_id');
    if (ref) {
      localStorage.setItem(KEY, ref);
      document.cookie = `${KEY}=${encodeURIComponent(ref)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
    }
  } catch {
    /* storage blocked — ignore */
  }
}

// Return the persisted referral (for attaching to an order at checkout).
export function getAffiliateRef() {
  if (typeof window === 'undefined') return '';
  try {
    const ls = localStorage.getItem(KEY);
    if (ls) return ls;
    const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + KEY + '=([^;]+)'));
    return m ? decodeURIComponent(m[1]) : '';
  } catch {
    return '';
  }
}

// src/lib/gate.js
//
// One list of always-public routes, shared by the server-side age gate (src/middleware.js)
// and the client-side account wall (src/components/SiteGate.jsx), so the two can never
// disagree about what a logged-out visitor may open.
//
// Everything NOT listed here is behind the 21+ gate: the shop, every product, cart,
// checkout, account, lab reports, deals — including direct links.

export const AGE_COOKIE = 'iw_age21';
// One year. The cookie is an age attestation, not a credential — the account wall and the
// backend's approval check still decide who can see prices and who can buy.
export const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const PUBLIC_PREFIXES = [
  // the auth flow itself
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/affiliate-access',
  // legal + policy pages
  '/terms',
  '/privacy',
  '/disclaimer',
  '/refund',
  '/shipping',
  '/ruo-policy',
  // sweepstakes rules: the free mail-in route must be reachable without an account
  '/giveaway',
  // vial-label QR codes (route handler that 302s to the COA PDF) — printed on product
  // already in customers' hands, so it can never be walled
  '/coas',
  // Apple Pay domain verification
  '/.well-known',
];

export function isPublicPath(pathname) {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

/** Browser-side: remember that this visitor confirmed 21+ (login, sign-up or the gate). */
export function setAgeCookie() {
  if (typeof document === 'undefined') return;
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${AGE_COOKIE}=1; Path=/; Max-Age=${AGE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  } catch {}
}

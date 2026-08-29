// GET /api/paypal-frame — same-origin proxy for the PayPal iframe URL and its order payload.
//
// The backend picks which proxy serves the iframe (they rotate) and returns its URL. Going
// through our own origin keeps the browser off the WooCommerce host and means the CSP only
// has to allow the iframe host, not an extra API host.
//
// The buyer's woocommerce-session header is forwarded verbatim. Without it the backend has no
// cart, so `purchase_units` comes back empty and PayPal is asked to authorise nothing — the
// button then appears but the popup closes straight away.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKEND = 'https://bhidasowgm.onrocket.site';

// Only what the payload needs. An allowlist rather than a passthrough so the query string
// cannot be used to smuggle arbitrary parameters at the gateway.
const BILLING_KEYS = [
  'email', 'first_name', 'last_name',
  'address_1', 'address_2', 'city', 'state', 'postcode', 'country',
];

export async function GET(request) {
  try {
    const incoming = new URL(request.url).searchParams;
    const qs = new URLSearchParams();
    for (const k of BILLING_KEYS) {
      const v = incoming.get(k);
      if (v) qs.set(k, v);
    }

    const session = request.headers.get('woocommerce-session') || '';
    const res = await fetch(`${BACKEND}/wp-json/iw/v1/paypal-frame?${qs.toString()}`, {
      cache: 'no-store',
      headers: session ? { 'woocommerce-session': session } : {},
    });
    const data = await res.json();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // Never throw here — a failed lookup must hide the PayPal option, not break checkout.
    return NextResponse.json({ enabled: false, reason: 'lookup failed' });
  }
}

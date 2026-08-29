// GET /api/paypal-frame — same-origin proxy for the PayPal iframe URL.
//
// The backend picks which proxy serves the iframe (they rotate) and returns its URL. Going
// through our own origin keeps the browser off the WooCommerce host and means the CSP only
// has to allow the iframe host, not an extra API host.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKEND = 'https://bhidasowgm.onrocket.site';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/wp-json/iw/v1/paypal-frame`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // Never throw here — a failed lookup must hide the PayPal option, not break checkout.
    return NextResponse.json({ enabled: false, reason: 'lookup failed' });
  }
}

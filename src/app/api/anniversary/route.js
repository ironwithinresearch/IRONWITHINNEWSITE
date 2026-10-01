// src/app/api/anniversary/route.js
// GET /api/anniversary — same-origin proxy for the Anniversary Month feed
// (mu-plugin, GET /wp-json/iw/v1/anniversary). Forwards the customer's JWT when there is one,
// so `me` carries their Passport stamps and Hold & Ship box; without one the feed is public.
//
// Never fails loudly: the backend endpoint may not exist yet (404) or may reject a stale token.
// The page treats `{ available: false }` as "tracking not switched on" and still renders every
// static section, so this route answers 200 with that shape rather than passing errors through.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';
const NO_STORE = { 'Cache-Control': 'no-store' };

async function pull(auth) {
  const res = await fetch(`${WP_URL}/wp-json/iw/v1/anniversary`, {
    headers: auth ? { Authorization: auth } : {},
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  try {
    let r = await pull(auth);
    // An expired or bad token makes jwt-auth refuse the whole request (401/403). Fall back to
    // the public answer so the shopper still sees today's deal, just without their stamps.
    if (auth && (r.status === 401 || r.status === 403)) r = await pull('');
    if (!r.ok || !r.data || typeof r.data !== 'object') {
      return NextResponse.json({ available: false, me: null }, { headers: NO_STORE });
    }
    return NextResponse.json({ available: true, ...r.data }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ available: false, me: null }, { headers: NO_STORE });
  }
}

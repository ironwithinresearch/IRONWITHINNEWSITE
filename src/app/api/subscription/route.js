// src/app/api/subscription/route.js
// Proxy to the WP backend: fetch a Subscribe & Save subscription's items by token
// (used by the /reorder page to rebuild the cart). Server-to-server, no CORS.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export async function GET(request) {
  const token = request.nextUrl.searchParams.get('token') || '';
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 });
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/subscription?token=${encodeURIComponent(token)}`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }
}

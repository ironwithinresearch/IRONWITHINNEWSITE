// src/app/api/pp-container/route.js
//
// Same-origin proxy for the PeptidesPayment container attributes. The backend
// (mu-plugin iw-peptidespay.php) builds the payload from the order that already exists,
// including the totals — deliberately NOT the browser, because this store reduces a price
// five different ways and a second implementation of that math in JS is how order 3889
// quoted $0 and charged $45.25.
//
// The order key is required by the backend, so an order id on its own reveals nothing.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const order = searchParams.get('order') || '';
  const key = searchParams.get('key') || '';

  if (!order || !key) {
    return NextResponse.json({ error: 'missing order' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${WP_URL}/wp-json/iw/v1/pp/container-payload?order=${encodeURIComponent(order)}&key=${encodeURIComponent(key)}`,
      { cache: 'no-store' }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'unavailable' }, { status: res.status });
    }
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }
}

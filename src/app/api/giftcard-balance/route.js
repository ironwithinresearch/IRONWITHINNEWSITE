// src/app/api/giftcard-balance/route.js
//
// Server-side proxy for the gift-card balance checker. Forwards the code to the
// WordPress backend (mu-plugin route /wp-json/iw/v1/giftcard-balance) so the
// browser never hits the backend directly (no CORS).

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export async function GET(request) {
  const code = (new URL(request.url).searchParams.get('code') || '').trim();
  if (!code) {
    return NextResponse.json({ valid: false, message: 'Enter a gift card code.' }, { status: 400 });
  }
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/iw/v1/giftcard-balance?code=${encodeURIComponent(code)}`,
      { cache: 'no-store' }
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err) {
    return NextResponse.json({ valid: false, message: 'Could not check balance right now.' }, { status: 502 });
  }
}

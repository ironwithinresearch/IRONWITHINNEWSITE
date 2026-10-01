// src/app/api/hold-ship/route.js
// Server-side proxy for the customer's Hold & Ship Together state (Anniversary Month).
// Forwards the customer JWT to the WordPress backend (mu-plugin iw-hold-ship.php) so the
// browser never hits the backend directly (no CORS). jwt-auth resolves the user.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/hold-ship`, {
      headers: { Authorization: auth },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }
}

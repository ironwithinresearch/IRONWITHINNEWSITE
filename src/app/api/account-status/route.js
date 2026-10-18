// src/app/api/account-status/route.js
// Server-side proxy for the signed-in customer's research-access status
// (iw-research-access.php): pending email confirmation / pending approval / approved.
// GET returns the status; POST asks the backend to re-send the confirmation email.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

async function forward(request, path, method) {
  const auth = request.headers.get('authorization') || '';
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/${path}`, {
      method,
      headers: { Authorization: auth },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }
}

export function GET(request) {
  return forward(request, 'account-status', 'GET');
}

export function POST(request) {
  return forward(request, 'resend-verification', 'POST');
}

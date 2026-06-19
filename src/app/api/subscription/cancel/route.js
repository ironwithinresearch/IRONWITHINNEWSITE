// src/app/api/subscription/cancel/route.js
// Proxy to the WP backend: cancel a Subscribe & Save subscription by token.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

async function cancel(token) {
  if (!token) return NextResponse.json({ success: false, error: 'missing token' }, { status: 400 });
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/subscription/cancel?token=${encodeURIComponent(token)}`, { method: 'POST', cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: 'unavailable' }, { status: 502 });
  }
}

export async function GET(request) {
  return cancel(request.nextUrl.searchParams.get('token') || '');
}
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  return cancel(body.token || request.nextUrl.searchParams.get('token') || '');
}

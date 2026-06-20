// src/app/api/klaviyo-checkout/route.js — proxy that fires a Klaviyo "Started Checkout" event
import { NextResponse } from 'next/server';
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!body.email) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/klaviyo/started-checkout`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store',
    });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.ok ? 200 : res.status });
  } catch { return NextResponse.json({ ok: false }, { status: 502 }); }
}

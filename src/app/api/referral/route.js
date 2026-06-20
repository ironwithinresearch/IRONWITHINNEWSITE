// src/app/api/referral/route.js — JWT proxy for the referral hub
import { NextResponse } from 'next/server';
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';
export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/referral`, { headers: { Authorization: auth }, cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch { return NextResponse.json({ error: 'unavailable' }, { status: 502 }); }
}

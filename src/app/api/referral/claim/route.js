// src/app/api/referral/claim/route.js — record who referred the logged-in user
import { NextResponse } from 'next/server';
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';
export async function POST(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth) return NextResponse.json({ success: false }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/referral/claim`, {
      method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: body.code }), cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch { return NextResponse.json({ success: false }, { status: 502 }); }
}

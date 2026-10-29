// src/app/api/claims/lookup/route.js
//
// Step one of the /claims form: order number + email → that order's line items, so the customer
// picks real items instead of typing names. The backend (iw-claims.php, POST /wp-json/iw/v1/claims/lookup)
// answers with one neutral message whenever the pair doesn't match — it never confirms that an
// order number exists on its own. Same shared secret + forwarded IP as /api/claims.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const WP_URL = 'https://api.ironwithin.io';
const SECRET = process.env.IW_BOT_NOTIFY_SECRET || '';
const NO_MATCH = "We couldn't match that order number and email. Please check both against your order confirmation email.";

export async function POST(request) {
  if (!SECRET) {
    return NextResponse.json({ success: false, error: 'Unavailable right now. Please email support@ironwithin.io.' }, { status: 503 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }
  const order = String(body.order || '').replace(/\D/g, '');
  const email = String(body.email || '').trim();
  if (!order || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: NO_MATCH });
  }
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/claims/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-IW-Bot-Secret': SECRET,
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
      },
      body: JSON.stringify({ order, email }),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return NextResponse.json({ success: false, error: data.error || NO_MATCH }, { status: res.status === 429 ? 429 : 200 });
    }
    return NextResponse.json({ success: true, order: data.order, items: data.items || [] });
  } catch (e) {
    console.error('[claims/lookup] error', e);
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again or email support@ironwithin.io.' }, { status: 500 });
  }
}

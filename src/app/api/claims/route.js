// src/app/api/claims/route.js
//
// Server-side proxy for the /claims form. Forwards the multipart claim (fields + up to 4 photos)
// to the WordPress backend (mu-plugin iw-claims.php, POST /wp-json/iw/v1/claims) with the same
// shared secret the support bot uses, so the backend endpoint is never reachable from a browser.
// The visitor's IP rides along in X-Forwarded-For for the backend's rate limit.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Call the Vultr backend directly (see iw-processor-compliance memo: the old env var pointed at Rocket).
const WP_URL = 'https://api.ironwithin.io';
const SECRET = process.env.IW_BOT_NOTIFY_SECRET || '';

const FALLBACK = 'Your claim could not be sent right now. Please email support@ironwithin.io with your order number.';

export async function POST(request) {
  if (!SECRET) {
    return NextResponse.json({ success: false, error: FALLBACK }, { status: 503 });
  }
  let fd;
  try {
    fd = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }
  // Honeypot — bots fill the hidden field. Pretend success, send nothing.
  if (fd.get('website')) {
    return NextResponse.json({ success: true, claim_id: 0 });
  }
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/claims`, {
      method: 'POST',
      headers: {
        'X-IW-Bot-Secret': SECRET,
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
        'User-Agent': request.headers.get('user-agent') || 'iw-storefront',
      },
      body: fd,
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return NextResponse.json(
        { success: false, field: data.field || '', error: data.error || FALLBACK },
        { status: res.ok ? 200 : (res.status || 500) }
      );
    }
    return NextResponse.json({ success: true, claim_id: data.claim_id, order: data.order, route_protected: !!data.route_protected });
  } catch (e) {
    console.error('[claims] error', e);
    return NextResponse.json({ success: false, error: FALLBACK }, { status: 500 });
  }
}

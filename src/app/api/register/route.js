// src/app/api/register/route.js
// Same-origin proxy for researcher sign-up → backend POST /wp-json/iw/v1/register
// (iw-research-access.php), which validates every field, stores the profile and the
// sign-up acknowledgements, creates the account as PENDING and emails a confirmation link.
// The visitor's IP rides along in X-Forwarded-For for the backend's per-IP throttle.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'iw-storefront',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({ success: false, error: 'Registration failed. Please try again.' }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: 'We could not reach the server. Please try again.' }, { status: 502 });
  }
}

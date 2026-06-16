// src/app/api/contact-challenge/route.js
//
// Returns a fresh captcha challenge (question + signed token) from the WordPress
// backend. Same-origin proxy so the browser never calls the backend directly.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/contact-challenge`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Could not load challenge.' }, { status: 500 });
  }
}

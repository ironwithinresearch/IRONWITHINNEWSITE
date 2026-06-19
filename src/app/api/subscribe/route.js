// src/app/api/subscribe/route.js
//
// Server-side proxy for the email lead-capture popup. Forwards to the WordPress
// backend (mu-plugin route /wp-json/iw/v1/subscribe), which stores the email and
// sends the welcome email with the first-order code. Server-to-server, no CORS.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export async function POST(request) {
  try {
    const { email = '', website = '', source = 'popup' } = await request.json();

    // Honeypot — pretend success, send nothing.
    if (website) return NextResponse.json({ success: true });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const res = await fetch(`${WP_URL}/wp-json/iw/v1/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), source }),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 502 });
  }
}

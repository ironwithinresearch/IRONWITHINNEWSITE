// src/app/api/restock-notify/route.js
//
// Server-side proxy for the "Notify me when it's back" form on a sold-out dose.
// Forwards to the WordPress backend (mu-plugin route /wp-json/iw/v1/restock-notify),
// which stores the email against the variation and mails everyone waiting the moment
// that variation's stock crosses back above zero.
//
// Server-to-server like /api/contact, so there is no CORS to allowlist and the backend
// endpoint is never reachable directly from the browser.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export async function POST(request) {
  try {
    const { email = '', variation = 0, website = '' } = await request.json();

    // Honeypot — bots fill the hidden field. Report success, forward nothing.
    if (website) {
      return NextResponse.json({ success: true });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    if (!Number(variation)) {
      return NextResponse.json(
        { success: false, error: 'Please pick a size first.' },
        { status: 400 }
      );
    }

    const res = await fetch(`${WP_URL}/wp-json/iw/v1/restock-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(email).trim(), variation: Number(variation) }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      // The backend's messages are written for the customer (e.g. the 409 that says the
      // item is already back), so pass them through rather than flattening to "failed".
      return NextResponse.json(
        { success: false, error: data.error || 'Could not save that — please try again.' },
        { status: res.status || 502 }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Could not save that — please try again.' },
      { status: 500 }
    );
  }
}

// src/app/api/contact/route.js
//
// Server-side proxy for the Contact page form. Forwards the message to the
// WordPress backend (mu-plugin route /wp-json/iw/v1/contact), which emails
// support@ironwithin.io via wp_mail. Server-to-server, so no CORS and the
// backend endpoint is never hit directly from the browser.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

export async function POST(request) {
  try {
    const { name = '', email = '', message = '', website = '', captcha_token = '', captcha_answer = '' } = await request.json();

    // Honeypot — bots fill the hidden field. Pretend success, send nothing.
    if (website) {
      return NextResponse.json({ success: true });
    }
    if (!email || !message || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email and a short message.' },
        { status: 400 }
      );
    }

    const res = await fetch(`${WP_URL}/wp-json/iw/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, captcha_token, captcha_answer }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return NextResponse.json(
        { success: false, captcha: !!data.captcha, error: data.error || 'Message could not be sent. Please email support@ironwithin.io directly.' },
        { status: res.status || 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[contact] error', e);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please email support@ironwithin.io directly.' },
      { status: 500 }
    );
  }
}

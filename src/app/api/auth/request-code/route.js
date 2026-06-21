// src/app/api/auth/request-code/route.js
//
// Step 1 of the secure password reset: forwards { email } to the backend, which
// emails a 6-digit code if an account exists. Always returns success (the backend
// is anti-enumeration — it never reveals whether the email maps to an account).

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/password/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({ success: true }));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}

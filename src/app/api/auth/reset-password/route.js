// src/app/api/auth/reset-password/route.js
//
// Step 2 of the secure password reset: forwards { email, code, newPassword } to the
// backend, which verifies the 6-digit code (one-time, 15-min, rate-limited) before
// setting the new password. Replaces the old admin-key direct-reset (which set a
// password from just email + new password — an account-takeover risk).

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function POST(request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ success: false, error: 'Email, code, and a new password are required.' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const res = await fetch(`${WP_URL}/wp-json/iw/v1/password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password: newPassword }),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({ success: false, error: 'Reset failed. Please try again.' }));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}

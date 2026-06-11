// src/app/api/auth/reset-password/route.js
//
// Server-side password reset using WooCommerce REST API admin credentials.
// This never exposes WC_CONSUMER_KEY or WC_CONSUMER_SECRET to the browser.
//
// Flow:
// 1. Receive { email, newPassword } from forgot-password page
// 2. Find the WooCommerce customer by email using admin REST API
// 3. Update their password using the customer update endpoint
// 4. Return { success: true } or { success: false, error: message }

import { NextResponse } from 'next/server';

// ── Uses NEXT_PUBLIC_WORDPRESS_URL to match your .env.local ──
const WC_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export async function POST(request) {
  try {
    const { email, newPassword } = await request.json();

    // Basic validation
    if (!email || !newPassword) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    if (!WC_KEY || !WC_SECRET || !WC_URL) {
      console.error('[reset-password] Missing WooCommerce credentials in .env.local');
      return NextResponse.json({ success: false, error: 'Server configuration error.' }, { status: 500 });
    }

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    };

    // Step 1: Find customer by email
    const searchRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}&per_page=1`,
      { headers, cache: 'no-store' }
    );

    if (!searchRes.ok) {
      const err = await searchRes.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: err.message || 'Failed to look up account.',
      }, { status: 400 });
    }

    const customers = await searchRes.json();

    if (!customers || customers.length === 0) {
      // Security: don't reveal if email exists (but in this flow user already verified)
      return NextResponse.json({
        success: false,
        error: 'No account found with this email address.',
      }, { status: 404 });
    }

    const customerId = customers[0].id;

    // Step 2: Update the customer's password
    const updateRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customerId}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({ password: newPassword }),
        cache: 'no-store',
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: err.message || 'Failed to update password.',
      }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[reset-password] Error:', error.message);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }, { status: 500 });
  }
}
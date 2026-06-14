// TEMPORARY admin route — creates/updates a WooCommerce coupon using the
// server-side WC REST admin credentials (never exposed to the browser).
// Guarded by a one-off token. REMOVE after seeding the coupon.

import { NextResponse } from 'next/server';

const WC_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const SEED_TOKEN = 'iw-seed-7Kq9mZ2xR4';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== SEED_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!WC_KEY || !WC_SECRET || !WC_URL) {
    return NextResponse.json({ error: 'missing WC credentials' }, { status: 500 });
  }

  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
  const headers = { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` };

  const code = (searchParams.get('code') || 'DAD15').trim();
  const action = searchParams.get('action') || 'create';

  // List existing coupons (debug/verify)
  if (action === 'list') {
    const r = await fetch(`${WC_URL}/wp-json/wc/v3/coupons?per_page=50`, { headers, cache: 'no-store' });
    const j = await r.json();
    return NextResponse.json({ ok: r.ok, coupons: Array.isArray(j) ? j.map(c => ({ code: c.code, type: c.discount_type, amount: c.amount, free_shipping: c.free_shipping })) : j });
  }

  const discount_type = searchParams.get('type') || 'percent'; // 'percent' | 'fixed_cart'
  const amount = searchParams.get('amount') || '15';
  const free_shipping = searchParams.get('free_shipping') === 'true';

  // Is there already a coupon with this code?
  const existRes = await fetch(`${WC_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code)}`, { headers, cache: 'no-store' });
  const existing = await existRes.json();
  const body = JSON.stringify({
    code,
    discount_type,
    amount: String(amount),
    free_shipping,
    description: "Father's Day Sale",
    individual_use: false,
  });

  let res, data;
  if (Array.isArray(existing) && existing.length > 0) {
    // update in place
    res = await fetch(`${WC_URL}/wp-json/wc/v3/coupons/${existing[0].id}`, { method: 'PUT', headers, body });
    data = await res.json();
    return NextResponse.json({ ok: res.ok, action: 'updated', coupon: { code: data.code, type: data.discount_type, amount: data.amount, free_shipping: data.free_shipping } });
  } else {
    res = await fetch(`${WC_URL}/wp-json/wc/v3/coupons`, { method: 'POST', headers, body });
    data = await res.json();
    return NextResponse.json({ ok: res.ok, action: 'created', coupon: { code: data.code, type: data.discount_type, amount: data.amount, free_shipping: data.free_shipping }, raw: res.ok ? undefined : data });
  }
}

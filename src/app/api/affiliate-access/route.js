// src/app/api/affiliate-access/route.js
// Validates the shared affiliate password and, on success, sets the gate cookie
// that src/middleware.js checks. The cookie stores a hash of the password (not the
// password itself), so rotating AFFILIATE_ACCESS_PASSWORD auto-invalidates old cookies.

import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Must match tokenFor() in src/middleware.js (same input → same SHA-256 hex).
function tokenFor(pw) {
  return crypto.createHash('sha256').update('iwaff:v1:' + pw).digest('hex');
}

// Lightweight per-IP brute-force throttle. Module scope persists across invocations
// on a warm instance — not bulletproof across regions, but meaningfully slows a
// single-source password-guessing attack. Cleared on a correct password.
const FAILS = new Map(); // ip -> { count, first }
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 8;
function clientIp(request) {
  const xff = request.headers.get('x-forwarded-for') || '';
  return xff.split(',')[0].trim() || 'unknown';
}

export async function POST(request) {
  let body = {};
  try { body = await request.json(); } catch { /* noop */ }

  const pw = process.env.AFFILIATE_ACCESS_PASSWORD;
  if (!pw) return NextResponse.json({ ok: false, error: 'Affiliate access is not configured yet.' }, { status: 503 });

  const ip = clientIp(request);
  const now = Date.now();
  const rec = FAILS.get(ip);
  if (rec && now - rec.first > WINDOW_MS) FAILS.delete(ip);
  const cur = FAILS.get(ip);
  if (cur && cur.count >= MAX_FAILS) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 });
  }

  const supplied = (body.password || '').toString();
  const a = Buffer.from(tokenFor(supplied));
  const b = Buffer.from(tokenFor(pw));
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) {
    const r = FAILS.get(ip) || { count: 0, first: now };
    FAILS.set(ip, { count: r.count + 1, first: r.first });
    return NextResponse.json({ ok: false, error: 'Incorrect password.' }, { status: 401 });
  }
  FAILS.delete(ip); // success clears the counter

  // Only ever redirect back into the affiliate section (no open redirect).
  let next = (body.next || '/affiliate').toString();
  if (!next.startsWith('/affiliate')) next = '/affiliate';

  const res = NextResponse.json({ ok: true, next });
  res.cookies.set('iw_aff_gate', tokenFor(pw), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 120, // 120 days
  });
  return res;
}

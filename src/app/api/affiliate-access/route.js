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

export async function POST(request) {
  let body = {};
  try { body = await request.json(); } catch { /* noop */ }

  const pw = process.env.AFFILIATE_ACCESS_PASSWORD;
  if (!pw) return NextResponse.json({ ok: false, error: 'Affiliate access is not configured yet.' }, { status: 503 });

  const supplied = (body.password || '').toString();
  const a = Buffer.from(tokenFor(supplied));
  const b = Buffer.from(tokenFor(pw));
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return NextResponse.json({ ok: false, error: 'Incorrect password.' }, { status: 401 });

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

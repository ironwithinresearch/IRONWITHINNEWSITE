// src/middleware.js
// Password-gates the entire /affiliate section behind a single shared password.
// The password lives in the AFFILIATE_ACCESS_PASSWORD env var (Vercel). Visitors
// without a valid gate cookie are redirected to /affiliate-access to enter it.
// Runs on the Edge runtime → use Web Crypto (crypto.subtle), not node:crypto.

import { NextResponse } from 'next/server';

const COOKIE = 'iw_aff_gate';

// SHA-256 hex of a namespaced password. MUST match tokenFor() in
// src/app/api/affiliate-access/route.js so the cookie set there validates here.
async function tokenFor(pw) {
  const data = new TextEncoder().encode('iwaff:v1:' + pw);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(req) {
  const pw = process.env.AFFILIATE_ACCESS_PASSWORD;
  // Fail open if unconfigured — never brick the affiliate section on a missing env.
  if (!pw) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (token && token === (await tokenFor(pw))) return NextResponse.next();

  const nextPath = req.nextUrl.pathname + (req.nextUrl.search || '');
  const url = req.nextUrl.clone();
  url.pathname = '/affiliate-access';
  url.search = '';
  url.searchParams.set('next', nextPath);
  return NextResponse.redirect(url);
}

// Only guard the affiliate section. /affiliate-access and /api/* are NOT matched.
export const config = {
  matcher: ['/affiliate', '/affiliate/:path*'],
};

// src/app/api/age-confirm/route.js
//
// The server-side 21+ gate's "Yes, I'm 21 or older" buttons land here. Setting the
// cookie on the server (rather than in page JS) means the gate works with JavaScript
// off, and the redirect is restricted to same-site paths.

import { NextResponse } from 'next/server';
import { AGE_COOKIE, AGE_COOKIE_MAX_AGE } from '@/lib/gate';

export function GET(request) {
  const url = new URL(request.url);
  let next = url.searchParams.get('next') || '/';
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) next = '/';

  const res = NextResponse.redirect(new URL(next, url.origin), 303);
  res.cookies.set(AGE_COOKIE, '1', {
    path: '/',
    maxAge: AGE_COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
  });
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

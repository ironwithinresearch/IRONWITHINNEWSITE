// src/app/api/age-confirm/route.js
//
// The server-side 21+ gate's form lands here (two required boxes: 21+ and research use only). Setting the
// cookie on the server (rather than in page JS) means the gate works with JavaScript
// off, and the redirect is restricted to same-site paths.

import { NextResponse } from 'next/server';
import { AGE_COOKIE, AGE_COOKIE_MAX_AGE } from '@/lib/gate';

export function GET(request) {
  const url = new URL(request.url);
  let next = url.searchParams.get('next') || '/';
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) next = '/';

  // Both entry boxes are required (processor rescan 20 Oct 2026). Without them, send the
  // visitor back to the page they wanted, which shows the gate again.
  if (url.searchParams.get('age21') !== '1' || url.searchParams.get('ruo') !== '1') {
    let want = new URL(next, url.origin).searchParams.get('redirect') || '/';
    if (!want.startsWith('/') || want.startsWith('//') || want.startsWith('/\\')) want = '/';
    const back = NextResponse.redirect(new URL(want, url.origin), 303);
    back.headers.set('Cache-Control', 'no-store');
    return back;
  }

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

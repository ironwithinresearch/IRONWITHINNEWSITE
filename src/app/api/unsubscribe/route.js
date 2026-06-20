// src/app/api/unsubscribe/route.js
// One-click List-Unsubscribe endpoint (on the sending domain). POST = RFC 8058
// one-click (Gmail/Apple fire this); GET = a person clicked the link in a browser.
// Both record the opt-out via the WordPress backend.

import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site';

async function record(e, t) {
  if (!e || !t) return;
  try {
    await fetch(`${WP_URL}/wp-json/iw/v1/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ e, t }),
      cache: 'no-store',
    });
  } catch {}
}

export async function POST(request) {
  const u = new URL(request.url);
  await record(u.searchParams.get('e'), u.searchParams.get('t'));
  return new NextResponse(null, { status: 200 });
}

export async function GET(request) {
  const u = new URL(request.url);
  const e = (u.searchParams.get('e') || '').replace(/[<>&"]/g, '');
  await record(u.searchParams.get('e'), u.searchParams.get('t'));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed — Iron Within Research</title></head>
<body style="margin:0;background:#030712;color:#e5e7eb;font-family:system-ui,-apple-system,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center">
<div style="max-width:460px;padding:32px">
<img src="https://www.ironwithin.io/logo-mark.png" alt="Iron Within Research" width="64" height="64" style="border-radius:14px;margin-bottom:18px">
<h1 style="color:#00cfff;font-size:1.35rem;margin:0 0 10px">You've been unsubscribed</h1>
<p style="color:#9ca3af;line-height:1.6;font-size:0.95rem;margin:0 0 18px">${e || 'You'} will no longer receive non-essential emails from Iron Within Research. You'll still get order and shipping confirmations for any purchases you make.</p>
<a href="https://www.ironwithin.io" style="display:inline-block;padding:11px 24px;background:linear-gradient(90deg,#00cfff,#c026d3);border-radius:10px;color:#fff;font-weight:700;text-decoration:none">Return to ironwithin.io</a>
</div></body></html>`;
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

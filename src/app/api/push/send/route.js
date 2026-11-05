// src/app/api/push/send/route.js
//
// The push SENDER. Called only by the WordPress backend (iw-app-push.php) with the shared
// secret in X-IW-Push-Secret (IW_PUSH_SEND_SECRET, set in Vercel and in wp-config.php).
// It encrypts + VAPID-signs each message with npm `web-push` and reports per-device
// results, so WordPress can delete subscriptions the push service says are gone (404/410).
// The VAPID private key exists only here (Vercel env VAPID_PRIVATE_KEY).

import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import webpush from 'web-push';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function secretOk(given) {
  const want = process.env.IW_PUSH_SEND_SECRET || '';
  if (want.length < 32 || !given) return false;
  const a = Buffer.from(String(given)), b = Buffer.from(want);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const clip = (s, n) => String(s || '').slice(0, n);

export async function POST(request) {
  if (!secretOk(request.headers.get('x-iw-push-secret'))) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return NextResponse.json({ error: 'push not configured' }, { status: 500 });
  webpush.setVapidDetails('mailto:support@ironwithin.io', pub, priv);

  const { messages = [] } = await request.json().catch(() => ({}));
  if (!Array.isArray(messages) || messages.length > 500) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  const results = [];
  // Small fixed concurrency: fast enough for a restock blast, gentle on the push services.
  let i = 0;
  async function worker() {
    while (i < messages.length) {
      const m = messages[i++];
      const sub = m?.subscription;
      if (!sub?.endpoint || !/^https:\/\//.test(sub.endpoint) || !sub.keys?.p256dh || !sub.keys?.auth) {
        results.push({ id: m?.id, ok: false, status: 400 });
        continue;
      }
      const p = m.payload || {};
      const payload = JSON.stringify({
        title: clip(p.title, 120), body: clip(p.body, 240), url: clip(p.url, 500), tag: clip(p.tag, 64),
      });
      try {
        const r = await webpush.sendNotification(sub, payload, { TTL: 86400, urgency: 'high', timeout: 10000 });
        results.push({ id: m.id, ok: true, status: r.statusCode });
      } catch (e) {
        results.push({ id: m.id, ok: false, status: e?.statusCode || 0 });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(10, messages.length) }, worker));
  return NextResponse.json({ results }, { headers: { 'Cache-Control': 'no-store' } });
}

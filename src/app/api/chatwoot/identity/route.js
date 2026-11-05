// src/app/api/chatwoot/identity/route.js
//
// Support chat identity for the app's Help tab. The signed-in customer's JWT is checked
// by the backend (/wp-json/iw/v1/push/me); we then return the details Chatwoot's
// setUser() needs plus identifier_hash = HMAC-SHA256(identifier, inbox HMAC token), so
// agents see the real customer and nobody can pose as someone else in the chat.
// The HMAC token stays server-side (Vercel env CHATWOOT_HMAC_TOKEN).

import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  const key = process.env.CHATWOOT_HMAC_TOKEN;
  if (!auth.startsWith('Bearer ') || !key) return NextResponse.json({ error: 'unavailable' }, { status: 401 });
  try {
    const res = await fetch('https://api.ironwithin.io/wp-json/iw/v1/push/me', {
      headers: { Authorization: auth }, cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'signed out' }, { status: 401 });
    const me = await res.json();
    if (!me?.id) return NextResponse.json({ error: 'signed out' }, { status: 401 });
    const identifier = `iw-customer-${me.id}`;
    const identifier_hash = crypto.createHmac('sha256', key).update(identifier).digest('hex');
    return NextResponse.json(
      { identifier, identifier_hash, email: me.email, name: me.name, customerId: me.id },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }
}

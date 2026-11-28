// POST /api/christmas/redeem — redeem the code printed on a Golden Ticket card. Forwards the customer's JWT
// to iw-xmas.php (POST /wp-json/iw/v1/christmas/redeem), which checks the code (single use, rate limited per
// account and per IP) and adds the store credit. The backend's message is passed through unchanged.
import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://api.ironwithin.io';

export async function POST(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth) return NextResponse.json({ ok: false, status: 'login', message: 'Please sign in to your Iron Within account to redeem a Golden Ticket.' }, { status: 401 });
  let body;
  try { body = await request.json(); } catch { body = null; }
  const code = String(body?.code || '').slice(0, 40);
  if (!code.trim()) return NextResponse.json({ ok: false, status: 'invalid', message: 'Please enter the code printed on your card.' }, { status: 400 });
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || '';
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/christmas/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth, 'x-iw-client-ip': ip },
      body: JSON.stringify({ code }),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => null);
    if (!data || typeof data.message !== 'string') {
      const msg = res.status === 401 || res.status === 403 ? 'Your sign-in has expired. Please sign in again and retry.' : 'Nothing was redeemed. Please try again, or email support@ironwithin.io.';
      return NextResponse.json({ ok: false, status: 'error', message: msg }, { status: res.status === 401 || res.status === 403 ? 401 : 502 });
    }
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false, status: 'error', message: 'We could not reach the store, so nothing was redeemed. Please try again.' }, { status: 502 });
  }
}

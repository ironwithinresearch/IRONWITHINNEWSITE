// POST /api/bf-giveaway — the free entry form on /giveaway. Server-to-server proxy to the backend
// (mu-plugin iw-bf-giveaway.php, POST /wp-json/iw/v1/bf-giveaway/enter), which validates, dedupes
// by email, rate-limits per IP and stores the entry. The backend's own message is passed through
// unchanged so the visitor is told exactly what happened (entered / already entered / not stored).
import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://api.ironwithin.io';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = null; }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, status: 'invalid', message: 'We could not read the form. Please try again.' }, { status: 400 });
  }
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || '';
  const payload = {
    name: String(body.name || '').slice(0, 120),
    email: String(body.email || '').slice(0, 190),
    state: String(body.state || '').slice(0, 2),
    age21: body.age21 === true,
    us_resident: body.us_resident === true,
    website: String(body.website || ''),
  };
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/bf-giveaway/enter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-iw-client-ip': ip },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => null);
    if (!data || typeof data.message !== 'string') {
      return NextResponse.json({ ok: false, status: 'error', message: 'We could not save your entry. Please try again, or email support@ironwithin.io.' }, { status: 502 });
    }
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false, status: 'error', message: 'We could not reach the entry system, so your entry was not stored. Please try again, or email support@ironwithin.io.' }, { status: 502 });
  }
}

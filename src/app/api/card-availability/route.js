import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const raw = new URL(request.url).searchParams.get('amount');
  const amount = Number(raw);
  if (raw === null || raw.trim() === '' || !Number.isFinite(amount) || amount < 0 || amount > 1000000) {
    return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
  }
  try {
    const response = await fetch(`https://api.ironwithin.io/wp-json/iw/v1/card-availability?amount=${amount.toFixed(2)}`, {
      cache: 'no-store', signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Availability lookup failed');
    const data = await response.json();
    if (typeof data.stripeAvailable !== 'boolean' || typeof data.legacyAvailable !== 'boolean') throw new Error('Invalid availability');
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Card availability is temporarily unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

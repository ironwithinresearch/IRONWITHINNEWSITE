// GET /api/card-rail — which rail card payments take right now.
//
// PayPal runs the card option until the day's PayPal allowance is used, then card falls back to
// the acquirer rotator until the 6am Central reset. The backend owns the arithmetic
// (mu-plugin iw-card-daily-cap.php); this only carries the answer to the browser.
//
// Deliberately uncached. A cached answer keeps sending buyers to a rail the day has already
// finished with, and the failure is silent — they would simply be paying on the wrong processor.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKEND = 'https://bhidasowgm.onrocket.site';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/wp-json/iw/v1/card-rail`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // Fall back to the ROTATOR, never to PayPal. The rotator is the always-available rail;
    // defaulting to PayPal on a failed lookup would keep pushing volume at an allowance we
    // could not read and might already have spent.
    return NextResponse.json({ rail: 'rotator', reason: 'lookup failed' });
  }
}

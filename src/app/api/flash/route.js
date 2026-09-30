// GET /api/flash — the flash-window schedule and the live window's items (mu-plugin iw-flash.php).
//
// Checkout uses it to drop the card option when a flash item is in the cart (flash items are
// P2P only), and FlashBar uses it to count down. Uncached: the answer flips on the minute.
// The backend enforces P2P-only on its own at order creation; this is the courtesy layer.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKEND = 'https://bhidasowgm.onrocket.site';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/wp-json/iw/v1/flash`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ active: false, variations: [], windows: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

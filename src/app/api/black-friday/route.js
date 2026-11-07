// GET /api/black-friday — the live sale-day config (B1G2 SKUs, sale-day windows, and the rate list
// generated from IW_BF_RATES) plus the giveaway window, from the backend. Same-origin, cached 60s.
import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://api.ironwithin.io';
export const revalidate = 60;

export async function GET() {
  try {
    const [sale, gw] = await Promise.all([
      fetch(`${WP_URL}/wp-json/iw/v1/black-friday`, { next: { revalidate: 60 } }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${WP_URL}/wp-json/iw/v1/bf-giveaway`, { next: { revalidate: 60 } }).then((r) => (r.ok ? r.json() : null)),
    ]);
    if (!sale) return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true, sale, giveaway: gw }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

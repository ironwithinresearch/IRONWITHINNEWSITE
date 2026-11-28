// GET /api/christmas — 25 Days of Christmas calendar from the backend (iw-xmas.php, GET /wp-json/iw/v1/christmas):
// which day is live, past + today's themes (future themes are never sent), and today's on-sale product slugs.
// Same-origin, cached 60s at the edge so a busy midnight does not hammer the store.
import { NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://api.ironwithin.io';
export const revalidate = 60;

export async function GET() {
  try {
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/christmas`, { next: { revalidate: 60 } });
    if (!res.ok) return NextResponse.json({ ok: false }, { status: 502 });
    const data = await res.json();
    return NextResponse.json({ ok: true, ...data }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60' } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

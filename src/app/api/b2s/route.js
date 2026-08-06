// Back 2 School progress proxy. Same-origin for the browser, so no CORS and no
// backend origin allowlisting needed. Cached briefly — the backend caches 60s too.
export const dynamic = 'force-dynamic';

const BACKEND = 'https://bhidasowgm.onrocket.site/wp-json/iw/v1/b2s';

export async function GET() {
  try {
    const r = await fetch(BACKEND, { next: { revalidate: 30 } });
    if (!r.ok) throw new Error(`backend ${r.status}`);
    const data = await r.json();
    return Response.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' },
    });
  } catch (e) {
    // Never break the homepage over the tracker — return a dormant payload.
    return Response.json({ running: false, error: String(e.message || e) }, { status: 200 });
  }
}

// Route Package Protection quote, proxied through our own origin.
//
// The browser never talks to api.route.com directly: the site CSP does not allowlist it
// (nor cdn.routeapp.io, which is why we render our own checkbox instead of Route's widget),
// and proxying keeps the token server-side. The backend mu-plugin does the actual quoting
// so there is exactly one place that knows how to call Route.
export const dynamic = 'force-dynamic';

const BACKEND = 'https://bhidasowgm.onrocket.site/wp-json/iw/v1/route-quote';

export async function GET(req) {
  const subtotal = new URL(req.url).searchParams.get('subtotal') || '0';
  try {
    const r = await fetch(`${BACKEND}?subtotal=${encodeURIComponent(subtotal)}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(`backend ${r.status}`);
    return Response.json(await r.json());
  } catch {
    // Never let a quote failure block checkout — no quote just means no protection offered.
    return Response.json({ enabled: false, insurance_price: null });
  }
}

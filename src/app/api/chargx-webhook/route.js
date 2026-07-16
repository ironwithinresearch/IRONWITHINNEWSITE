// ChargeX webhook proxy. ChargeX (Svix) can't deliver directly to the Rocket.net WordPress
// backend (its IPs appear firewalled), so we receive the webhook here on Vercel — which ChargeX
// can reach — and forward it byte-for-byte (raw body + Webhook-* signature headers preserved) to
// the backend mu-plugin route, which verifies the signature and marks the order paid.
export const dynamic = 'force-dynamic';

const BACKEND = 'https://bhidasowgm.onrocket.site/wp-json/iw/v1/chargx-webhook';

export async function POST(req) {
  const raw = await req.text();
  const h = (k) => req.headers.get(k) || '';
  try {
    const res = await fetch(BACKEND, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'curl/8.4.0', // an agent the backend firewall lets through
        'Webhook-Id': h('webhook-id'),
        'Webhook-Timestamp': h('webhook-timestamp'),
        'Webhook-Signature': h('webhook-signature'),
        'X-Chargx-Proxy': '1',
      },
      body: raw,
    });
    const text = await res.text();
    console.log('[chargx-proxy] forwarded → backend', res.status, text.slice(0, 200));
    // Pass the backend's success/failure back to ChargeX so it retries on real failures.
    return new Response(text || JSON.stringify({ ok: res.ok }), {
      status: res.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[chargx-proxy] forward failed:', String(e));
    return new Response(JSON.stringify({ ok: false, error: 'forward_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Health check + ?diag=1 probes which backend channel gets through Cloudflare from Vercel's servers.
export async function GET(req) {
  const u = new URL(req.url);
  if (u.searchParams.get('diag') !== '1') {
    return new Response(JSON.stringify({ ok: true, note: 'ChargeX webhook proxy alive' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }
  const isChallenge = (t) => /just a moment|challenge-platform|cf-mitigated|__cf_chl/i.test(t);
  const out = {};
  // 1) GraphQL endpoint
  try {
    const r = await fetch('https://bhidasowgm.onrocket.site/graphql', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ generalSettings { title } }' }),
    });
    const t = await r.text();
    out.graphql = { status: r.status, challenged: isChallenge(t), sample: t.slice(0, 90) };
  } catch (e) { out.graphql = { error: String(e) }; }
  // 2) REST webhook route
  try {
    const r = await fetch('https://bhidasowgm.onrocket.site/wp-json/iw/v1/chargx-webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"diag":1}',
    });
    const t = await r.text();
    out.rest = { status: r.status, challenged: isChallenge(t), sample: t.slice(0, 90) };
  } catch (e) { out.rest = { error: String(e) }; }
  return new Response(JSON.stringify(out, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

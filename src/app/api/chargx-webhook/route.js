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

// Health check.
export async function GET() {
  return new Response(JSON.stringify({ ok: true, note: 'ChargeX webhook proxy alive' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

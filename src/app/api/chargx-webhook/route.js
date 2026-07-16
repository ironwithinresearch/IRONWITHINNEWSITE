// ChargeX webhook receiver. ChargeX (Svix) can reach Vercel reliably but the WordPress backend
// sits behind Cloudflare, which intermittently challenges the REST route. So we receive here,
// verify ChargeX's signature, and mark the order paid via a guarded GraphQL mutation — /graphql
// is Cloudflare-whitelisted (the whole headless site renders through it), so it's reliable.
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const GRAPHQL = 'https://bhidasowgm.onrocket.site/graphql';
// Comma-separated: we try every candidate secret; the one that verifies is the live one.
const WH_SECRETS = (process.env.CHARGX_WEBHOOK_SECRET || '').split(',').map((s) => s.trim()).filter(Boolean);
const INTERNAL_SECRET = process.env.CHARGX_INTERNAL_SECRET || '';
const STRICT = process.env.CHARGX_WH_STRICT === '1';

const isChallenge = (t) => /just a moment|challenge-platform|__cf_chl|cf-mitigated/i.test(t || '');

// ChargeX: HMAC-SHA256(secret, `${timestamp}.${rawBody}`), header Webhook-Signature = "v1=<sig>".
// The exact secret encoding isn't documented, so try the common variants (utf8 key, hex-decoded
// key, base64-decoded key) in hex and base64 output; discovery log tells us which matched.
function verifySig(raw, ts, sigHeader) {
  if (!ts || !sigHeader || !WH_SECRETS.length) return false;
  const signed = `${ts}.${raw}`;
  const cands = [];
  const add = (key) => {
    try {
      cands.push(crypto.createHmac('sha256', key).update(signed).digest('hex'));
      cands.push(crypto.createHmac('sha256', key).update(signed).digest('base64'));
    } catch { /* skip */ }
  };
  for (const secret of WH_SECRETS) {
    add(secret);
    try { const b = Buffer.from(secret, 'hex'); if (b.length >= 16) add(b); } catch { /* not hex */ }
    try { const s = secret.replace(/^(whsec_|sk_)/, ''); const b = Buffer.from(s, 'base64'); if (b.length >= 16) add(b); } catch { /* not b64 */ }
  }
  for (const part of sigHeader.trim().split(/\s+/)) {
    const val = part.replace(/^v1[=,]/, '');
    for (const c of cands) {
      if (c.length === val.length) {
        try { if (crypto.timingSafeEqual(Buffer.from(c), Buffer.from(val))) return true; } catch { /* len */ }
      }
    }
  }
  return false;
}

let lastErr = null;
async function callGraphql(query, variables) {
  lastErr = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(GRAPHQL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // no custom UA — Cloudflare challenges those
        body: JSON.stringify({ query, variables }),
      });
      const text = await res.text();
      if (res.ok && !isChallenge(text)) {
        try { return JSON.parse(text); } catch { return { raw: text }; }
      }
      lastErr = { status: res.status, challenged: isChallenge(text), sample: text.slice(0, 160) };
    } catch (e) { lastErr = { thrown: String(e) }; }
    await new Promise((r) => setTimeout(r, 300));
  }
  return null;
}

export async function POST(req) {
  const raw = await req.text();
  const ts = req.headers.get('webhook-timestamp') || '';
  const sig = req.headers.get('webhook-signature') || '';
  const verified = verifySig(raw, ts, sig);

  console.log('[chargx-wh] verified=', verified, 'ts=', ts, 'sig=', sig, 'body=', raw.slice(0, 400));

  if (STRICT && !verified) {
    return new Response(JSON.stringify({ error: 'signature' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let data; try { data = JSON.parse(raw); } catch { data = {}; }
  const obj = (data && data.data && data.data.object) || (data && data.object) || data || {};
  const event = (data && (data.type || data.event)) || '';
  const status = String(obj.status || '').toLowerCase();
  const ext = parseInt(obj.external_order_id || 0, 10);
  const success = /succeed|paid|captur/i.test(event) ||
    ['paid', 'succeeded', 'captured', 'complete', 'completed', 'approved'].includes(status);

  if (!ext) return Response.json({ ok: true, verified, note: 'no external_order_id' });
  if (!success) return Response.json({ ok: true, verified, note: `event "${event}" ignored` });

  const mutation = 'mutation MarkPaid($input: ChargxMarkPaidInput!) { chargxMarkPaid(input: $input) { success status } }';
  const variables = { input: {
    externalOrderId: ext,
    chargxOrderId: String(obj.order_id || ''),
    orderDisplayId: String(obj.order_display_id || ''),
    secret: INTERNAL_SECRET,
    clientMutationId: 'chargx',
  } };
  const result = await callGraphql(mutation, variables);
  const payload = result && result.data && result.data.chargxMarkPaid;
  console.log('[chargx-wh] mark-paid →', JSON.stringify(payload || result));

  if (payload && payload.success) {
    return Response.json({ ok: true, verified, order: ext, status: payload.status });
  }
  // Not confirmed — 502 so ChargeX retries the webhook.
  return new Response(JSON.stringify({ ok: false, verified, order: ext, gql: result || null, lastErr }), {
    status: 502, headers: { 'Content-Type': 'application/json' },
  });
}

// Health + ?diag=1 channel probe.
export async function GET(req) {
  const u = new URL(req.url);
  if (u.searchParams.get('diag') !== '1') {
    return new Response(JSON.stringify({ ok: true, note: 'ChargeX webhook receiver alive' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }
  const out = {};
  try {
    const r = await fetch(GRAPHQL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: '{ generalSettings { title } }' }) });
    const t = await r.text();
    out.graphql = { status: r.status, challenged: isChallenge(t), sample: t.slice(0, 90) };
  } catch (e) { out.graphql = { error: String(e) }; }
  return new Response(JSON.stringify(out, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

// src/app/api/chat/route.js
// Iron Within support agent. Claude Haiku 4.5 + tools that hit the live WooCommerce
// backend: look up orders (identity-verified), create $0 replacement orders for
// missing/damaged items, and escalate to email. Research-use-only guardrail routes
// dosing questions to peptideparadigm.com. Server-side only — no secret reaches the browser.

import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 30;

const WC_URL   = process.env.WC_URL || 'https://bhidasowgm.onrocket.site';
const WC_KEY   = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;
const NOTIFY_SECRET = process.env.IW_BOT_NOTIFY_SECRET || '';
const REPLACEMENT_MODE = process.env.IW_CHAT_REPLACEMENT_MODE || 'simulate'; // 'simulate' | 'live'
const SS_BASE = process.env.SHIPSTATION_BASE || 'https://api.shipstation.com/v2';
const SS_KEY = process.env.SHIPSTATION_API_KEY;

const wcAuth = 'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
const wc = async (path, opts = {}) => {
  const r = await fetch(`${WC_URL}/wp-json/wc/v3${path}`, {
    ...opts,
    headers: { Authorization: wcAuth, 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
};
const notify = async (payload) => {
  try {
    await fetch(`${WC_URL}/wp-json/iw/v1/bot-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-IW-Bot-Secret': NOTIFY_SECRET },
      body: JSON.stringify(payload),
    });
  } catch { /* non-fatal */ }
};

// Live carrier status for an order via ShipStation (already knows the UPS status).
// Matches the order's stored tracking number to the right label (an order can have stale labels).
async function shipStatus(orderId, trackingNumber) {
  if (!SS_KEY) return null;
  try {
    const r = await fetch(`${SS_BASE}/labels?external_shipment_id=${orderId}`, { headers: { 'API-Key': SS_KEY } });
    if (!r.ok) return null;
    const labels = (await r.json()).labels || [];
    if (!labels.length) return null;
    let lab = trackingNumber ? labels.find((l) => l.tracking_number === trackingNumber) : null;
    if (!lab) lab = labels.slice().sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];
    const out = { status: lab.tracking_status || null, tracking: lab.tracking_number, carrier: lab.carrier_code };
    try {
      const t = await fetch(`${SS_BASE}/labels/${lab.label_id}/track`, { headers: { 'API-Key': SS_KEY } });
      if (t.ok) {
        const d = await t.json();
        out.status = d.status_description || d.carrier_status_description || out.status;
        out.estimated_delivery = d.estimated_delivery_date || null;
        out.delivered_on = d.actual_delivery_date || null;
        const ev = (d.events || [])[0];
        if (ev) out.last_scan = [ev.description, ev.city_locality, ev.state_province].filter(Boolean).join(' ').trim();
      }
    } catch { /* detail optional */ }
    return out;
  } catch { return null; }
}

const SYSTEM = `You are the Iron Within Research support agent — the chat assistant on ironwithin.io, a store that sells research-grade peptides and compounds. Be warm, upbeat, and concise (2–4 sentences). Use emoji sparingly.

## HARD RULE — research use only (never break)
Iron Within products are sold FOR RESEARCH PURPOSES ONLY and are not for human consumption. NEVER give medical, health, dosing, protocol, reconstitution, cycling, stacking, benefits, side-effect, or usage advice yourself. When someone asks about dosing, "how much to inject/take", protocols, or how to use a compound: do NOT advise — point them to **Peptide Paradigm**, a free education + dosage-tracking tool, at **www.peptideparadigm.com**, and offer to help with orders, COAs, shipping, or account instead. One or two friendly sentences.

## You can take real actions with tools
- **lookup_order** — check an order's status, its items, and its **live carrier delivery status** (the tool returns live_delivery_status like "Delivered"/"In Transit"/"Out for Delivery" plus estimated_delivery, delivered_on, and the last_scan location — straight from the carrier via ShipStation). Report it in plain, friendly language (e.g. "It was delivered on July 9" or "It's in transit, estimated to arrive July 12 — last scanned in Louisville, KY"). You MUST have the order number AND the email on the account; if the tool says the email doesn't match, reveal nothing and ask them to confirm the email on the order.
- **create_replacement** — if a customer reports a missing, damaged, wrong, or leaking item, verify their identity with lookup first, look carefully at any photo they attached, and if the item really is missing/damaged, create a free $0 replacement (free shipping). Only replace items that were actually on that order. Confirm which item before replacing. Never replace the same item twice — if the tool says it was already replaced, escalate instead.
- **escalate_to_support** — email the team for anything you can't resolve, billing/payment problems, or when the customer asks for a human. Ask for their email first.

## Store facts
COA on every order (third-party lab-tested, 99%+ purity, browse at ironwithin.io/lab-reports). Ships US/Canada/international with real tracking; free US shipping over a threshold. Damaged/wrong item → we make it right. Pay by card or Zelle/Venmo/Cash App. A quick 21+ account is required to check out; password reset emails a 6-digit code. IWR Rewards: 5 points per $1, 250 welcome, 500 = $5 off (ironwithin.io/rewards). Affiliate program: 10–20% commission, optional 2× store credit. Support email: support@ironwithin.io.`;

// ---- tools ----
const TOOLS = [
  { name: 'lookup_order', description: 'Look up an order status, tracking, and items. Requires order_number and the account email.',
    input_schema: { type: 'object', properties: { order_number: { type: 'string' }, email: { type: 'string' } }, required: ['order_number', 'email'] } },
  { name: 'create_replacement', description: 'Create a free $0 replacement order for a verified missing/damaged item.',
    input_schema: { type: 'object', properties: { order_number: { type: 'string' }, email: { type: 'string' }, item_name: { type: 'string' }, reason: { type: 'string' } }, required: ['order_number', 'email', 'item_name', 'reason'] } },
  { name: 'escalate_to_support', description: 'Email the support team.',
    input_schema: { type: 'object', properties: { summary: { type: 'string' }, customer_email: { type: 'string' } }, required: ['summary'] } },
];

async function lookupOrder({ order_number, email }) {
  const id = String(order_number || '').replace(/[^0-9]/g, '');
  if (!id) return { found: false, reason: 'need a valid order number' };
  const { ok, data: o } = await wc(`/orders/${id}`);
  if (!ok) return { found: false, reason: 'no order with that number' };
  const onAcct = (o.billing?.email || '').toLowerCase();
  if (!email || onAcct !== String(email).toLowerCase())
    return { verified: false, note: 'Email does not match the account on this order. Do NOT reveal order details; ask them to confirm the email on the order.' };
  const meta = Object.fromEntries((o.meta_data || []).map((m) => [m.key, m.value]));
  const shipped = o.status === 'shipped' || o.status === 'completed';
  const delivery = (shipped || meta._tracking_number) ? await shipStatus(id, meta._tracking_number) : null;
  return {
    verified: true, order: id, status: o.status, shipped,
    tracking: meta._tracking_number || null, carrier: meta._tracking_provider || null,
    live_delivery_status: delivery?.status || null,       // e.g. Delivered / In Transit / Out for Delivery / Exception
    estimated_delivery: delivery?.estimated_delivery || null,
    delivered_on: delivery?.delivered_on || null,
    last_scan: delivery?.last_scan || null,
    items: (o.line_items || []).map((l) => ({ name: l.name, qty: l.quantity, product_id: l.product_id, variation_id: l.variation_id })),
    already_replaced: Array.isArray(meta._iw_bot_replaced) ? meta._iw_bot_replaced : [],
  };
}

async function createReplacement({ order_number, email, item_name, reason }) {
  const v = await lookupOrder({ order_number, email });
  if (!v.verified) return v;
  const key = String(item_name || '').toLowerCase().split(/[\s(]/)[0];
  const line = (v.items || []).find((i) => i.name.toLowerCase().includes(key));
  if (!line) return { ok: false, note: `"${item_name}" wasn't on order #${v.order}. Items on the order: ${v.items.map((i) => i.name).join(', ')}. Only replace purchased items.` };
  if ((v.already_replaced || []).some((x) => String(x).includes(line.name)))
    return { ok: false, note: 'That item was already replaced once on this order — do not replace again; escalate to a human.' };

  const { data: o } = await wc(`/orders/${v.order}`);

  // Safe launch default: unless replacements are explicitly LIVE, route to a human
  // (email the team) instead of auto-creating/shipping. Real service, no false promise.
  if (REPLACEMENT_MODE !== 'live') {
    await notify({ type: 'replacement', order_id: v.order, reply_to: o.billing?.email,
      subject: `Replacement request — order #${v.order}`,
      message: `Customer reports a missing/damaged item.\nOrder: #${v.order}\nItem: ${line.name}\nCustomer: ${o.billing?.first_name || ''} <${o.billing?.email || ''}>\nReason: ${reason}\n\n(Bot is in human-review mode — please create + ship the free replacement.)` });
    return { ok: true, routed_to_human: true, item: line.name,
      message: `I've flagged the missing "${line.name}" to our support team — they'll get a free replacement out to you and follow up at your email within 1 business day.` };
  }

  const orderPayload = {
    status: REPLACEMENT_MODE === 'live' ? 'processing' : 'draft',
    customer_id: o.customer_id || 0,
    billing: o.billing, shipping: (o.shipping && o.shipping.address_1) ? o.shipping : o.billing,
    line_items: [{ product_id: line.product_id, variation_id: line.variation_id || undefined, quantity: 1, total: '0.00', subtotal: '0.00' }],
    shipping_lines: [{ method_id: 'free_shipping', method_title: 'Free (replacement)', total: '0.00' }],
    customer_note: `REPLACEMENT – no charge. Re order #${v.order}: ${String(reason || '').slice(0, 300)}`,
    meta_data: [{ key: '_iw_replacement_of', value: v.order }, { key: '_iw_bot_created', value: '1' }],
  };
  const created = await wc('/orders', { method: 'POST', body: JSON.stringify(orderPayload) });
  if (!created.ok) return { ok: false, note: 'Could not create the replacement automatically — escalating to a human.', escalate: true };

  // audit: note + flag on the original order, and email the team
  const replacedList = [...(v.already_replaced || []), line.name];
  await wc(`/orders/${v.order}`, { method: 'PUT', body: JSON.stringify({
    meta_data: [{ key: '_iw_bot_replaced', value: replacedList }],
  }) });
  await wc(`/orders/${v.order}/notes`, { method: 'POST', body: JSON.stringify({
    note: `Support bot created a ${REPLACEMENT_MODE === 'live' ? 'FREE replacement (order #' + created.data.id + ', shipping)' : 'FREE replacement DRAFT (order #' + created.data.id + ', not shipped — preview mode)'} for "${line.name}". Reason: ${reason}`,
    customer_note: false,
  }) });
  await notify({ type: 'replacement', order_id: v.order, reply_to: o.billing?.email,
    subject: `Free replacement created for order #${v.order}`,
    message: `The support bot created a ${REPLACEMENT_MODE === 'live' ? 'LIVE replacement order (#' + created.data.id + ') that WILL ship' : 'replacement DRAFT (#' + created.data.id + ', preview — not shipped)'}.\n\nItem: ${line.name}\nCustomer: ${o.billing?.first_name || ''} <${o.billing?.email || ''}>\nReason given: ${reason}` });

  return { ok: true, replacement_order: created.data.id, mode: REPLACEMENT_MODE, item: line.name,
    message: REPLACEMENT_MODE === 'live'
      ? `Replacement for "${line.name}" created and shipping free — no charge.`
      : `(Preview mode) Replacement for "${line.name}" was created as a draft the team can see; it won't actually ship in preview.` };
}

async function escalate({ summary, customer_email }) {
  await notify({ type: 'escalation', reply_to: customer_email, subject: 'Chat escalation', message: summary || 'Customer needs help.' });
  return { ok: true, note: `Emailed support@ironwithin.io${customer_email ? ' (reply-to ' + customer_email + ')' : ''}.` };
}

const IMPL = { lookup_order: lookupOrder, create_replacement: createReplacement, escalate_to_support: escalate };

// Lightweight per-IP rate limit (public endpoint). 30 messages / 10 min.
const RL = new Map();
function clientIp(request) { return (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'; }

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ reply: 'The assistant isn’t configured yet.' }, { status: 200 });
  const ip = clientIp(request), now = Date.now();
  const rec = RL.get(ip);
  if (rec && now - rec.t > 600000) RL.delete(ip);
  const cur = RL.get(ip) || { n: 0, t: now };
  if (cur.n >= 30) return Response.json({ reply: 'You’ve sent a lot of messages in a short window — give me a minute and try again. For anything urgent, email support@ironwithin.io.' }, { status: 200 });
  RL.set(ip, { n: cur.n + 1, t: cur.t });
  const client = new Anthropic();
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'bad request' }, { status: 400 }); }

  const history = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
  // Build Claude messages; attach an image (data URL) to the latest user turn if present.
  const messages = history.map((m, i) => {
    const isLast = i === history.length - 1;
    if (isLast && m.role === 'user' && body.image && /^data:image\//.test(body.image)) {
      const [, mediaType, data] = body.image.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/) || [];
      if (data) return { role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
        { type: 'text', text: m.content || 'Here is a photo of what I received.' },
      ] };
    }
    return { role: m.role, content: String(m.content || '') };
  });

  try {
    for (let i = 0; i < 6; i++) {
      const r = await client.messages.create({ model: 'claude-haiku-4-5', max_tokens: 600, system: SYSTEM, tools: TOOLS, messages });
      if (r.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: r.content });
        const results = [];
        for (const b of r.content.filter((b) => b.type === 'tool_use')) {
          let out; try { out = await (IMPL[b.name] || (async () => ({ error: 'unknown tool' })))(b.input); }
          catch (e) { out = { error: 'tool failed' }; }
          results.push({ type: 'tool_result', tool_use_id: b.id, content: JSON.stringify(out) });
        }
        messages.push({ role: 'user', content: results });
        continue;
      }
      const text = r.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
      return Response.json({ reply: text || 'Sorry, I didn’t catch that — could you rephrase?' });
    }
    return Response.json({ reply: 'Let me get a teammate to help with that — email support@ironwithin.io and we’ll jump on it.' });
  } catch (e) {
    return Response.json({ reply: 'Hmm, I hit a snag on my end. Please try again, or email support@ironwithin.io.' }, { status: 200 });
  }
}

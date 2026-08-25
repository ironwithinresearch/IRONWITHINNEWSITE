// src/app/api/chat/route.js
// Iron Within support agent. Claude Haiku 4.5 + tools that hit the live WooCommerce
// backend: look up orders (identity-verified), REQUEST account credit for missing/damaged
// items (the operator approves and grants it — the bot never creates a replacement order
// and never moves money), and escalate to email. Research-use-only guardrail routes
// dosing questions to peptideparadigm.app. Server-side only — no secret reaches the browser.

import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 30;

const WC_URL   = process.env.WC_URL || 'https://bhidasowgm.onrocket.site';
const WC_KEY   = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;
const NOTIFY_SECRET = process.env.IW_BOT_NOTIFY_SECRET || '';
// (IW_CHAT_REPLACEMENT_MODE is gone — the bot no longer creates orders, so there is no
// simulate/live distinction. Every make-good is a credit REQUEST the operator approves.)
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
    const res = await fetch(`${WC_URL}/wp-json/iw/v1/bot-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-IW-Bot-Secret': NOTIFY_SECRET },
      body: JSON.stringify(payload),
    });
    // The credit path needs the reply: the backend decides whether a small make-good
    // was granted on the spot, and the bot must not tell the customer to wait for
    // something that already landed (or claim it landed when it is still queued).
    return await res.json().catch(() => ({}));
  } catch { return {}; }
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
Iron Within products are sold FOR RESEARCH PURPOSES ONLY and are not for human consumption. NEVER give medical, health, dosing, protocol, reconstitution, cycling, stacking, benefits, side-effect, or usage advice yourself. When someone asks about dosing, "how much to inject/take", protocols, or how to use a compound: do NOT advise — point them to **Peptide Paradigm**, a free peptide reference and education app, at **peptideparadigm.app**, and offer to help with orders, COAs, shipping, or account instead. Do not describe it as a dosing or usage tool. One or two friendly sentences.

## You can take real actions with tools
- **lookup_order** — check an order's status, its items, and its **live carrier delivery status** (the tool returns live_delivery_status like "Delivered"/"In Transit"/"Out for Delivery" plus estimated_delivery, delivered_on, and the last_scan location — straight from the carrier via ShipStation). Report it in plain, friendly language (e.g. "It was delivered on July 9" or "It's in transit, estimated to arrive July 12 — last scanned in Louisville, KY"). You MUST have the order number AND the email on the account; if the tool says the email doesn't match, reveal nothing and ask them to confirm the email on the order.
- **request_account_credit** — if a customer reports a missing, damaged, wrong, or leaking item, verify their identity with lookup first, look carefully at any photo they attached, and if the item really is missing/damaged, use this tool. It asks our team to put **account credit** on their account for what they paid for that item, so they can **re-order** — we do NOT send a replacement order. Only for items actually on that order, and confirm which item first. Never request credit for the same item twice — if the tool says it was already made good, escalate instead.
  **Always establish HOW MANY units are affected and pass it as the quantity argument.** If someone ordered 3 vials and says 2 were missing, that is quantity 2, not 1 — asking for one unit short-changes them and the shortfall has to be fixed by hand later. If they haven't said how many, ask before calling the tool. One call per item: for two different items short on the same order, call it once per item with each item's own quantity.
  The tool result tells you what actually happened — say that, and nothing else. If it comes back with granted = true, the credit is ALREADY on their account: say so plainly. If granted = false, it is waiting on the team: say the team is adding it and they'll get an email when it's applied, do NOT say it is already there, and do not promise a timeframe. Either way, never say we're shipping a replacement.
- **escalate_to_support** — email the team for anything you can't resolve, billing/payment problems, or when the customer asks for a human. Ask for their email first.

## Store facts
COA on every order (third-party lab-tested, 99%+ purity, browse at ironwithin.io/lab-reports). Ships US/Canada/international with real tracking; free US shipping over a threshold. Damaged/wrong item → we make it right with account credit so you can re-order what you want. Account credit sits on the customer's account, applies automatically at checkout, and stacks with discount codes. A quick 21+ account is required to check out; password reset emails a 6-digit code. IWR Rewards: 1 point per $1, 250 welcome, 500 = $5 off (ironwithin.io/rewards). Affiliate program: 10–20% commission, paid weekly. Support email: support@ironwithin.io.

## Paying — card, or Zelle / Venmo / Cash App
Cards are accepted again: the card form is on the order screen at checkout, on a secure encrypted
page, and we never store card details. Paying by app instead takes a discount off the total, so it
is worth mentioning. (Keep this in step with PP_ENABLED in app/checkout/page.js — if card is
switched off again, this section is wrong.) Never ask for card numbers in the chat.
When a customer asks how or where to pay by app, give the exact handle for their app:
- **Venmo → @IronWithinPeps**
- **Cash App → $ironwithinresearch**
- **Zelle → 8508980623** (that's a phone number, sent through their bank's Zelle)
They MUST put their **order number in the payment note** so we can match it. A P2P order is placed **on hold** and ships as soon as the payment arrives — and right after they order, we automatically email them these same instructions. Tell them to check that email.

If a customer says they have **already sent** a P2P payment, tell them to **reply to that payment email with a screenshot of the transfer**, or send the screenshot to **payments@ironwithin.io**. That is the fastest way to get the order released — we check every one and confirm by email. Do not promise a specific release time and do not tell them the order is already released; a screenshot is reviewed before anything ships. Never ask for or accept card, bank, or account numbers in the chat.`;

// ---- tools ----
const TOOLS = [
  { name: 'lookup_order', description: 'Look up an order status, tracking, and items. Requires order_number and the account email.',
    input_schema: { type: 'object', properties: { order_number: { type: 'string' }, email: { type: 'string' } }, required: ['order_number', 'email'] } },
  { name: 'request_account_credit', description: 'Ask the team to put account credit on the customer\'s account for a verified missing/damaged/wrong item, so they can re-order. Does not create a replacement order and does not grant the credit — it requests it.',
    input_schema: { type: 'object', properties: {
      order_number: { type: 'string' },
      email: { type: 'string' },
      item_name: { type: 'string' },
      reason: { type: 'string' },
      quantity: { type: 'integer', description: 'How many UNITS of this item are missing or damaged. Required — if the customer says "2 vials were missing", pass 2. Defaults to 1 and is capped at the quantity they purchased.' },
    }, required: ['order_number', 'email', 'item_name', 'reason', 'quantity'] } },
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
    items: (o.line_items || []).map((l) => ({
      name: l.name, qty: l.quantity, product_id: l.product_id, variation_id: l.variation_id,
      // what the customer actually paid for ONE unit, after discounts — this is the credit amount
      paid_each: l.quantity ? Math.round((parseFloat(l.total || 0) / l.quantity) * 100) / 100 : 0,
    })),
    // Either list blocks a second free make-good on the same item. `_iw_bot_replaced` is the
    // legacy key from when the bot created $0 replacement orders — still honoured so items
    // already made good under the old flow can't be credited again now.
    already_credited: [
      ...(Array.isArray(meta._iw_bot_credit_requested) ? meta._iw_bot_credit_requested : []),
      ...(Array.isArray(meta._iw_bot_replaced) ? meta._iw_bot_replaced : []),
    ],
  };
}

/* Make-good flow: the bot does NOT create a replacement order and does NOT grant credit
   itself. It verifies the order + item, works out what the customer paid for that unit, and
   emails the operator a REQUEST to put that much store credit on the account. The operator
   approves and runs the grant; the customer then re-orders whatever they actually want.
   Credit beats a replacement order here — no second shipment to pay for, and the customer
   can put it toward a different compound or a larger vial. */
async function requestAccountCredit({ order_number, email, item_name, reason, quantity }, ctx = {}) {
  const v = await lookupOrder({ order_number, email });
  if (!v.verified) return v;
  const key = String(item_name || '').toLowerCase().split(/[\s(]/)[0];
  const line = (v.items || []).find((i) => i.name.toLowerCase().includes(key));
  if (!line) return { ok: false, note: `"${item_name}" wasn't on order #${v.order}. Items on the order: ${v.items.map((i) => i.name).join(', ')}. Only credit purchased items.` };
  if ((v.already_credited || []).some((x) => String(x).includes(line.name)))
    return { ok: false, note: 'That item was already made good once on this order — do not request credit again; escalate to a human.' };

  /* How MANY units are missing/damaged. This defaulted to 1 and had no way to say otherwise,
     so a customer reporting "2 vials missing" got half the credit they were owed (order #2436,
     2026-08-04, needed a manual top-up). Clamp to the quantity actually purchased on that line —
     we never credit more units than were bought. */
  const wanted = Math.floor(Number(quantity) || 1);
  const qty = Math.min(Math.max(wanted, 1), line.qty || 1);
  const overAsked = wanted > qty;

  const { data: o } = await wc(`/orders/${v.order}`);
  const amount = Math.round((line.paid_each || 0) * qty * 100) / 100;
  const custEmail = o.billing?.email || email;
  const custName = `${o.billing?.first_name || ''} ${o.billing?.last_name || ''}`.trim() || custEmail;
  const unitNote = qty > 1 ? `${qty} × $${(line.paid_each || 0).toFixed(2)}` : `$${(line.paid_each || 0).toFixed(2)}`;

  // The request is QUEUED for approval in the admin app (backend iw-credit-requests.php
  // materialises it from the `credit` block below). The email is still sent — it is what
  // actually gets attention — but it now links to the queue instead of carrying a
  // copy/paste wp-cli line, so a request has a status, cannot be granted twice, and
  // cannot be lost by scrolling out of an inbox.
  const outcome = await notify({
    type: 'credit_request', order_id: v.order, reply_to: custEmail,
    credit: {
      customer_email: custEmail, customer_name: custName,
      item_name: line.name, quantity: qty, amount,
      reason: String(reason || '').slice(0, 500),
      transcript: ctx.transcript || '',
    },
    subject: `Account credit requested — $${amount.toFixed(2)} for ${custName} (order #${v.order})`,
    message: `The support bot verified a customer issue and is REQUESTING account credit so they can re-order.\n\n`
      + `NOTHING HAS BEEN GRANTED YET — this is a request for your approval.\n\n`
      + `Customer: ${custName} <${custEmail}>\nOrder: #${v.order}\nItem: ${line.name}\n`
      + `Units affected: ${qty} of ${line.qty} purchased\n`
      + `Amount (${unitNote}): $${amount.toFixed(2)}\nReason given: ${reason}\n\n`
      + (overAsked ? `NOTE: the customer described ${wanted} units but only ${line.qty} were purchased — capped at ${qty}.\n\n` : '')
      + `Approve or deny it in the admin app — approving grants the credit and emails the customer,\n`
      + `and it auto-applies at their next checkout. Denying records the decision on the order.\n\n`
      + `--- FULL CHAT CONVERSATION ---\n${ctx.transcript || '(none)'}`,
  });

  // audit trail on the original order
  const creditedList = [...(v.already_credited || []), line.name];
  await wc(`/orders/${v.order}`, { method: 'PUT', body: JSON.stringify({ meta_data: [{ key: '_iw_bot_credit_requested', value: creditedList }] }) });
  // Small make-goods are granted on the spot by the backend; larger ones still queue.
  // The note and the reply must both reflect which actually happened — telling a
  // customer to wait for credit that already landed, or that credit landed when it is
  // still pending, are equally bad in opposite directions.
  const granted = !!outcome?.auto;

  await wc(`/orders/${v.order}/notes`, { method: 'POST', body: JSON.stringify({
    note: granted
      ? `Support bot AUTO-GRANTED $${amount.toFixed(2)} account credit for ${qty}× "${line.name}" (${unitNote}) — under the $75 auto-approval limit, customer emailed. Reason: ${reason}`
      : `Support bot REQUESTED $${amount.toFixed(2)} account credit for ${qty}× "${line.name}" (${unitNote}) — not yet granted, awaiting operator approval. Reason: ${reason}`,
    customer_note: false,
  }) });

  if (granted) {
    return { ok: true, requested: true, granted: true, amount, quantity: qty, item: line.name,
      balance: outcome?.balance ?? null,
      message: `Thanks — I've put $${amount.toFixed(2)} of account credit on your account for the ${qty > 1 ? `${qty} ` : ''}${line.name}, and it's there now. It comes off automatically at checkout when you re-order, and I've emailed you a confirmation. Sorry for the trouble! 🙏` };
  }

  return { ok: true, requested: true, granted: false, amount, quantity: qty, item: line.name,
    message: `Thanks — I've asked our team to put $${amount.toFixed(2)} of account credit on your account for the ${qty > 1 ? `${qty} ` : ''}${line.name}. You'll get an email once it's applied, and it'll come off automatically at checkout when you re-order. Sorry for the trouble! 🙏` };
}

async function escalate({ summary, customer_email }, ctx = {}) {
  await notify({ type: 'escalation', reply_to: customer_email, subject: 'Chat escalation',
    message: `${summary || 'Customer needs help.'}\n\n--- FULL CHAT CONVERSATION ---\n${ctx.transcript || '(none)'}` });
  return { ok: true, note: `Emailed support@ironwithin.io${customer_email ? ' (reply-to ' + customer_email + ')' : ''}.` };
}

const IMPL = { lookup_order: lookupOrder, request_account_credit: requestAccountCredit, escalate_to_support: escalate };

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

  // Transcript of the conversation so far, for the team-review email on replacements/escalations.
  const transcript = history.map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${String(m.content || '')}`).join('\n');
  const ctx = { transcript };

  try {
    for (let i = 0; i < 6; i++) {
      const r = await client.messages.create({ model: 'claude-haiku-4-5', max_tokens: 600, system: SYSTEM, tools: TOOLS, messages });
      if (r.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: r.content });
        const results = [];
        for (const b of r.content.filter((b) => b.type === 'tool_use')) {
          let out; try { out = await (IMPL[b.name] || (async () => ({ error: 'unknown tool' })))(b.input, ctx); }
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

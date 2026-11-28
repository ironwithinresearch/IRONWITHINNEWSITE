'use client';
/* Golden Tickets — explainer, FREE daily entry and card redemption (25 Days of Christmas, Dec 1-25 2026).
 * Sweepstakes structure: NO PURCHASE NECESSARY comes first, the free form sits beside the order route with equal
 * weight, one chance per person per day either way. iw-xmas.php implements the rules at /golden-ticket/rules. */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Ticket, PenLine, ShoppingBag, KeyRound } from 'lucide-react';
import GoldenTicketEntryForm from '@/components/GoldenTicketEntryForm';
import { GT, GT_ELIGIBLE, GT_LABEL_LINE, gtPrizeLine, xmasLive, XMAS_START, XMAS_END, xmasDayAt } from '@/lib/christmas';
import { getToken } from '@/lib/auth';

const S = {
  wrap: { maxWidth: 900, margin: '0 auto', padding: '36px 16px 90px' },
  h2: { fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 12px' },
  h3: { color: 'var(--text-light)', fontSize: '1rem', fontWeight: 700, margin: '10px 0 8px' },
  p: { color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12, maxWidth: '70ch' },
  card: { background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '20px 20px' },
  st: { color: 'var(--text-light)' },
  a: { color: 'var(--primary-blue)' },
  input: { width: '100%', minHeight: 44, padding: '10px 12px', fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-light)', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 10 },
};

function Redeem() {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  useEffect(() => { setToken(getToken()); setReady(true); }, []);

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setResult(null);
    try {
      const res = await fetch('/api/christmas/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ code }) });
      const data = await res.json().catch(() => null);
      setResult(data && data.message ? data : { ok: false, message: 'Nothing was redeemed. Please try again, or email support@ironwithin.io.' });
    } catch {
      setResult({ ok: false, message: 'We could not reach the store, so nothing was redeemed. Please try again.' });
    } finally { setBusy(false); }
  }

  if (!ready) return null;
  if (!token) {
    return (
      <p style={{ ...S.p, marginBottom: 0 }}>
        Found a gold card in your order? <Link href="/login?redirect=/golden-ticket%23redeem" style={S.a}>Sign in</Link> with the account that
        placed the order, then enter the code here.
      </p>
    );
  }
  const good = result && result.status === 'redeemed';
  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <label htmlFor="gt-code" style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-light)' }}>Code on your gold card</label>
      <input id="gt-code" name="code" required autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={20} placeholder="IWGT-XXXX-XXXX" value={code} onChange={(e) => setCode(e.target.value)} style={S.input} />
      <button type="submit" disabled={busy} style={{ minHeight: 48, padding: '12px 18px', borderRadius: 10, border: 'none', cursor: busy ? 'wait' : 'pointer', background: 'var(--gradient-primary)', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
        {busy ? 'Checking...' : 'Redeem my Golden Ticket'}
      </button>
      <div role="status" aria-live="polite">
        {result && (
          <p style={{ margin: 0, padding: '12px 14px', borderRadius: 10, fontSize: '0.92rem', lineHeight: 1.55, background: good ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)', border: `1px solid ${good ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.45)'}`, color: good ? '#a7f3d0' : '#fecaca' }}>
            {result.message}
          </p>
        )}
      </div>
    </form>
  );
}

export default function GoldenTicketPage() {
  const [now, setNow] = useState(null);
  useEffect(() => { setNow(Date.now()); }, []);
  const live = now ? xmasLive(now) : false;
  const before = now ? now < XMAS_START : true;
  const over = now ? now >= XMAS_END : false;
  const day = now ? xmasDayAt(now) : 0;
  const closedText = before
    ? 'The free entry form opens December 1 at 12:00 a.m. CT. You can enter once every day through December 25.'
    : 'The Golden Ticket drawings have ended. Thank you for taking part.';

  return (
    <div style={S.wrap}>
      <p style={{ background: 'rgba(0,207,255,0.07)', border: '1px solid rgba(0,207,255,0.35)', borderRadius: 12, padding: '13px 16px', margin: '0 0 22px', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-light)' }}>
        <strong>NO PURCHASE NECESSARY TO ENTER OR WIN.</strong> A purchase will not improve your chance of winning. Void where prohibited.
        Open to {GT_ELIGIBLE}. Affiliates, employees and their households are not eligible. <Link href="/golden-ticket/rules" style={S.a}>Official Rules</Link>.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <Ticket size={20} color="var(--primary-blue)" aria-hidden="true" />
        <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--primary-blue)' }}>25 Days of Christmas</span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,6vw,2.6rem)', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 12px', lineHeight: 1.08 }}>Golden Tickets</h1>
      <p style={{ ...S.p, fontSize: '1.05rem' }}>
        {GT.tickets} prizes, one drawn each day from December 1 to December 25, worth{' '}
        <strong style={S.st}>${GT.total.toLocaleString('en-US')} in Iron Within store credit</strong> ({gtPrizeLine}).
        Enter free once a day, or with a paid order that day. Either way it is one chance per person per day, and one prize per person for the promotion.
        {live && day ? <> Today is <strong style={S.st}>Day {day}</strong>.</> : null}
      </p>

      <section id="enter" aria-labelledby="gt-how" style={{ marginBottom: 30 }}>
        <h2 id="gt-how" style={S.h2}>Two ways to enter, equal odds</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 14 }}>
          <div style={S.card}>
            <PenLine size={18} color="var(--primary-blue)" aria-hidden="true" />
            <h3 style={S.h3}>Enter free</h3>
            <p style={{ ...S.p, fontSize: '0.9rem' }}>No purchase needed. Fill in this form once each day.</p>
            <GoldenTicketEntryForm open={live} closedText={closedText} idPrefix="gtp" />
          </div>
          <div style={S.card}>
            <ShoppingBag size={18} color="var(--primary-blue)" aria-hidden="true" />
            <h3 style={S.h3}>Or enter with an order</h3>
            <p style={{ ...S.p, fontSize: '0.9rem' }}>
              Any order placed during the day (12:00 a.m. to 11:59 p.m. CT) and paid by the drawing, with a US billing and shipping address,
              enters you automatically under the email on your account. Nothing to fill in.
            </p>
            <p style={{ ...S.p, fontSize: '0.9rem' }}>
              Several orders, or an order plus the free form, still count as one chance that day. Each day&apos;s winner is drawn by computer
              {` ${GT.drawTime}`}. One win per person for the whole promotion.
            </p>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 0 }}>
              If your order wins and has not shipped yet, a gold card with a one-time code is packed in your box; the card is your notice.
              {' '}{GT_LABEL_LINE} If your order has already shipped, the credit goes straight to your account and we email you within 7 days.
            </p>
          </div>
        </div>
      </section>

      <section id="redeem" aria-labelledby="gt-redeem" style={{ marginBottom: 30 }}>
        <h2 id="gt-redeem" style={S.h2}><KeyRound size={17} aria-hidden="true" style={{ verticalAlign: -2, marginRight: 6 }} />Redeem a gold card</h2>
        <div style={S.card}>
          <p style={{ ...S.p, fontSize: '0.9rem' }}>
            Each code works once, on the account that placed the winning order, until {GT.redeemByLabel}. The credit applies automatically at checkout, including on sale prices, and expires
            {` ${GT.expiryDays}`} days after it is added. It has no cash value.
          </p>
          <Redeem />
        </div>
      </section>

      <p style={{ ...S.p, fontSize: '0.9rem' }}>
        {over ? 'The 25 Days of Christmas calendar has closed.' : <>See today&apos;s deal on the <Link href="/christmas" style={S.a}>25 Days of Christmas calendar</Link>.</>}{' '}
        Full details in the <Link href="/golden-ticket/rules" style={S.a}>Official Rules</Link>.
      </p>
      <p style={{ ...S.p, fontSize: '0.84rem', color: 'var(--text-muted)' }}>For research use only. Not for human or veterinary use.</p>
    </div>
  );
}

'use client';
/* 25 Days of Christmas calendar (Dec 1-25 2026, midnight to midnight CT). Today's door is open, past doors
 * show "Ended", future doors stay locked with no theme (the backend never sends future themes). Prices and the
 * product list come from /api/christmas (iw-xmas.php + iw-freaky-fridays.php slots 37-61): nothing here sets a price. */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Gift, Ticket, Truck } from 'lucide-react';
import GoldenTicketEntryForm from '@/components/GoldenTicketEntryForm';
import { XMAS_DAYS, XMAS_START, XMAS_END, xmasDateLabel, xmasShipLine, GT, GT_ELIGIBLE, GT_LABEL_LINE } from '@/lib/christmas';

const S = {
  wrap: { maxWidth: 1000, margin: '0 auto', padding: '36px 16px 90px' },
  h2: { fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 12px' },
  p: { color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12, maxWidth: '70ch' },
  card: { background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '20px 20px' },
  a: { color: 'var(--primary-blue)' },
};

// RT-3 items come with pct null (no % claim for RT-3, Brian 28 Nov); a day of only RT-3 has no headline %.
const pctLabel = (t) => (!t || !t.max_pct ? '' : t.min_pct === t.max_pct ? `${t.max_pct}% off` : `Up to ${t.max_pct}% off`);

function Door({ d, info, selected, onPick }) {
  const state = info?.state || 'future';
  const today = state === 'today';
  const past = state === 'past';
  const base = {
    position: 'relative', minHeight: 76, borderRadius: 12, padding: '8px 8px 10px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    border: `1px solid ${today ? 'rgba(124,58,237,0.75)' : 'var(--glass-border)'}`,
    background: today ? 'linear-gradient(160deg, rgba(124,58,237,0.28), rgba(0,207,255,0.14))' : past ? 'rgba(255,255,255,0.02)' : 'var(--card-dark)',
    color: past ? 'var(--text-muted)' : 'var(--text-light)', fontFamily: 'var(--font-body)',
    boxShadow: selected ? '0 0 0 2px var(--primary-blue)' : 'none',
  };
  const inner = (
    <>
      <span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>{d}</span>
      <span style={{ fontSize: '0.68rem', lineHeight: 1.3 }}>
        {today ? 'Open today' : past ? 'Ended' : <><Lock size={11} aria-hidden="true" style={{ verticalAlign: -1 }} /> {xmasDateLabel(d, { month: 'short', day: 'numeric' })}<br />Opens at midnight CT</>}
      </span>
    </>
  );
  if (state === 'future') return <div style={base} aria-label={`Day ${d}: opens at midnight CT on ${xmasDateLabel(d, { weekday: 'long', month: 'long', day: 'numeric' })}`}>{inner}</div>;
  return (
    <button type="button" onClick={() => onPick(d)} aria-pressed={selected} aria-label={`Day ${d}: ${info?.theme || ''}${past ? ' (ended)' : ' (open today)'}`} style={{ ...base, cursor: 'pointer' }}>
      {inner}
    </button>
  );
}

export default function ChristmasCalendar() {
  const [now, setNow] = useState(null);
  const [cal, setCal] = useState(null);
  const [err, setErr] = useState(false);
  const [pick, setPick] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    fetch('/api/christmas').then((r) => r.json()).then((d) => { if (d && d.ok) { setCal(d); setPick(d.day || null); } else setErr(true); }).catch(() => setErr(true));
  }, []);

  const byDay = Object.fromEntries((cal?.days || []).map((x) => [x.day, x]));
  const today = cal?.today || null;
  const before = now ? now < XMAS_START : true;
  const over = now ? now >= XMAS_END : false;
  const live = !!cal?.live;
  const shown = pick ? byDay[pick] : null;

  return (
    <div style={S.wrap}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <Gift size={20} color="var(--primary-blue)" aria-hidden="true" />
        <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--primary-blue)' }}>December 1–25</span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,6vw,2.6rem)', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 12px', lineHeight: 1.08 }}>25 Days of Christmas</h1>
      <p style={{ ...S.p, fontSize: '1.05rem' }}>
        A new door opens every day at 12:00 a.m. CT with one themed deal, no code needed, and creator codes stack (nasal sprays excepted).
        Each deal ends at 11:59 p.m. CT. Every day also has its own Golden Ticket drawing.
      </p>
      {now && !over && (
        <p style={{ display: 'flex', gap: 10, alignItems: 'flex-start', ...S.p, fontSize: '0.92rem', color: 'var(--text-light)' }}>
          <Truck size={18} aria-hidden="true" style={{ flex: 'none', marginTop: 3 }} color="var(--primary-blue)" /> <span>{xmasShipLine(now)}</span>
        </p>
      )}

      <section aria-labelledby="xm-doors" style={{ marginBottom: 26 }}>
        <h2 id="xm-doors" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Calendar doors</h2>
        <div className="xm-grid">
          {Array.from({ length: XMAS_DAYS }, (_, i) => i + 1).map((d) => (
            <Door key={d} d={d} info={byDay[d]} selected={pick === d} onPick={setPick} />
          ))}
        </div>
        <style dangerouslySetInnerHTML={{ __html: '.xm-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}@media(min-width:760px){.xm-grid{grid-template-columns:repeat(7,minmax(0,1fr));gap:10px}}' }} />
      </section>

      <section aria-live="polite" style={{ marginBottom: 30 }}>
        {err && <div style={S.card}><p style={{ ...S.p, marginBottom: 0 }}>We could not load the calendar just now. Please refresh, or see the <Link href="/deals" style={S.a}>Deals page</Link>.</p></div>}
        {!err && cal && before && (
          <div style={S.card}><p style={{ ...S.p, marginBottom: 0 }}>The first door opens Tuesday, December 1 at 12:00 a.m. CT.</p></div>
        )}
        {!err && cal && shown && shown.state === 'today' && today && (
          <div style={{ ...S.card, border: '1px solid rgba(124,58,237,0.5)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a78bfa' }}>Day {today.day} · ends 11:59 p.m. CT tonight</span>
            <h2 style={{ ...S.h2, margin: '6px 0 6px' }}>{today.theme}</h2>
            <p style={{ ...S.p, marginBottom: 10 }}>{today.blurb} {pctLabel(today)}{today.max_pct ? ', no code needed.' : 'No code needed.'}</p>
            {today.items?.length > 0 && today.max_pct && today.min_pct !== today.max_pct && (
              <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 10 }}>
                <strong style={{ color: 'var(--text-light)' }}>At {today.max_pct}% off:</strong> {today.items.filter((it) => it.pct && it.pct === today.max_pct).map((it) => it.name).join(', ')}. Other items are discounted less; each product shows its own price.
              </p>
            )}
            {today.items?.length ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {today.items.map((it) => (
                  <li key={it.slug}><Link href={`/product/${it.slug}`} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 40, padding: '8px 12px', borderRadius: 999, border: '1px solid var(--glass-border)', color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.88rem' }}>{it.name}{it.pct ? <span style={{ marginLeft: 6, color: '#a78bfa', fontWeight: 700 }}>{it.pct}%</span> : null}</Link></li>
                ))}
              </ul>
            ) : (
              <p style={{ ...S.p, fontSize: '0.9rem' }}>Today&apos;s items are loading or have sold down. Check the shop for current prices.</p>
            )}
            <p style={{ ...S.p, fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 0 }}>
              Sale prices show on each product and in your cart. Items with fewer than 5 in stock drop out of the deal. While supplies last.
              For research use only. Not for human or veterinary use.
            </p>
          </div>
        )}
        {!err && cal && shown && shown.state === 'past' && (
          <div style={S.card}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Day {shown.day} · ended</span>
            <h2 style={{ ...S.h2, margin: '6px 0 6px' }}>{shown.theme}</h2>
            <p style={{ ...S.p, marginBottom: 0 }}>This door has closed. {live ? 'Tap today’s door for the current deal.' : ''}</p>
          </div>
        )}
        {!err && cal && over && (
          <div style={S.card}><p style={{ ...S.p, marginBottom: 0 }}>That&apos;s a wrap on 25 Days of Christmas. Thank you for shopping with us.</p></div>
        )}
      </section>

      {!over && (
        <section aria-labelledby="xm-gt" style={{ marginBottom: 26 }}>
          <h2 id="xm-gt" style={S.h2}><Ticket size={18} aria-hidden="true" style={{ verticalAlign: -3, marginRight: 6 }} />Golden Tickets</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 14 }}>
            <div style={S.card}>
              <p style={{ ...S.p, fontSize: '0.92rem' }}>
                <strong style={{ color: 'var(--text-light)' }}>No purchase necessary.</strong> {GT.tickets} prizes, one drawn each day,
                worth ${GT.total.toLocaleString('en-US')} in store credit in all. Enter free with this form once a day (no sign-in needed), or with a
                paid order that day. Equal odds either way: one chance per person per day, one prize per person. Open to {GT_ELIGIBLE}.
              </p>
              <GoldenTicketEntryForm open={live} closedText="Free entry opens December 1 at 12:00 a.m. CT." idPrefix="gtc" />
            </div>
            <div style={S.card}>
              <p style={{ ...S.p, fontSize: '0.92rem' }}>
                <strong style={{ color: 'var(--text-light)' }}>With an order:</strong> any order placed during the day and paid by the drawing, billed and
                shipped to a US address, enters you automatically. If your order wins before it ships, you&apos;ll find a gold card with a one-time code in your box. {GT_LABEL_LINE}
              </p>
              <p style={{ ...S.p, fontSize: '0.92rem', marginBottom: 0 }}>
                <Link href="/golden-ticket" style={S.a}>How Golden Tickets work and how to redeem</Link> · <Link href="/golden-ticket/rules" style={S.a}>Official Rules</Link>
              </p>
            </div>
          </div>
        </section>
      )}
      <p style={{ ...S.p, fontSize: '0.84rem', color: 'var(--text-muted)' }}>For research use only. Not for human or veterinary use.</p>
    </div>
  );
}

import Link from 'next/link';
import XmasCountdown from '@/components/XmasCountdown';

export const revalidate = 300;

export const metadata = {
  title: '12 Days of Christmas in July | Iron Within Research',
  description: 'A new research deal every day, July 13–24. Free RETA, doorbusters, bundle blowouts, triple points, and a grand-finale $500 giveaway.',
};

const FEED_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site') + '/wp-json/iw/v1/xmas-july';

// Marketing copy per day (emoji + fuller sub-line); badge/name come from the engine feed.
const ENRICH = {
  1:  { e: '🎁', sub: '20% off everything + a FREE RETA 10mg on $200+.' },
  2:  { e: '🔥', sub: 'Buy 2 recovery peptides, get your 3rd 50% off.' },
  3:  { e: '📦', sub: 'Every bundle — an extra 15% off + free shipping.' },
  4:  { e: '🎅', sub: 'Spend $250 and unlock a FREE mystery vial.' },
  5:  { e: '💳', sub: 'Buy a $200 gift card, get $50 free.' },
  6:  { e: '⚡', sub: '40% off RETA 30 · MOTS-C · SS-31 — first 25 orders only.' },
  7:  { e: '⭐', sub: 'Triple IWR rewards points on everything.' },
  8:  { e: '🛒', sub: 'Spend more, save more: $150→10%, $300→20%, $500→25%.' },
  9:  { e: '🎄', sub: 'FREE premium vial on $175+ plus free shipping.' },
  10: { e: '💊', sub: 'New capsules + spotlight SKUs — 25% off.' },
  11: { e: '🔒', sub: 'Lock in a 6-month plan — 20% off + double points.' },
  12: { e: '🎆', sub: 'FINALE: 25% off, codes stack + a $500 gift-card giveaway.' },
};

async function getFeed() {
  try {
    const r = await fetch(FEED_URL, { next: { revalidate: 300 } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

// CT (America/Chicago, CDT = UTC-5 in July) date helpers computed server-side.
function ctToday() {
  return new Date(Date.now() - 5 * 3600000).toISOString().slice(0, 10);
}
function schedule() {
  const START = Date.parse('2026-07-13T05:00:00Z'); // Jul 13 00:00 CDT
  const END = Date.parse('2026-07-25T05:00:00Z');   // midnight after Day 12
  const now = Date.now();
  if (now < START) return { mode: 'pre', target: '2026-07-13T05:00:00Z' };
  if (now < END) {
    const ctMs = now - 5 * 3600000;
    const dayStart = new Date(ctMs); dayStart.setUTCHours(0, 0, 0, 0);
    const target = new Date(dayStart.getTime() + 86400000 + 5 * 3600000).toISOString();
    return { mode: 'live', target };
  }
  return { mode: 'ended', target: null };
}

export default async function ChristmasInJuly() {
  const feed = await getFeed();
  const days = (feed?.days || Object.keys(ENRICH).map((n) => ({ day: Number(n), name: '', badge: '', date: '' })));
  const doorLeft = feed?.door_left;
  const { mode, target } = schedule();
  const today = ctToday();

  const stateOf = (d) => {
    if (!d.date) return 'up';
    if (d.date < today) return 'past';
    if (d.date === today) return 'live';
    return 'up';
  };
  const liveDay = days.find((d) => stateOf(d) === 'live');

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% -10%, rgba(200,16,46,0.22), transparent 55%), radial-gradient(ellipse at 90% 20%, rgba(42,157,92,0.16), transparent 45%), var(--bg-dark, #080b12)', paddingBottom: 90 }}>
      {/* HERO */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '54px 20px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 999, background: 'rgba(245,197,66,0.14)', border: '1px solid rgba(245,197,66,0.4)', color: '#f5c542', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 18 }}>
          Iron Within Research
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: 'clamp(2rem, 6vw, 3.4rem)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 8px', color: '#fff' }}>
          🎄 12 Days of <span style={{ background: 'linear-gradient(90deg,#ff5a6e,#f5c542,#3ddc84)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Christmas in July</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', margin: '0 0 26px' }}>
          A new research deal every single day · <b style={{ color: '#fff' }}>July 13–24</b>
        </p>

        {mode === 'pre' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <XmasCountdown target={target} label="Unwrapping in" />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: 520 }}>
              12 days, 12 deals — free RETA, doorbusters, bundle blowouts, triple points, and a grand-finale <b style={{ color: '#f5c542' }}>$500 giveaway</b>. Check the lineup below and set your reminders. 🎁
            </p>
            <Link href="/shop" style={ctaStyle}>Shop the Store →</Link>
          </div>
        )}

        {mode === 'live' && liveDay && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: '22px 26px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(200,16,46,0.28), rgba(42,157,92,0.22))', border: '1px solid rgba(245,197,66,0.4)', maxWidth: 640 }}>
              <div style={{ color: '#3ddc84', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>● Live now · Day {liveDay.day}</div>
              <div style={{ fontSize: '2.2rem', margin: '6px 0' }}>{ENRICH[liveDay.day]?.e}</div>
              <div style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{liveDay.badge}</div>
              <p style={{ color: 'rgba(255,255,255,0.78)', margin: '8px 0 0' }}>{ENRICH[liveDay.day]?.sub}</p>
              {liveDay.type === 'doorbuster' && Number.isFinite(doorLeft) && (
                <div style={{ marginTop: 10, color: '#ff5a6e', fontWeight: 800 }}>🔥 Only {doorLeft} doorbuster orders left!</div>
              )}
            </div>
            <XmasCountdown target={target} label="Today's deal ends in" />
            <Link href="/shop" style={ctaStyle}>Shop Today's Deal →</Link>
          </div>
        )}

        {mode === 'ended' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 520 }}>That's a wrap on 12 Days of Christmas in July — thank you! 🎄 The everyday deals never stop.</p>
            <Link href="/shop" style={ctaStyle}>Shop the Store →</Link>
          </div>
        )}
      </section>

      {/* THE 12 DOORS */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '20px 16px' }}>
        <h2 style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, margin: '10px 0 22px' }}>The Full Lineup</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {days.map((d) => {
            const st = stateOf(d);
            const en = ENRICH[d.day] || {};
            const border = st === 'live' ? '2px solid #f5c542' : st === 'past' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.14)';
            return (
              <div key={d.day} style={{
                position: 'relative', borderRadius: 16, padding: 18, border,
                background: st === 'live' ? 'linear-gradient(135deg, rgba(200,16,46,0.22), rgba(42,157,92,0.18))' : 'rgba(255,255,255,0.03)',
                opacity: st === 'past' ? 0.55 : 1,
                boxShadow: st === 'live' ? '0 0 30px rgba(245,197,66,0.25)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.55)' }}>DAY {d.day}</span>
                  {st === 'live' && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0a1f14', background: '#3ddc84', padding: '2px 8px', borderRadius: 999 }}>LIVE</span>}
                  {st === 'past' && <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>ended ✓</span>}
                  {st === 'up' && <span style={{ fontSize: '0.62rem', color: '#f5c542' }}>{d.date ? new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>}
                </div>
                <div style={{ fontSize: '1.7rem', lineHeight: 1 }}>{en.e}</div>
                <div style={{ fontFamily: 'var(--font-heading, inherit)', fontWeight: 900, color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>{d.badge || en.sub}</div>
                <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.82rem', lineHeight: 1.45 }}>{en.sub}</div>
                {st === 'live' && <Link href="/shop" style={{ ...ctaStyle, marginTop: 12, padding: '9px 16px', fontSize: '0.85rem', display: 'inline-flex' }}>Shop now →</Link>}
              </div>
            );
          })}
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 28 }}>
          Deals are automatic at checkout — creator codes stack. Free gifts while supplies last. For research use only.
        </p>
      </section>
    </div>
  );
}

const ctaStyle = {
  display: 'inline-block', padding: '13px 30px', borderRadius: 12,
  background: 'linear-gradient(90deg,#c8102e,#e63946)', color: '#fff',
  fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none',
  boxShadow: '0 8px 26px rgba(200,16,46,0.4)',
};

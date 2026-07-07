import Link from 'next/link';
import XmasCountdown from '@/components/XmasCountdown';

export const revalidate = 300;

export const metadata = {
  title: '12 Days of Christmas in July | Iron Within Research',
  description: 'A new deal every day, July 14–25 — 20% off, category blowouts, doorbusters, free gifts, and a grand finale. Shop all 12 days to win 1 of 5 $1,000 credits.',
};

const FEED_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site') + '/wp-json/iw/v1/xmas-july';

// Emoji + sub-line per day; badge/name/code come from the live engine feed.
const ENRICH = {
  1:  { e: '🎁', sub: '20% off everything to kick it off. Code JOY20.' },
  2:  { e: '🩹', sub: '30% off all Regenerative — GHK-Cu, SS-31, KPV, NAD+, BPC & more.' },
  3:  { e: '🧦', sub: 'A FREE bac water auto-added to every order $75+.' },
  4:  { e: '⚡', sub: '30% off RT-3 — our #1 seller — 24 hours only.' },
  5:  { e: '🎄', sub: 'A FREE MOTS-C 10mg on every order $175+.' },
  6:  { e: '🏆', sub: '25% off all Performance — RT-3, MOTS-C, TRZ-2, 5-Amino & more.' },
  7:  { e: '📦', sub: 'An extra 15% off every bundle, stacked on bundle savings.' },
  8:  { e: '🧠', sub: '30% off all Neuro — Semax, Selank, PT-141, Kisspeptin, DSIP.' },
  9:  { e: '💳', sub: 'Buy a $250 gift card, get $50 bonus balance free.' },
  10: { e: '💊', sub: '25% off Capsules + Lab Supplies.' },
  11: { e: '🛷', sub: 'FREE shipping sitewide + a FREE mystery vial on $200+.' },
  12: { e: '🎆', sub: '40% off EVERYTHING, 24 hours only, plus a free gift.' },
};

async function getFeed() {
  try {
    const r = await fetch(FEED_URL, { next: { revalidate: 300 } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function ctToday() { return new Date(Date.now() - 5 * 3600000).toISOString().slice(0, 10); }
function schedule() {
  const START = Date.parse('2026-07-14T05:00:00Z'); // Jul 14 00:00 CDT
  const END = Date.parse('2026-07-26T05:00:00Z');   // midnight after Day 12
  const now = Date.now();
  if (now < START) return { mode: 'pre', target: '2026-07-14T05:00:00Z' };
  if (now < END) {
    const dayStart = new Date(now - 5 * 3600000); dayStart.setUTCHours(0, 0, 0, 0);
    return { mode: 'live', target: new Date(dayStart.getTime() + 86400000 + 5 * 3600000).toISOString() };
  }
  return { mode: 'ended', target: null };
}

export default async function ChristmasInJuly() {
  const feed = await getFeed();
  const days = feed?.days || Object.keys(ENRICH).map((n) => ({ day: Number(n), name: '', badge: '', code: null, date: '' }));
  const gp = feed?.grand_prize;
  const { mode, target } = schedule();
  const today = ctToday();
  const stateOf = (d) => (!d.date ? 'up' : d.date < today ? 'past' : d.date === today ? 'live' : 'up');
  const liveDay = days.find((d) => stateOf(d) === 'live');

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% -10%, rgba(200,16,46,0.22), transparent 55%), radial-gradient(ellipse at 90% 20%, rgba(42,157,92,0.16), transparent 45%), var(--bg-dark, #080b12)', paddingBottom: 90 }}>
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '54px 20px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 999, background: 'rgba(245,197,66,0.14)', border: '1px solid rgba(245,197,66,0.4)', color: '#f5c542', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 18 }}>
          Iron Within Research
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: 'clamp(2rem, 6vw, 3.4rem)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 8px', color: '#fff' }}>
          🎄 12 Days of <span style={{ background: 'linear-gradient(90deg,#ff5a6e,#f5c542,#3ddc84)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Christmas in July</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', margin: '0 0 24px' }}>
          A new deal every single day · <b style={{ color: '#fff' }}>July 14–25</b>
        </p>

        {mode === 'pre' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <XmasCountdown target={target} label="Unwrapping in" />
            <Link href="/shop" style={ctaStyle}>Shop the Store →</Link>
          </div>
        )}
        {mode === 'live' && liveDay && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ padding: '22px 26px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(200,16,46,0.28), rgba(42,157,92,0.22))', border: '1px solid rgba(245,197,66,0.4)', maxWidth: 640 }}>
              <div style={{ color: '#3ddc84', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>● Live now · Day {liveDay.day}</div>
              <div style={{ fontSize: '2.2rem', margin: '6px 0' }}>{ENRICH[liveDay.day]?.e}</div>
              <div style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{liveDay.badge}</div>
              <p style={{ color: 'rgba(255,255,255,0.78)', margin: '8px 0 0' }}>{ENRICH[liveDay.day]?.sub}</p>
              {liveDay.code && <div style={{ marginTop: 12, display: 'inline-block', padding: '8px 18px', borderRadius: 10, background: '#fff', color: '#0f1729', fontWeight: 900, letterSpacing: '0.08em', fontSize: '1.1rem' }}>CODE: {liveDay.code}</div>}
            </div>
            <XmasCountdown target={target} label="Today's deal ends in" />
            <Link href="/shop" style={ctaStyle}>Shop Today's Deal →</Link>
          </div>
        )}
        {mode === 'ended' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 520 }}>That's a wrap on 12 Days of Christmas in July — thank you! 🎄 Winners of the five $1,000 credits are being drawn now.</p>
            <Link href="/shop" style={ctaStyle}>Shop the Store →</Link>
          </div>
        )}
      </section>

      {/* GRAND PRIZE */}
      {gp && (
        <section style={{ maxWidth: 760, margin: '10px auto 0', padding: '0 16px' }}>
          <div style={{ textAlign: 'center', padding: '20px 22px', borderRadius: 18, background: 'linear-gradient(135deg, rgba(245,197,66,0.14), rgba(200,16,46,0.14))', border: '1px solid rgba(245,197,66,0.45)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🏆</div>
            <div style={{ fontFamily: 'var(--font-heading, inherit)', fontWeight: 900, color: '#f5c542', fontSize: '1.2rem' }}>Shop all 12 days → win $1,000</div>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '6px 0 0', fontSize: '0.92rem' }}>
              Place an order on every one of the 12 days and you're entered to win <b style={{ color: '#fff' }}>one of five $1,000 store-credit prizes</b>. Miss a day, miss your shot. 🎁
            </p>
          </div>
        </section>
      )}

      {/* THE 12 DOORS */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 16px' }}>
        <h2 style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, margin: '10px 0 22px' }}>The Full Lineup</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {days.map((d) => {
            const st = stateOf(d);
            const en = ENRICH[d.day] || {};
            const border = st === 'live' ? '2px solid #f5c542' : st === 'past' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.14)';
            return (
              <div key={d.day} style={{ position: 'relative', borderRadius: 16, padding: 18, border,
                background: st === 'live' ? 'linear-gradient(135deg, rgba(200,16,46,0.22), rgba(42,157,92,0.18))' : 'rgba(255,255,255,0.03)',
                opacity: st === 'past' ? 0.55 : 1, boxShadow: st === 'live' ? '0 0 30px rgba(245,197,66,0.25)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.55)' }}>DAY {d.day}</span>
                  {st === 'live' && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0a1f14', background: '#3ddc84', padding: '2px 8px', borderRadius: 999 }}>LIVE</span>}
                  {st === 'past' && <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>ended ✓</span>}
                  {st === 'up' && <span style={{ fontSize: '0.62rem', color: '#f5c542' }}>{d.date ? new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>}
                </div>
                <div style={{ fontSize: '1.7rem', lineHeight: 1 }}>{en.e}</div>
                <div style={{ fontFamily: 'var(--font-heading, inherit)', fontWeight: 900, color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>{d.badge}</div>
                <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.82rem', lineHeight: 1.45 }}>{en.sub}</div>
                {/* code: revealed on/after its day, locked before */}
                {d.code && (st === 'live' || st === 'past'
                  ? <div style={{ marginTop: 10, display: 'inline-block', padding: '5px 12px', borderRadius: 8, background: st === 'live' ? '#fff' : 'rgba(255,255,255,0.1)', color: st === 'live' ? '#0f1729' : 'rgba(255,255,255,0.7)', fontWeight: 800, letterSpacing: '0.06em', fontSize: '0.82rem' }}>{d.code}</div>
                  : <div style={{ marginTop: 10, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>🔒 code unlocks that day</div>)}
                {st === 'live' && <div><Link href="/shop" style={{ ...ctaStyle, marginTop: 12, padding: '9px 16px', fontSize: '0.85rem', display: 'inline-flex' }}>Shop now →</Link></div>}
              </div>
            );
          })}
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 28 }}>
          Enter each day's code at checkout — creator codes stack. Free gifts auto-add while supplies last. For research use only.
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

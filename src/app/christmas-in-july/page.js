import Link from 'next/link';
import XmasCountdown from '@/components/XmasCountdown';
import ScratchCard from '@/components/ScratchCard';

export const revalidate = 300;

export const metadata = {
  title: '12 Days of Christmas in July | Iron Within Research',
  description: 'A new deal every day, July 11–22 — giveaways, BOGO, bonus days, and a grand finale. Take part in each day to win 1 of 5 $1,000 credits.',
};

const FEED_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bhidasowgm.onrocket.site') + '/wp-json/iw/v1/xmas-july';

// Emoji + sub-line per day; badge/name/code come from the live engine feed.
const ENRICH = {
  1:  { e: '🎁', sub: 'FREE RT-3 or TRZ-2 10mg (your pick) on every order $150+.' },
  2:  { e: '🔁', sub: 'BOGO — buy an SS-31 or BPC-157, get your 2nd 50% off.' },
  3:  { e: '⚡', sub: 'Triple Rewards Points on every order today.' },
  4:  { e: '✨', sub: '43% off GLOW, GHK-Cu & KPV.' },
  5:  { e: '🔥', sub: '40% off RT-3, TRZ-2, Cagrilintide & MOTS-C.' },
  6:  { e: '🧬', sub: '40% off NAD+, Epitalon, Thymosin Alpha-1 & Sermorelin.' },
  7:  { e: '🧠', sub: 'Buy a Semax, get a Selank FREE.' },
  8:  { e: '💥', sub: '45% off every bundle — Bundle Blowout.' },
  9:  { e: '🎁', sub: 'Spend $250, get $50 store credit for next time.' },
  10: { e: '🔁', sub: 'Buy 2, get 1 FREE on best-sellers.' },
  11: { e: '🎁', sub: 'A FREE vial — KPV, DSIP, Selank or Semax — on $150+.' },
  12: { e: '🏆', sub: '45% OFF everything + a free gift on $150+. Grand finale!' },
  13: { e: '💰', sub: '50% OFF EVERYTHING + a free vial on $150+, 3× points & spend $250 get $50 — the Grand Slam!' },
};

async function getFeed() {
  try {
    const r = await fetch(FEED_URL, { next: { revalidate: 300 } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function ctToday() { return new Date(Date.now() - 4 * 3600000).toISOString().slice(0, 10); }
function schedule() {
  const START = Date.parse('2026-07-11T04:00:00Z'); // launched 1hr early: 11 PM CT Jul 10 = midnight ET
  const END = Date.parse('2026-07-24T04:00:00Z');   // 11 PM CT after Day 13 (bonus Grand Slam day)
  const now = Date.now();
  if (now < START) return { mode: 'pre', target: '2026-07-11T04:00:00Z' };
  if (now < END) {
    const dayStart = new Date(now - 4 * 3600000); dayStart.setUTCHours(0, 0, 0, 0);
    return { mode: 'live', target: new Date(dayStart.getTime() + 86400000 + 4 * 3600000).toISOString() };
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
          A new deal every single day · <b style={{ color: '#fff' }}>July 11–22</b>
        </p>

        {mode === 'pre' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <XmasCountdown target={target} label="Unwrapping in" />
            <Link href="/shop" style={ctaStyle}>Shop the Store →</Link>
          </div>
        )}
        {mode === 'live' && liveDay && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ padding: '20px 26px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(200,16,46,0.28), rgba(42,157,92,0.22))', border: '1px solid rgba(245,197,66,0.4)', maxWidth: 560 }}>
              <div style={{ color: '#3ddc84', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>● Day {liveDay.day} is live</div>
              <div style={{ fontSize: '2rem', margin: '8px 0 4px' }}>🎟️</div>
              <div style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>Scratch Day {liveDay.day} below to reveal today's deal!</div>
            </div>
            <XmasCountdown target={target} label="Today's deal ends in" />
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
              Take part in each day's deal to earn that day's entry — complete all 12 for a bonus entry. Five winners each get <b style={{ color: '#fff' }}>$1,000 in store credit</b>. 🎁
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
            const reveal = st !== 'up'; // future days carry NO deal content
            return (
              <ScratchCard key={d.day} day={d.day} date={d.date} state={st}
                emoji={reveal ? en.e : ''} badge={reveal ? d.badge : ''}
                sub={reveal ? en.sub : ''} code={reveal ? d.code : null} />
            );
          })}
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 28 }}>
          Each day, come back and scratch that day's card to reveal the deal + code. Creator codes stack; free gifts auto-add while supplies last. For research use only.
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

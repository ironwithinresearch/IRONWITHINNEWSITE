'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ffCurrent, ffNext, ffCountdownTo, ffFormat, ffSeason, ffWindowLabel,
  FF_HEADLINE, FF_FLAT, FF_WINDOWS, FF_GIFT, FF_FRIDAY_COUNT, ffPct, FF_SITEWIDE_WEEKS,
} from '@/lib/freakyFridays';
import { annPromoLive } from '@/lib/anniversary';

/* Freaky Fridays homepage banner. Shows all season, and changes state at 8:30:

     live   — "week N is live", up-to-60% headline, countdown to close, shop CTA
     armed  — "next window opens Friday", countdown to open, so the list learns the rhythm

   The armed state is the point of a weekly series: the flash-window data showed 47x ambient
   order volume in a window the list was told about in advance, and ~0.4 orders in one nobody
   knew was coming. A visible countdown is the cheapest version of telling them. */

export default function FreakyFridaysBanner() {
  const [s, setS] = useState(null);

  useEffect(() => {
    /* Resolved in an effect, never during render: these pages are statically generated, so a
       server-side "now" would be baked into the HTML and mismatch on hydration. */
    const tick = () => {
      const now = Date.now();
      if (!ffSeason(now)) return setS(null);
      const cur = ffCurrent(now);
      const cd = ffCountdownTo(now);
      const win = cur || ffNext(now);
      setS({
        live: !!cur,
        week: (win || {}).week ?? null,
        name: (win || {}).name || null,
        pct: ffPct(win), sitewide: FF_SITEWIDE_WEEKS.includes((win || {}).week), blurb: (win || {}).blurb || '',
        label: ffFormat(cd.ms),
        kind: cd.kind,
        // Derived from the schedule, never hardcoded: week 1 is a weekend and the rest are a
        // single 12-hour Friday, so a fixed "Monday 8:30pm" would be wrong seven times out of
        // eight.
        when: ffWindowLabel(win),
        ann: annPromoLive(now),
      });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // During Anniversary Month the home page shows today's deal card instead (AnniversaryToday).
  if (!s || s.week === null || s.ann) return null;

  const live = s.live;

  return (
    <section
      aria-label="Freaky Fridays"
      style={{
        position: 'relative',
        margin: '0 0 28px',
        borderRadius: 18,
        overflow: 'hidden',
        border: `1px solid ${live ? 'rgba(0,207,255,0.55)' : 'rgba(0,207,255,0.22)'}`,
        background:
          'radial-gradient(120% 140% at 12% 0%, #0B1530 0%, #0A0F1F 45%, #060912 100%)',
        boxShadow: live
          ? '0 0 40px rgba(124,58,237,0.22), inset 0 1px 0 rgba(0,207,255,0.18)'
          : 'inset 0 1px 0 rgba(0,207,255,0.10)',
      }}
    >
      {/* Sooty vignette + a faint moon glow, pure CSS so there is no image to ship. */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(60% 90% at 88% 10%, rgba(0,207,255,0.16), transparent 60%),' +
            'radial-gradient(80% 60% at 50% 120%, rgba(236,72,153,0.22), transparent 70%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          padding: 'clamp(22px, 4vw, 40px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 36px)',
        }}
      >
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              fontWeight: 800, color: '#00CFFF', marginBottom: 10,
            }}
          >
            {s.name ? (live ? 'Today only — live now' : 'Coming up next') : live ? `Week ${s.week} of ${FF_FRIDAY_COUNT} — live now` : `Week ${s.week} of ${FF_FRIDAY_COUNT}`}
          </div>

          <h2
            style={{
              margin: '0 0 10px',
              fontSize: 'clamp(1.9rem, 5.2vw, 3.3rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              fontWeight: 900,
              background: 'linear-gradient(135deg,#67E8F9 0%,#7C3AED 48%,#EC4899 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {s.name || 'FREAKY FRIDAYS'}
          </h2>

          <p style={{ margin: '0 0 16px', color: '#DCE6F5', fontSize: 'clamp(0.95rem,1.6vw,1.08rem)', maxWidth: '46ch' }}>
            {live ? (
              <>
                {s.week && FF_GIFT[s.week] ? <><strong style={{ color: '#00CFFF' }}>{FF_GIFT[s.week]}</strong>, plus </> : null}
                {FF_FLAT ? (
                  <><strong style={{ color: '#00CFFF' }}>{s.pct}% off {s.sitewide ? 'sitewide' : (s.blurb || 'select products')}</strong> — no
                  code needed, and your creator code still stacks on top.</>
                ) : (
                  <>Up to <strong style={{ color: '#00CFFF' }}>{s.pct}% off</strong> — no code
                  needed, and your creator code still stacks on top.</>
                )} {s.when ? <>Runs {s.when}.</> : null}
              </>
            ) : (
              <>
                {s.ann
                  ? <>Anniversary Month — a new deal every day through Halloween, including Flash Saturdays and Loyalty Sundays.</>
                  : <>A new drop every Friday, running through Halloween — different products and a
                different depth each week.</>} {s.when ? <>Next: <strong style={{ color: '#00CFFF' }}>{s.when}</strong>.</> : null}
              </>
            )}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px', borderRadius: 999,
                fontWeight: 800, fontSize: '0.98rem', textDecoration: 'none',
                color: live ? '#001018' : '#CDEFFF',
                background: live ? 'linear-gradient(135deg,#00CFFF,#0EA5E9)' : 'transparent',
                border: live ? 'none' : '1px solid rgba(0,207,255,0.5)',
                boxShadow: live ? '0 8px 26px rgba(124,58,237,0.36)' : 'none',
              }}
            >
              {live ? 'Shop the drop' : 'Browse the shop'}
              <span aria-hidden>→</span>
            </Link>

            {s.ann ? (
              <Link
                href="/anniversary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44,
                  padding: '11px 20px', borderRadius: 999, fontWeight: 800, fontSize: '0.95rem',
                  textDecoration: 'none', color: '#CDEFFF', border: '1px solid rgba(0,207,255,0.5)',
                }}
              >
                See all 31 days <span aria-hidden>→</span>
              </Link>
            ) : null}

            {s.label ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8595AD' }}>
                  {s.kind === 'ends' ? 'Closes in' : 'Opens in'}
                </span>
                <span
                  style={{
                    fontVariantNumeric: 'tabular-nums', fontWeight: 800,
                    fontSize: 'clamp(1.05rem,2.4vw,1.4rem)',
                    color: live ? '#7C3AED' : '#00CFFF',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ) : null}
          </div>
        </div>

      </div>
    </section>
  );
}

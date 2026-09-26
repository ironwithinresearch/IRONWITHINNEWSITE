'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ffCurrent, ffNext, ffCountdownTo, ffFormat, ffSeason, ffWindowLabel,
  FF_HEADLINE, FF_FLAT, FF_WINDOWS, FF_GIFT, FF_FRIDAY_COUNT,
} from '@/lib/freakyFridays';

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
        label: ffFormat(cd.ms),
        kind: cd.kind,
        // Derived from the schedule, never hardcoded: week 1 is a weekend and the rest are a
        // single 12-hour Friday, so a fixed "Monday 8:30pm" would be wrong seven times out of
        // eight.
        when: ffWindowLabel(win),
      });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  if (!s || s.week === null) return null;

  const live = s.live;

  return (
    <section
      aria-label="Freaky Fridays"
      style={{
        position: 'relative',
        margin: '0 0 28px',
        borderRadius: 18,
        overflow: 'hidden',
        border: `1px solid ${live ? 'rgba(255,122,24,0.55)' : 'rgba(255,122,24,0.22)'}`,
        background:
          'radial-gradient(120% 140% at 12% 0%, #2A1405 0%, #140A04 45%, #0A0603 100%)',
        boxShadow: live
          ? '0 0 40px rgba(255,106,0,0.22), inset 0 1px 0 rgba(255,176,32,0.18)'
          : 'inset 0 1px 0 rgba(255,176,32,0.10)',
      }}
    >
      {/* Sooty vignette + a faint moon glow, pure CSS so there is no image to ship. */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(60% 90% at 88% 10%, rgba(255,176,32,0.16), transparent 60%),' +
            'radial-gradient(80% 60% at 50% 120%, rgba(180,18,27,0.22), transparent 70%)',
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
              fontWeight: 800, color: '#FFB020', marginBottom: 10,
            }}
          >
            <span aria-hidden>🎃</span>
            {s.name ? (live ? 'This weekend only — live now' : 'This weekend only') : live ? `Week ${s.week} of ${FF_FRIDAY_COUNT} — live now` : `Week ${s.week} of ${FF_FRIDAY_COUNT}`}
          </div>

          <h2
            style={{
              margin: '0 0 10px',
              fontSize: 'clamp(1.9rem, 5.2vw, 3.3rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              fontWeight: 900,
              background: 'linear-gradient(135deg,#FFD27A 0%,#FF7A18 48%,#B4121B 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {s.name || 'FREAKY FRIDAYS'}
          </h2>

          <p style={{ margin: '0 0 16px', color: '#E9DCCD', fontSize: 'clamp(0.95rem,1.6vw,1.08rem)', maxWidth: '46ch' }}>
            {live ? (
              <>
                {s.week && FF_GIFT[s.week] ? <><strong style={{ color: '#FFB020' }}>{FF_GIFT[s.week]}</strong>, plus </> : null}
                {FF_FLAT ? (
                  <><strong style={{ color: '#FFB020' }}>{FF_HEADLINE}% off sitewide</strong> — no
                  code needed, and your creator code still stacks on top.</>
                ) : (
                  <>Up to <strong style={{ color: '#FFB020' }}>{FF_HEADLINE}% off</strong> — no code
                  needed, and your creator code still stacks on top.</>
                )} {s.when ? <>Runs {s.when}.</> : null}
              </>
            ) : (
              <>
                A new drop every Friday, running through Halloween — different products and a
                different depth each week. {s.when ? <>Next: <strong style={{ color: '#FFB020' }}>{s.when}</strong>.</> : null}
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
                color: live ? '#170A02' : '#FFD9A8',
                background: live ? 'linear-gradient(135deg,#FFB020,#FF6A00)' : 'transparent',
                border: live ? 'none' : '1px solid rgba(255,122,24,0.5)',
                boxShadow: live ? '0 8px 26px rgba(255,106,0,0.36)' : 'none',
              }}
            >
              {live ? 'Shop the drop' : 'Browse the shop'}
              <span aria-hidden>→</span>
            </Link>

            {s.label ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8A78' }}>
                  {s.kind === 'ends' ? 'Closes in' : 'Opens in'}
                </span>
                <span
                  style={{
                    fontVariantNumeric: 'tabular-nums', fontWeight: 800,
                    fontSize: 'clamp(1.05rem,2.4vw,1.4rem)',
                    color: live ? '#FF7A18' : '#FFB020',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div
          aria-hidden
          style={{
            flex: '0 0 auto', fontSize: 'clamp(64px, 13vw, 132px)', lineHeight: 1,
            filter: live
              ? 'drop-shadow(0 0 26px rgba(255,106,0,0.55))'
              : 'drop-shadow(0 0 14px rgba(255,106,0,0.22)) grayscale(0.25)',
            opacity: live ? 1 : 0.85,
          }}
        >
          🎃
        </div>
      </div>
    </section>
  );
}

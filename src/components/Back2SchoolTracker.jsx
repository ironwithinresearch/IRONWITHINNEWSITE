'use client';

import { useState, useEffect } from 'react';
import { Clock, Backpack, Target, Gift } from 'lucide-react';

// Back 2 School Peptide Bash — Thu Aug 6 4:00pm CT → Sun Aug 9 11:59:59pm CT.
// CDT = UTC-5. These mirror the constants in mu-plugin iw-back2school.php.
const B2S_START = Date.parse('2026-08-06T21:00:00Z');
const B2S_END   = Date.parse('2026-08-10T04:59:59Z');

const pad = (n) => String(n).padStart(2, '0');

export default function Back2SchoolTracker() {
  const [now, setNow] = useState(null);   // null until mounted → no hydration mismatch
  const [data, setData] = useState(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let dead = false;
    const pull = async () => {
      try {
        const r = await fetch('/api/b2s');
        const d = await r.json();
        if (!dead) setData(d);
      } catch { /* tracker is decorative — never surface a fetch error */ }
    };
    pull();
    const id = setInterval(pull, 60000);
    return () => { dead = true; clearInterval(id); };
  }, []);

  if (now === null || now < B2S_START || now >= B2S_END) return null;

  const left = B2S_END - now;
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const time = (d > 0 ? `${d}d ` : '') + `${pad(h)}h ${pad(m)}m ${pad(s)}s`;

  const packs   = data?.backpacks ?? 0;
  const goal    = data?.goal ?? 75;
  const toNext  = data?.to_next ?? 1000;
  const nextPct = Math.max(0, Math.min(100, data?.next_pct ?? 0));
  const goalPct = Math.max(0, Math.min(100, data?.goal_pct ?? 0));
  const pct     = data?.percent_off ?? 0;
  const gift    = data?.gift_active;

  const bogo = data?.bogo;
  // The 50% tier is earned, not automatic — it needs `min_items` qualifying units in the
  // cart. Say so in the headline: the discount is applied by a price filter, so a shopper
  // under the threshold sees LIST prices everywhere, and a bare "50% OFF SITEWIDE" claim
  // reads as a broken sale rather than an offer they have not unlocked yet.
  const gated = data?.gated;
  const minItems = data?.min_items ?? 3;
  const offer = pct
    ? (gated ? `BUY ${minItems}+, GET ${pct}% OFF` : `${pct}% OFF SITEWIDE`)
      + (bogo ? ' + buy one, get one 1/2 off' : '')
      + (gift ? ' + free vial on $200+' : '')
    : (gift ? 'Free RT-3 or TRZ-2 10mg on $200+' : 'Weekend sale');

  const NAVY = '#0d1b34';
  const PINK = '#e8194b';

  return (
    <div style={{
      maxWidth: 620, margin: '0 auto 26px', padding: '20px 22px', textAlign: 'left',
      // Opaque navy on purpose: the storefront has a light/dark toggle and a
      // translucent card turned muddy over the light theme.
      background: 'linear-gradient(135deg, #1b2c4d 0%, #0d1b34 55%, #0b1220 100%)',
      border: `1px solid ${'#e8194b'}`, borderRadius: 16,
      boxShadow: '0 10px 34px rgba(0,0,0,0.30)',
    }}>
      {/* header: title + countdown */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', fontWeight: 900,
          letterSpacing: '0.10em', textTransform: 'uppercase', color: '#fff',
          background: PINK, padding: '5px 11px', borderRadius: 999,
        }}>
          <Backpack size={14} /> Back 2 School Bash
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.84rem',
          fontWeight: 800, color: '#ffd9e2', marginLeft: 'auto',
        }}>
          <Clock size={14} /> ends in{' '}
          <strong style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{time}</strong>
        </span>
      </div>

      <div style={{
        fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {gift && <Gift size={16} style={{ color: PINK, flex: 'none' }} />}
        {offer}
      </div>

      {/* progress to the next backpack */}
      <div style={{ marginBottom: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.80)', fontWeight: 700, marginBottom: 6 }}>
          <span>Next backpack</span>
          <span style={{ color: '#fff' }}>
            ${toNext.toLocaleString(undefined, { maximumFractionDigits: 0 })} to go
          </span>
        </div>
        <div style={{ height: 12, borderRadius: 999, background: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
          <div style={{
            width: `${nextPct}%`, height: '100%', borderRadius: 999,
            background: `linear-gradient(90deg, ${PINK}, #ff6b8f)`,
            transition: 'width 700ms ease',
          }} />
        </div>
      </div>

      {/* progress toward the 75-backpack goal */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.80)', fontWeight: 700, marginBottom: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Target size={13} /> Goal: {goal} backpacks
          </span>
          <span style={{ color: '#fff' }}>
            <strong style={{ fontSize: '1rem' }}>{packs}</strong> filled
            {packs < goal && <span style={{ color: 'rgba(255,255,255,0.6)' }}> · {goal - packs} to go</span>}
          </span>
        </div>
        <div style={{ height: 12, borderRadius: 999, background: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
          <div style={{
            width: `${goalPct}%`, height: '100%', borderRadius: 999,
            background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
            transition: 'width 700ms ease',
          }} />
        </div>
      </div>

      <p style={{ margin: '13px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
        Every <strong style={{ color: '#fff' }}>$1,000</strong> sold this weekend fills a backpack for a local
        school. Thank you for helping us make a difference.
      </p>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Clock, Snowflake, Check } from 'lucide-react';

/**
 * Fill the Freezer — homepage sale banner. Replaces Back2SchoolTracker (and its
 * backpack drive, which belonged to that event only).
 *
 * Window MUST match IW_B2S_START / IW_B2S_END in mu-plugin iw-fill-the-freezer.php.
 * The banner self-gates on it, so it disappears on its own Sunday at midnight CT —
 * but a mismatch here shows a sale the backend is not honouring, so keep them in step.
 *
 * The offer text is read from /api/b2s rather than hardcoded, so the percent and the
 * threshold always come from the thing that actually moves prices. Only the window is
 * duplicated, and only so the banner can vanish without waiting on a fetch.
 */
const FTF_START = Date.parse('2026-08-14T12:00:00Z');
const FTF_END = Date.parse('2026-08-17T04:59:59Z');

const pad = (n) => String(n).padStart(2, '0');

export default function FillTheFreezerBanner() {
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
      } catch { /* banner is decorative — never surface a fetch error */ }
    };
    pull();
    const id = setInterval(pull, 60000);
    return () => { dead = true; clearInterval(id); };
  }, []);

  if (now === null || now < FTF_START || now >= FTF_END) return null;

  const left = FTF_END - now;
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const time = (d > 0 ? `${d}d ` : '') + `${pad(h)}h ${pad(m)}m ${pad(s)}s`;

  const pct = data?.percent_off ?? 45;
  const minItems = data?.min_items ?? 3;
  const gated = data?.gated ?? true;

  const ICE = '#22d3ee';

  // The discount is a server-side price filter earned at `minItems` units. A shopper
  // below the threshold sees the standing summer sale price, NOT list — so the ladder
  // is worth spelling out. Saying only "45% OFF" would misdescribe what a 1-item cart
  // is actually being shown, which is the fastest way to make a working sale look broken.
  const steps = [
    { label: `1–${minItems - 1} items`, value: 'Summer sale pricing', on: false },
    { label: `${minItems}+ items`, value: `${pct}% off everything`, on: true },
  ];

  return (
    <div style={{
      maxWidth: 620, margin: '0 auto 26px', padding: '20px 22px', textAlign: 'left',
      // Opaque on purpose: the storefront has a light/dark toggle and a translucent
      // card turns muddy over the light theme.
      background: 'linear-gradient(135deg, #10375c 0%, #062a45 55%, #041824 100%)',
      border: `1px solid ${ICE}`, borderRadius: 16,
      boxShadow: '0 10px 34px rgba(0,0,0,0.30)',
    }}>
      {/* header: title + countdown */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', fontWeight: 900,
          letterSpacing: '0.10em', textTransform: 'uppercase', color: '#04222f',
          background: ICE, padding: '5px 11px', borderRadius: 999,
        }}>
          <Snowflake size={14} /> Fill the Freezer
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.84rem',
          fontWeight: 800, color: '#bfefff', marginLeft: 'auto',
        }}>
          <Clock size={14} /> ends in{' '}
          <strong style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{time}</strong>
        </span>
      </div>

      <div style={{ fontSize: '1.28rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
        {gated ? `Buy ${minItems}+ items, get ${pct}% off` : `${pct}% off sitewide`}
      </div>
      <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.72)', marginBottom: 16 }}>
        No code needed — it comes off automatically at {minItems} items. Stack your affiliate code on top.
      </div>

      {/* the ladder */}
      <div style={{ display: 'grid', gap: 8 }}>
        {steps.map((st) => (
          <div
            key={st.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 13px', borderRadius: 11,
              background: st.on ? 'rgba(34,211,238,0.14)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${st.on ? 'rgba(34,211,238,0.55)' : 'rgba(255,255,255,0.12)'}`,
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%', flex: 'none',
              background: st.on ? ICE : 'rgba(255,255,255,0.14)',
              color: st.on ? '#04222f' : 'rgba(255,255,255,0.6)',
            }}>
              {st.on ? <Check size={13} strokeWidth={3} /> : <Snowflake size={12} />}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.82)' }}>
              {st.label}
            </span>
            <span style={{
              marginLeft: 'auto', fontSize: '0.9rem', fontWeight: 900,
              color: st.on ? '#fff' : 'rgba(255,255,255,0.6)',
            }}>
              {st.value}
            </span>
          </div>
        ))}
      </div>

      <p style={{ margin: '13px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>
        Stock up while it&rsquo;s deep — ends <strong style={{ color: '#fff' }}>Sunday at midnight CT</strong>.
        Gift cards, bundles and Research Plans keep their own pricing.
      </p>
    </div>
  );
}

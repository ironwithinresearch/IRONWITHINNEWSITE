'use client';

/* Labor Day spend ladder — three cumulative free vials at $175 / $275 / $425.

   Mirrors mu-plugin iw-spend-ladder.php. `subtotal` MUST be the discount-net figure
   (items after coupons, minus negative cart fees), the same number FreeShippingBar is
   fed and the same one iw_ladder_qualifying_total() computes on the server. Passing the
   raw subtotal makes this promise a vial checkout then declines.

   Renders nothing outside the promo window, so it disappears on its own Monday night. */

import { Gift, Check } from 'lucide-react';
import { LADDER_RUNGS, ladderStatus } from '@/lib/p2p';

const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
const whole = (n) => `$${Math.round(n)}`;

export default function SpendLadder({ subtotal = 0 }) {
  const s = Number(subtotal) || 0;
  const { active, earned, next, remaining, value } = ladderStatus(s);
  if (!active) return null;

  const top = LADDER_RUNGS[LADDER_RUNGS.length - 1].min;
  const pct = Math.min(100, Math.max(2, (s / top) * 100));

  return (
    <div style={{
      background: 'var(--bg-dark)',
      border: `1px solid ${earned.length ? 'rgba(52,211,153,0.45)' : 'var(--glass-border)'}`,
      borderRadius: '12px', padding: '12px 14px', marginBottom: '18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', lineHeight: 1.35, marginBottom: '10px', color: 'var(--text-secondary)' }}>
        <Gift size={15} color={earned.length ? '#34d399' : 'var(--primary-blue)'} style={{ flexShrink: 0 }} />
        {next ? (
          <span>
            Add <strong style={{ color: 'var(--text-light)' }}>{money(remaining)}</strong> for a free{' '}
            <strong style={{ color: 'var(--text-light)' }}>{next.label}</strong>
            <span style={{ color: 'var(--text-muted)' }}> ({money(next.value)} value)</span>
          </span>
        ) : (
          <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>
            Every free vial unlocked — <span style={{ color: '#34d399' }}>{money(value)}</span> on the house 🎉
          </span>
        )}
      </div>

      <div style={{ position: 'relative', height: 7, borderRadius: 999, background: 'var(--card-elevated)', marginBottom: 10 }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: earned.length ? '#34d399' : 'var(--gradient-primary)', transition: 'width 0.4s ease' }} />
        {LADDER_RUNGS.slice(0, -1).map((r) => (
          <span key={r.min} aria-hidden="true" style={{
            position: 'absolute', top: -2, left: `${(r.min / top) * 100}%`,
            width: 2, height: 11, borderRadius: 1,
            background: s >= r.min ? '#34d399' : 'var(--glass-border)',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {LADDER_RUNGS.map((r) => {
          const got = s >= r.min;
          return (
            <div key={r.min} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.76rem', color: got ? 'var(--text-light)' : 'var(--text-muted)' }}>
              {got
                ? <Check size={13} color="#34d399" style={{ flexShrink: 0 }} />
                : <span aria-hidden="true" style={{ width: 13, textAlign: 'center', color: 'var(--text-muted)' }}>·</span>}
              <strong style={{ minWidth: 38, color: got ? '#34d399' : 'inherit' }}>{whole(r.min)}</strong>
              <span>{r.label}</span>
              <span style={{ color: 'var(--text-muted)' }}>{money(r.value)} value</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';

/**
 * "Add N more to unlock 50%" for the buy-3 tier.
 *
 * The discount is applied by a server-side price filter that only fires once the cart
 * holds `min_items` qualifying units. Without this nudge a shopper with two vials sees
 * list prices everywhere while the announcement bar advertises 50% off, which reads as
 * a broken sale rather than an offer one item away.
 *
 * Reads /api/b2s only for GLOBAL facts (is the gate on, what is the minimum). The count
 * comes from the caller via `units`, never from that payload: the route proxies the
 * backend server-side without the shopper's cart session AND caches publicly, so any
 * per-session number there is both wrong and shared between shoppers.
 */
export default function B2SUnlockNudge({ units }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let on = true;
    fetch('/api/b2s', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (on) setData(d); })
      .catch(() => {});
    return () => { on = false; };
  }, [units]);

  if (!data?.gated || !data?.percent_off) return null;

  const min = data.min_items ?? 3;
  // The caller's own count — the only trustworthy source (see above), and it updates
  // the instant a quantity changes.
  const have = typeof units === 'number' ? units : 0;
  const need = Math.max(0, min - have);
  const unlocked = need === 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '14px 16px',
      borderRadius: 14, border: `1px solid ${unlocked ? 'rgba(52,211,153,0.45)' : 'rgba(232,25,75,0.45)'}`,
      background: unlocked ? 'rgba(52,211,153,0.10)' : 'rgba(232,25,75,0.10)',
    }}>
      <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{unlocked ? '🎉' : '🎒'}</span>
      <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
        {unlocked ? (
          <>
            <strong style={{ color: 'var(--text-light)' }}>{data.percent_off}% off is unlocked</strong>
            <span style={{ color: 'var(--text-secondary)' }}> — it is already in the prices below.</span>
          </>
        ) : (
          <>
            <strong style={{ color: 'var(--text-light)' }}>
              Add {need} more item{need === 1 ? '' : 's'} to unlock {data.percent_off}% off
            </strong>
            <span style={{ color: 'var(--text-secondary)' }}>
              {' '}— the sale applies to carts of {min}+ ({have} so far).
            </span>
          </>
        )}
      </div>
    </div>
  );
}

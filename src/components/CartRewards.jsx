'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Minus, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchRewards } from '@/lib/rewards';

/* IWR Rewards in the cart: shows what they'll earn, and lets members spend points
   straight off the total with a stepper. The chosen amount is applied at checkout
   as a discount (no coupon code) — controlled by the parent (value + onChange). */

export default function CartRewards({ subtotal = 0, value = 0, onChange }) {
  const { isLoggedIn } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => { if (isLoggedIn) fetchRewards().then(setData); }, [isLoggedIn]);

  // --- All hooks must run unconditionally (before any early return) ---
  const stepPts = data?.redeem_points || 500;   // 500 pts
  const stepUsd = data?.redeem_dollars || 5;     // = $5
  const balPts = data?.points || 0;
  const maxByPoints = Math.floor(balPts / stepPts) * stepPts;
  const maxBySubtotal = Math.floor((Number(subtotal) || 0) / stepUsd) * stepPts;
  const maxPts = Math.max(0, Math.min(maxByPoints, maxBySubtotal));
  const clamped = Math.max(0, Math.min(value || 0, maxPts));

  // Clamp the chosen value down if the balance/subtotal dropped below it.
  useEffect(() => {
    if (clamped !== (value || 0)) onChange?.(clamped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPts]);

  const earn = Math.floor((Number(subtotal) || 0) * 5); // base 5 pts / $1

  const box = { background: 'var(--bg-dark)', border: '1px solid rgba(0,207,255,0.22)', borderRadius: 12, padding: '12px 14px', marginBottom: 18, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 };
  const tag = { display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 800, color: 'var(--primary-blue)', marginRight: 6 };

  if (!isLoggedIn) {
    return (
      <div style={box}>
        <span style={tag}><Star size={13} /> IWR Rewards</span>
        Earn <strong style={{ color: 'var(--text-light)' }}>{earn} points</strong> on this order.{' '}
        <Link href="/rewards" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Join free →</Link>
      </div>
    );
  }
  if (!data) return null;

  const usd = (pts) => (pts / stepPts) * stepUsd;
  const set = (pts) => onChange?.(Math.max(0, Math.min(pts, maxPts)));
  const canRedeem = maxPts >= stepPts;

  const btn = (disabled) => ({
    width: 30, height: 30, borderRadius: 8, border: '1px solid var(--glass-border)',
    background: disabled ? 'transparent' : 'var(--card-elevated)', color: disabled ? 'var(--text-muted)' : '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div style={box}>
      <div>
        <span style={tag}><Star size={13} /> IWR Rewards</span>
        <strong style={{ color: 'var(--text-light)' }}>{balPts.toLocaleString()} pts</strong> (${data.value}) · {data.tier?.current?.name} · earn <strong style={{ color: 'var(--text-light)' }}>{earn}</strong> more here
      </div>

      {canRedeem ? (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontSize: '0.82rem' }}>Spend points on this order</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button aria-label="Less" onClick={() => set(clamped - stepPts)} disabled={clamped <= 0} style={btn(clamped <= 0)}><Minus size={15} /></button>
              <span style={{ minWidth: 78, textAlign: 'center', fontWeight: 800, color: clamped > 0 ? '#34d399' : 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                −${usd(clamped).toFixed(0)}
              </span>
              <button aria-label="More" onClick={() => set(clamped + stepPts)} disabled={clamped >= maxPts} style={btn(clamped >= maxPts)}><Plus size={15} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <button onClick={() => set(0)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}>Clear</button>
            <button onClick={() => set(maxPts)} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Use max (${usd(maxPts).toFixed(0)})</button>
          </div>
          {clamped > 0 && (
            <div style={{ marginTop: 8, color: '#34d399', fontWeight: 600, fontSize: '0.8rem' }}>
              {clamped.toLocaleString()} pts → ${usd(clamped).toFixed(2)} off · comes off your total at checkout
            </div>
          )}
        </div>
      ) : (
        balPts > 0 && (
          <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Earn {Math.max(0, stepPts - balPts).toLocaleString()} more pts to redeem ${stepUsd} off.
          </div>
        )
      )}
    </div>
  );
}

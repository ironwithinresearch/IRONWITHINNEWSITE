'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchRewards, redeemRewards } from '@/lib/rewards';

/* IWR Rewards in the cart: shows what they'll earn, and (for members with enough
   points) one-tap redeem → mints a coupon → applies it to the cart inline. */

export default function CartRewards({ subtotal = 0, onApplyCode }) {
  const { isLoggedIn } = useAuth();
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (isLoggedIn) fetchRewards().then(setData); }, [isLoggedIn]);

  const earn = Math.floor(Number(subtotal) || 0); // base 1 pt / $1 (tier multiplier is gravy)

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

  const step = data.redeem_dollars || 10;
  const ptsPer = data.redeem_points || 500;
  const maxD = Math.floor((data.points || 0) / ptsPer) * step;
  const opts = [];
  for (let d = step; d <= maxD && opts.length < 3; d += step) opts.push(d);

  const redeem = async (d) => {
    setMsg(''); setBusy(d);
    const r = await redeemRewards(d);
    setBusy(0);
    if (r?.success) { await onApplyCode?.(r.code); setMsg(`Applied $${d} off 🎉`); fetchRewards().then(setData); }
    else setMsg(r?.error || 'Could not redeem.');
  };

  return (
    <div style={box}>
      <div>
        <span style={tag}><Star size={13} /> IWR Rewards</span>
        <strong style={{ color: 'var(--text-light)' }}>{(data.points || 0).toLocaleString()} pts</strong> (${data.value}) · {data.tier?.current?.name} · earn <strong style={{ color: 'var(--text-light)' }}>{earn}</strong> more here
      </div>
      {opts.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {opts.map((d) => (
            <button key={d} onClick={() => redeem(d)} disabled={busy > 0}
              style={{ padding: '6px 14px', background: 'var(--card-elevated)', border: '1px solid var(--glass-border)', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: busy ? 'wait' : 'pointer' }}>
              {busy === d ? '…' : `Redeem $${d}`}
            </button>
          ))}
        </div>
      )}
      {msg && <div style={{ marginTop: 8, color: '#34d399', fontWeight: 600 }}>{msg}</div>}
    </div>
  );
}

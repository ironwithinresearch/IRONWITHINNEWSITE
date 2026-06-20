'use client';

import { Truck, Check } from 'lucide-react';

/* Free-shipping progress bar. Gamifies the $225 free-US-shipping threshold:
   "You're $X away from free US shipping" with a fill bar, → "unlocked" at $225+
   (or when the cart already has free shipping, e.g. a Subscribe & Save item). */

const THRESHOLD = 225;
const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;

export default function FreeShippingBar({ subtotal = 0, alreadyFree = false }) {
  const s = Number(subtotal) || 0;
  const unlocked = alreadyFree || s >= THRESHOLD;
  const remaining = Math.max(0, THRESHOLD - s);
  const pct = unlocked ? 100 : Math.min(100, Math.max(3, (s / THRESHOLD) * 100));

  return (
    <div style={{ background: 'var(--bg-dark)', border: `1px solid ${unlocked ? 'rgba(52,211,153,0.45)' : 'var(--glass-border)'}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', lineHeight: 1.35, marginBottom: '9px', color: 'var(--text-secondary)' }}>
        {unlocked ? (
          <><Check size={15} color="#34d399" style={{ flexShrink: 0 }} /><span style={{ color: 'var(--text-light)', fontWeight: 600 }}>You&apos;ve unlocked <span style={{ color: '#34d399' }}>FREE U.S. shipping</span> 🎉</span></>
        ) : (
          <><Truck size={15} color="var(--primary-blue)" style={{ flexShrink: 0 }} /><span>You&apos;re <strong style={{ color: 'var(--text-light)' }}>{money(remaining)}</strong> away from <strong style={{ color: 'var(--text-light)' }}>FREE U.S. shipping</strong></span></>
        )}
      </div>
      <div style={{ height: 7, borderRadius: 999, background: 'var(--card-elevated)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: unlocked ? '#34d399' : 'var(--gradient-primary)', transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

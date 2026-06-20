'use client';

import { useState } from 'react';
import { defaultUpsellVariation, UPSELL_DISCOUNT } from '@/lib/upsell';

/* Pre-checkout upsell modal. Presentational: given a featured product, shows a
   one-tap discounted add-on offer. Parent handles selection + navigation. */

const money = (n) => `$${(n).toFixed(2)}`;
const num = (p) => parseFloat(String(p || '').replace(/[^0-9.]/g, '')) || 0;

export default function PreCheckoutUpsell({ product, onAdd, onSkip }) {
  const [adding, setAdding] = useState(false);
  if (!product) return null;

  const variation = defaultUpsellVariation(product);
  if (!variation) return null;

  const base = num(variation.price);
  const discounted = base * (1 - UPSELL_DISCOUNT);
  const img = variation.image?.sourceUrl || product.image?.sourceUrl;
  const dose = (variation.attributes?.nodes || []).map((a) => a.value).join(' ');

  const handleAdd = async () => {
    setAdding(true);
    try { await onAdd(product, variation); } finally { setAdding(false); }
  };

  return (
    <div onClick={onSkip}
      style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(2,5,10,0.74)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 440, background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: '30px 28px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.3)', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--primary-blue)', marginBottom: 16 }}>
          One-time offer
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
          Add this before you check out?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 20px' }}>
          Save an extra {Math.round(UPSELL_DISCOUNT * 100)}% if you add it to this order.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 14, padding: 14, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 10, background: 'var(--card-elevated)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {img ? <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-light)', fontSize: '0.95rem' }}>{product.name}{dose ? ` · ${dose}` : ''}</div>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontWeight: 800, color: 'var(--primary-blue)', fontSize: '1.1rem' }}>{money(discounted)}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'line-through' }}>{money(base)}</span>
            </div>
          </div>
        </div>

        <button onClick={handleAdd} disabled={adding}
          style={{ width: '100%', padding: 14, background: 'var(--gradient-primary)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: adding ? 'wait' : 'pointer', fontFamily: 'var(--font-body)', boxShadow: 'var(--glow-blue)' }}>
          {adding ? 'Adding…' : `Add to my order — save ${Math.round(UPSELL_DISCOUNT * 100)}%`}
        </button>
        <button onClick={onSkip} disabled={adding}
          style={{ width: '100%', marginTop: 10, padding: 10, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          No thanks, continue to checkout →
        </button>
      </div>
    </div>
  );
}

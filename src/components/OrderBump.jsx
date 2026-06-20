'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';

/* Checkout order bump: a one-click add-on checkbox for Bacteriostatic Water (IWR H2O)
   at 5% off. Hidden if the cart already has it (incl. the free bundle gift). */

const BUMP_PARENT = 301;   // IWR H2O
const BUMP_VAR = 560;      // 30ml
const BASE = 21.21;        // IWR H2O price
const DISC = BASE * 0.95;  // 5% off (iw_upsell)
const money = (n) => `$${n.toFixed(2)}`;

export default function OrderBump({ cartItems, onAdd, onRemove }) {
  const [busy, setBusy] = useState(false);

  const bac = (cartItems || []).find((i) => i.product?.node?.databaseId === BUMP_PARENT);
  const isFreeGift = bac && (bac.extraData || []).some((e) => e.key === 'iw_bundle_gift' && e.value === '1');
  if (isFreeGift) return null; // already included free with the bundle

  const checked = !!bac;

  const toggle = async () => {
    setBusy(true);
    try {
      if (checked) await onRemove(bac.key);
      else await onAdd(BUMP_PARENT, 1, BUMP_VAR, { iw_upsell: '1' });
    } finally { setBusy(false); }
  };

  return (
    <div onClick={busy ? undefined : toggle}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', margin: '0 0 18px', background: checked ? 'rgba(0,207,255,0.06)' : 'var(--card-dark)', border: `1px dashed ${checked ? 'var(--primary-blue)' : 'rgba(245,158,11,0.5)'}`, borderRadius: 12, cursor: busy ? 'wait' : 'pointer' }}>
      <div style={{ width: 22, height: 22, flexShrink: 0, marginTop: 1, borderRadius: 6, border: `2px solid ${checked ? 'var(--primary-blue)' : 'var(--text-muted)'}`, background: checked ? 'var(--primary-blue)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {checked && <Check size={14} color="#001018" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: 'var(--text-light)', fontSize: '0.92rem' }}>
          {checked ? 'Added — ' : 'Add '} Bacteriostatic Water (IWR H2O){' '}
          <span style={{ color: 'var(--primary-blue)', fontWeight: 800 }}>{money(DISC)}</span>{' '}
          <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.82rem', fontWeight: 600 }}>{money(BASE)}</span>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 3 }}>
          A lab essential most researchers add to their order — 5% off when you add it here.
        </div>
      </div>
      {!checked && <Plus size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />}
    </div>
  );
}

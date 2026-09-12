'use client';

// Small cart-summary nudge: if the signed-in customer has store credit, tell them
// it'll be applied automatically at checkout. Silent (renders nothing) when there's
// no credit or they're logged out.

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { fetchStoreCredit } from '@/lib/storeCredit';

export default function CartStoreCredit() {
  const [bal, setBal] = useState(0);
  useEffect(() => {
    let on = true;
    fetchStoreCredit().then((d) => {
      if (on && d) setBal(Math.max(0, parseFloat(d.balance) || 0));
    });
    return () => { on = false; };
  }, []);

  if (!(bal > 0)) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.35)',
      borderRadius: '12px', padding: '12px 14px', marginBottom: '16px',
    }}>
      <Wallet size={18} color="#34d399" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
        You have <strong style={{ color: '#34d399' }}>${bal.toFixed(2)}</strong> in store credit —
        applied automatically at checkout.
      </span>
    </div>
  );
}

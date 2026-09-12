'use client';

// Small cart-summary nudge: if the signed-in customer has store credit, tell them
// it'll be applied automatically at checkout — or, when the cart carries an offer the
// wallet may not stack on, that it is staying on their account. Silent (renders
// nothing) when there's no credit or they're logged out.
//
// The eligibility rule is the server's (iw-store-credit-limits.php); creditEligibility
// mirrors it. Promising a credit here that checkout then withholds is worse than saying
// nothing, so this reads from the same rule the checkout does.

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { fetchStoreCredit } from '@/lib/storeCredit';
import { creditEligibility } from '@/lib/creditEligibility';

export default function CartStoreCredit({ cart }) {
  const [bal, setBal] = useState(0);
  useEffect(() => {
    let on = true;
    fetchStoreCredit().then((d) => {
      if (on && d) setBal(Math.max(0, parseFloat(d.balance) || 0));
    });
    return () => { on = false; };
  }, []);

  if (!(bal > 0)) return null;

  const rule = creditEligibility(cart);
  const tint = rule.eligible ? '52,211,153' : '148,163,184';
  const accent = rule.eligible ? '#34d399' : 'var(--text-secondary)';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: `rgba(${tint},0.07)`, border: `1px solid rgba(${tint},0.35)`,
      borderRadius: '12px', padding: '12px 14px', marginBottom: '16px',
    }}>
      <Wallet size={18} color={accent} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
        You have <strong style={{ color: accent }}>${bal.toFixed(2)}</strong> in store credit —
        {rule.eligible
          ? ' applied automatically at checkout.'
          : ` ${rule.reason} It stays on your account for next time.`}
      </span>
    </div>
  );
}

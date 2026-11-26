'use client';
// Thanksgiving (lib/thanksgiving.js): a cart holding any sale-priced line checks out by app only
// (mu-plugin iw-thanksgiving-p2p.php). Say so here, before checkout. Renders nothing outside the
// window or on a full-price-only cart (capsules etc. keep card).
import { useEffect, useState } from 'react';
import { tgCartP2POnly } from '@/lib/thanksgiving';

export default function TGCartNudge({ items = [] }) {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(tgCartP2POnly(items)); }, [items]);
  if (!on) return null;
  return (
    <div role="status" style={{ marginBottom: 20, padding: '12px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.40)', color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.55 }}>
      Sale prices at app &amp; crypto checkout.
    </div>
  );
}

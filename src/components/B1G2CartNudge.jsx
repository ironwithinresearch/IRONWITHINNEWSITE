'use client';
// Black Friday sale days: buy 1, get 2 free on RT-3 20mg / RT-3 30mg / TRZ-2 30mg (iw-bf-sale.php).
// The deal needs 3 of the SAME size in the cart, so a shopper holding 1 or 2 is told how many more
// to add. Counts units per variation exactly like iw_bf_calc() (lines of one size are pooled) and
// stops nudging once the 2-deal cap is reached. Renders nothing outside a sale day.
import { useEffect, useState } from 'react';
import { bfLive, BF_B1G2, BF_B1G2_MAX_DEALS } from '@/lib/blackFriday';

export default function B1G2CartNudge({ items = [] }) {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(bfLive()); }, [items]);
  if (!on) return null;

  const units = {};
  for (const it of items) {
    const vid = it?.variation?.node?.databaseId;
    if (!BF_B1G2[vid]) continue;
    units[vid] = (units[vid] || 0) + (Number(it.quantity) || 0);
  }
  const tips = Object.entries(units).flatMap(([vid, q]) => {
    const deals = Math.floor(q / 3);
    if (deals >= BF_B1G2_MAX_DEALS) return [];
    const rem = q % 3;
    if (rem === 0) return [];
    const need = 3 - rem;
    return [`${BF_B1G2[vid].name}: add ${need} more and you pay for 1 of every 3 (buy 1, get 2 free, Venmo, Zelle or crypto checkout only).`];
  });
  if (!tips.length) return null;
  return (
    <div role="status" style={{ marginBottom: 20, padding: '12px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.40)', color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.55 }}>
      {tips.map((t) => <div key={t}>{t}</div>)}
    </div>
  );
}

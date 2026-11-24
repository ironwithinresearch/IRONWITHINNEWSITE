'use client';
import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { shipPauseLive, PAUSE_MESSAGE } from '@/lib/shipPause';

/* Thanksgiving shipping pause note (src/lib/shipPause.js). Shown on cart, checkout, the
   Shipping page and the FAQ while the pause is in force; renders nothing before mount and
   after PAUSE_END, so it switches itself off with no redeploy and never mismatches on
   hydration. */
export default function ShipPauseNote({ style }) {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(shipPauseLive()); }, []);
  if (!on) return null;
  return (
    <div role="note" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(217,119,6,0.45)', background: 'rgba(245,158,11,0.09)', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55, textAlign: 'left', ...style }}>
      <Truck size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
      <span><strong style={{ color: 'var(--text-light)' }}>{PAUSE_MESSAGE.split(':')[0]}:</strong>{PAUSE_MESSAGE.slice(PAUSE_MESSAGE.indexOf(':') + 1)}</span>
    </div>
  );
}

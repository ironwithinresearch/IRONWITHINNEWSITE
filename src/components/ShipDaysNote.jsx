'use client';
import { useEffect, useState } from 'react';
import { shipDaysLive, SHIPDAYS_LABEL, SHIPDAYS_UNTIL } from '@/lib/shipDays';

/* Inline note for pages that state the normal Mon–Fri schedule (Shipping, FAQ), shown only
   while the reduced schedule in src/lib/shipDays.js is in force. Client-side so it switches
   off on its own without a redeploy. */
export default function ShipDaysNote({ style }) {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(shipDaysLive()); }, []);
  if (!on) return null;
  return (
    <div role="note" style={{ margin: '0 auto 22px', maxWidth: 720, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(217,119,6,0.4)', background: 'rgba(245,158,11,0.08)', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55, textAlign: 'left', ...style }}>
      <strong style={{ color: 'var(--text-light)' }}>Temporary schedule:</strong> through {SHIPDAYS_UNTIL}, orders ship {SHIPDAYS_LABEL} only. Orders placed on other days go out on the next ship day. The normal schedule below resumes after that.
    </div>
  );
}

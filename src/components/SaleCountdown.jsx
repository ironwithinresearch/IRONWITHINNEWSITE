'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// Matches AnnouncementBar SALE_ENDS — Father's Day sale ends 11:59pm Central Sun 6/21.
const SALE_ENDS = Date.parse('2026-06-22T04:59:59Z');

export default function SaleCountdown() {
  const [left, setLeft] = useState(null); // null until mounted → no hydration mismatch
  useEffect(() => {
    const tick = () => setLeft(SALE_ENDS - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (left === null || left <= 0) return null; // not mounted, or sale over → hide

  const pad = (n) => String(n).padStart(2, '0');
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const time = (d > 0 ? `${d}d ` : '') + `${pad(h)}h ${pad(m)}m ${pad(s)}s`;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 20px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.45)', borderRadius: '999px', marginBottom: '24px', fontSize: '0.9rem', color: '#fbbf24', fontWeight: 600 }}>
      <Clock size={15} /> Father&apos;s Day Sale ends in{' '}
      <strong style={{ fontVariantNumeric: 'tabular-nums', color: '#fff', letterSpacing: '0.02em' }}>{time}</strong>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span> 15% off everything
    </div>
  );
}

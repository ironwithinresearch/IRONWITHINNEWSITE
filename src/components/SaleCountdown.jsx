'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// Lacey's Birthday Bash — Fri Jun 26 7PM CT → Sun Jun 28 7PM CT (CDT = UTC-5,
// so 7PM CDT = 00:00 UTC next day). Matches the backend window + AnnouncementBar.
const BB_START = Date.parse('2026-06-27T00:00:00Z');
const BB_END   = Date.parse('2026-06-29T00:00:00Z');

export default function SaleCountdown() {
  const [now, setNow] = useState(null); // null until mounted → no hydration mismatch
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null || now < BB_START || now >= BB_END) return null; // only during the sale

  const left = BB_END - now;
  const pad = (n) => String(n).padStart(2, '0');
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const time = (d > 0 ? `${d}d ` : '') + `${pad(h)}h ${pad(m)}m ${pad(s)}s`;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 20px', background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.55)', borderRadius: '999px', marginBottom: '24px', fontSize: '0.9rem', color: '#f9a8d4', fontWeight: 700 }}>
      <Clock size={15} /> <strong style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Birthday Bash</strong>&nbsp;— ends in{' '}
      <strong style={{ fontVariantNumeric: 'tabular-nums', color: '#fff', letterSpacing: '0.02em' }}>{time}</strong>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span> 15% off sitewide
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';

// Live countdown to a UTC target. Renders a stable placeholder until mounted
// (avoids hydration mismatch), then ticks every second.
export default function XmasCountdown({ target, label }) {
  const [t, setT] = useState(null);
  useEffect(() => {
    const tick = () => {
      const ms = new Date(target).getTime() - Date.now();
      if (ms <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setT({
        d: Math.floor(ms / 86400000),
        h: Math.floor(ms / 3600000) % 24,
        m: Math.floor(ms / 60000) % 60,
        s: Math.floor(ms / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n) => String(n).padStart(2, '0');
  const seg = (n, l) => (
    <div style={{ textAlign: 'center', minWidth: 58 }}>
      <div style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '2.1rem', fontWeight: 900, lineHeight: 1, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>{pad(n)}</div>
      <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{l}</div>
    </div>
  );

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {label && <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f5c542' }}>{label}</div>}
      <div style={{ display: 'flex', gap: 10, padding: '12px 18px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(245,197,66,0.35)', borderRadius: 14, backdropFilter: 'blur(6px)' }}>
        {t ? (
          <>{seg(t.d, 'days')}<Colon />{seg(t.h, 'hrs')}<Colon />{seg(t.m, 'min')}<Colon />{seg(t.s, 'sec')}</>
        ) : (
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>-- : -- : -- : --</div>
        )}
      </div>
    </div>
  );
}

function Colon() {
  return <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', alignSelf: 'flex-start', lineHeight: 1.1 }}>:</div>;
}

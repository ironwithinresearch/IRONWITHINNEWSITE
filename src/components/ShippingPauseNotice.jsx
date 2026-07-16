'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Truck } from 'lucide-react';

// Checkout pop-up for the short shipping pause: Thu Jul 16 (2 PM CT) → Sunday Jul 19.
// Cutoff 2 PM CDT = 19:00 UTC; auto-hides once shipping resumes (start of Sun Jul 19 CT
// == 05:00 UTC). Shows once per browser session so it doesn't nag on every checkout visit.
const SHIP_CUTOFF = Date.parse('2026-07-16T19:00:00Z');
const SHIP_END = Date.parse('2026-07-19T05:00:00Z');
const SEEN_KEY = 'iw_ship_pause_jul16_seen';

export default function ShippingPauseNotice() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [afterCutoff, setAfterCutoff] = useState(false);

  useEffect(() => {
    if (!pathname || !pathname.startsWith('/checkout')) return;
    const now = Date.now();
    if (now >= SHIP_END) return;
    try { if (sessionStorage.getItem(SEEN_KEY)) return; } catch {}
    setAfterCutoff(now >= SHIP_CUTOFF);
    const t = setTimeout(() => setShow(true), 450);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!show) return null;
  const close = () => { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {} setShow(false); };

  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: 420, width: '100%', borderRadius: 20, padding: '32px 26px 24px', textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.22), transparent 62%), #0e1420',
        border: '1px solid rgba(251,191,36,0.45)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={close} aria-label="Close" style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>×</button>
        <div style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(251,191,36,0.14)', border: '1px solid rgba(251,191,36,0.35)' }}>
          <Truck size={26} color="#fbbf24" />
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fbbf24' }}>Shipping notice</div>
        <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '6px 0 10px' }}>
          Orders ship Sunday, July 19
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.95rem', lineHeight: 1.55, margin: '0 0 20px' }}>
          {afterCutoff
            ? 'Our shipping is paused for a short break until Sunday. Any order you place now is safe — it will ship Sunday, July 19. Thanks for your patience! 💙'
            : 'Heads up — shipping pauses Thursday, July 16 at 2 PM CT for a short break. Order before then to ship right away; orders placed after 2 PM Thursday will ship Sunday, July 19.'}
        </p>
        <button onClick={close} style={{ display: 'block', width: '100%', padding: '13px', borderRadius: 12, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', color: '#1a1205', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
          Got it — continue to checkout
        </button>
      </div>
    </div>
  );
}

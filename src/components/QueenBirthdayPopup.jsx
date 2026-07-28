'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

// "Queen's Birthday Bash" — modal shown ONCE PER SESSION to logged-in shoppers during the event
// (Wed Jul 29 6 PM CT → Sun Aug 2 midnight CT). Self-gates to the window.
const QB_START = Date.parse('2026-07-29T23:00:00Z');
const QB_END   = Date.parse('2026-08-03T05:00:00Z');
const SEEN_KEY = 'iw_queen_popup_2026';

export default function QueenBirthdayPopup() {
  const { isLoggedIn, mounted } = useAuth();
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState(null); // {d,h,m,s} until the sale ends

  useEffect(() => {
    if (!mounted || !isLoggedIn) return;
    const now = Date.now();
    if (now < QB_START || now >= QB_END) return;
    try { if (sessionStorage.getItem(SEEN_KEY)) return; } catch {}
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, [mounted, isLoggedIn]);

  // Live countdown to the sale end (only ticks while the popup is open).
  useEffect(() => {
    if (!show) return;
    const tick = () => {
      const ms = QB_END - Date.now();
      if (ms <= 0) { setLeft(null); return; }
      setLeft({
        d: Math.floor(ms / 86400000),
        h: Math.floor(ms / 3600000) % 24,
        m: Math.floor(ms / 60000) % 60,
        s: Math.floor(ms / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [show]);

  if (!show) return null;
  const close = () => { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {} setShow(false); };

  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(8,3,20,0.78)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: 440, width: '100%', borderRadius: 24, padding: '36px 28px 28px', textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.30), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.42), transparent 62%), #0a0612',
        border: '1px solid rgba(74,222,128,0.5)', boxShadow: '0 30px 90px rgba(0,0,0,0.7)' }}>
        <button onClick={close} aria-label="Close" style={{ position: 'absolute', top: 12, right: 15, background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 23, cursor: 'pointer' }}>×</button>
        <div style={{ fontSize: '3rem', lineHeight: 1, filter: 'drop-shadow(0 0 18px rgba(34,197,94,0.7))' }}>🐉</div>
        <div style={{ marginTop: 6, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#86efac' }}>Long Live the Queen</div>
        <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.7rem', fontWeight: 900, color: '#fff', margin: '6px 0 4px' }}>
          The <span style={{ background: 'linear-gradient(90deg,#4ade80,#c084fc,#4ade80)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Birthday Bash</span>
        </h2>
        <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#fff', margin: '2px 0 8px', textShadow: '0 0 42px rgba(34,197,94,0.7)' }}>38% OFF</div>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.55, margin: '0 0 14px' }}>
          Everything is <b style={{ color:'#fff' }}>38% off</b> to celebrate her birthday. Spend $300 and pick a{' '}
          <b style={{ color:'#fff' }}>FREE RETA or TIRZ 30mg</b> — and you're automatically entered to win a{' '}
          <b style={{ color:'#fff' }}>1-of-1 Iron Within challenge coin</b> or a chance at <b style={{ color:'#fff' }}>1 of 3 $300 giveaways.</b>
        </p>
        <Link href="/shop" onClick={close} style={{ display: 'block', width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(90deg,#7c3aed,#22c55e,#4ade80)', color: '#04121a', fontWeight: 800, fontSize: '1rem', textDecoration: 'none' }}>
          Shop the Birthday Bash 🐉
        </Link>
        {left && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#86efac', marginBottom: 7 }}>Sale ends in</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {[['Days', left.d], ['Hrs', left.h], ['Min', left.m], ['Sec', left.s]].map(([lab, val]) => (
                <div key={lab} style={{ minWidth: 58, padding: '8px 6px', borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(74,222,128,0.32)' }}>
                  <div style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.5rem', fontWeight: 900, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{String(val).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(134,239,172,0.7)', marginTop: 4 }}>{lab}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

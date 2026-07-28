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

  useEffect(() => {
    if (!mounted || !isLoggedIn) return;
    const now = Date.now();
    if (now < QB_START || now >= QB_END) return;
    try { if (sessionStorage.getItem(SEEN_KEY)) return; } catch {}
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, [mounted, isLoggedIn]);

  if (!show) return null;
  const close = () => { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {} setShow(false); };

  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(8,3,20,0.78)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: 440, width: '100%', borderRadius: 24, padding: '36px 28px 28px', textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.42), transparent 62%), radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.30), transparent 60%), #17092b',
        border: '1px solid rgba(216,180,254,0.55)', boxShadow: '0 30px 90px rgba(0,0,0,0.65)' }}>
        <button onClick={close} aria-label="Close" style={{ position: 'absolute', top: 12, right: 15, background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 23, cursor: 'pointer' }}>×</button>
        <div style={{ fontSize: '3rem', lineHeight: 1 }}>👑</div>
        <div style={{ marginTop: 6, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#e9d5ff' }}>Happy Birthday to our Queen</div>
        <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.7rem', fontWeight: 900, color: '#fff', margin: '6px 0 4px' }}>
          The <span style={{ background: 'linear-gradient(90deg,#c084fc,#f5c542,#e879f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Birthday Bash</span>
        </h2>
        <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#fff', margin: '2px 0 8px', textShadow: '0 0 40px rgba(216,180,254,0.6)' }}>38% OFF</div>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.55, margin: '0 0 14px' }}>
          Everything is <b style={{ color:'#fff' }}>38% off</b> to celebrate her birthday. Spend $300 and pick a{' '}
          <b style={{ color:'#fff' }}>FREE RETA or TIRZ 30mg</b> — and you're automatically entered to win a{' '}
          <b style={{ color:'#fff' }}>1-of-1 Iron Within challenge coin</b> or one of <b style={{ color:'#fff' }}>three $300 prizes.</b>
        </p>
        <Link href="/shop" onClick={close} style={{ display: 'block', width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(90deg,#a855f7,#7c3aed,#c026d3)', color: '#fff', fontWeight: 800, fontSize: '1rem', textDecoration: 'none' }}>
          Shop the Birthday Bash 👑
        </Link>
        <div style={{ marginTop: 12, fontSize: '0.72rem', color: 'rgba(233,213,255,0.65)' }}>Ends Sunday, Aug 2 at midnight</div>
      </div>
    </div>
  );
}

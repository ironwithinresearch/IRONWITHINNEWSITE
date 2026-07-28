'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Homepage hero banner for the Queen's Birthday Bash. Renders only during the window
// (client-side, so the server render stays safe / no hydration mismatch).
const QB_START = Date.parse('2026-07-29T23:00:00Z');
const QB_END   = Date.parse('2026-08-03T05:00:00Z');

export default function QueenBirthdayBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const now = Date.now();
    if (now >= QB_START && now < QB_END) setShow(true);
  }, []);
  if (!show) return null;

  return (
    <section style={{ padding: '22px 24px 0' }}>
      <div className="container" style={{ maxWidth: 1060 }}>
        <div style={{
          position: 'relative', overflow: 'hidden', textAlign: 'center',
          background: 'radial-gradient(ellipse at 22% 12%, rgba(34,197,94,0.24), transparent 58%), radial-gradient(ellipse at 82% 92%, rgba(124,58,237,0.34), transparent 58%), #090610',
          border: '1px solid rgba(74,222,128,0.4)', borderRadius: '24px', padding: '34px 28px',
          boxShadow: '0 0 0 1px rgba(34,197,94,0.28), 0 24px 70px rgba(0,0,0,0.55)',
        }}>
          <div style={{ fontSize: '2.6rem', lineHeight: 1, filter: 'drop-shadow(0 0 16px rgba(34,197,94,0.6))' }}>🐉</div>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86efac', marginTop: 6 }}>
            Long Live the Queen
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: 'clamp(1.9rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', margin: '6px 0 6px', lineHeight: 1.05 }}>
            The Birthday Bash —{' '}
            <span style={{ background: 'linear-gradient(90deg,#4ade80,#c084fc,#4ade80)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>38% OFF Everything</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.55, maxWidth: 680, margin: '0 auto 8px' }}>
            Spend $300 and pick a <b style={{ color:'#fff' }}>FREE RETA or TIRZ 30mg</b> — plus every qualifying order is entered to win a{' '}
            <b style={{ color:'#fff' }}>1-of-1 Iron Within challenge coin</b> or one of <b style={{ color:'#fff' }}>three $300 prizes.</b>
          </p>
          <Link href="/shop" style={{ display: 'inline-block', marginTop: 12, padding: '14px 40px', borderRadius: 12, background: 'linear-gradient(90deg,#7c3aed,#22c55e,#4ade80)', color: '#04121a', fontWeight: 800, fontSize: '1.02rem', textDecoration: 'none' }}>
            Shop the Bash →
          </Link>
          <div style={{ marginTop: 12, fontSize: '0.76rem', color: 'rgba(134,239,172,0.75)' }}>No code needed · ends Sunday, Aug 2 at midnight CT</div>
        </div>
      </div>
    </section>
  );
}

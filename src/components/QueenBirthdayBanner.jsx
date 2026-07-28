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
          background: 'radial-gradient(ellipse at 25% 15%, rgba(168,85,247,0.30), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(192,38,211,0.28), transparent 55%), #140826',
          border: '1px solid rgba(216,180,254,0.45)', borderRadius: '24px', padding: '34px 28px',
          boxShadow: '0 0 0 1px rgba(124,58,237,0.35), 0 24px 70px rgba(0,0,0,0.45)',
        }}>
          <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>👑</div>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e9d5ff', marginTop: 6 }}>
            Happy Birthday to our Queen
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: 'clamp(1.9rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', margin: '6px 0 6px', lineHeight: 1.05 }}>
            The Birthday Bash —{' '}
            <span style={{ background: 'linear-gradient(90deg,#c084fc,#f5c542,#e879f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>38% OFF Everything</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.55, maxWidth: 680, margin: '0 auto 8px' }}>
            Spend $300 and pick a <b style={{ color:'#fff' }}>FREE RETA or TIRZ 30mg</b> — plus every qualifying order is entered to win a{' '}
            <b style={{ color:'#fff' }}>1-of-1 Iron Within challenge coin</b> or one of <b style={{ color:'#fff' }}>three $300 prizes.</b>
          </p>
          <Link href="/shop" style={{ display: 'inline-block', marginTop: 12, padding: '14px 40px', borderRadius: 12, background: 'linear-gradient(90deg,#a855f7,#7c3aed,#c026d3)', color: '#fff', fontWeight: 800, fontSize: '1.02rem', textDecoration: 'none' }}>
            Shop the Bash →
          </Link>
          <div style={{ marginTop: 12, fontSize: '0.76rem', color: 'rgba(233,213,255,0.7)' }}>No code needed · ends Sunday, Aug 2 at midnight CT</div>
        </div>
      </div>
    </section>
  );
}

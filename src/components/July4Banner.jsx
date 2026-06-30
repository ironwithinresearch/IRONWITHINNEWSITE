'use client';

// Date-gated homepage hero banner for the 4th of July / USA 250th sale.
// Renders only during the sale window (client-side, so server render stays safe).

import { useState, useEffect } from 'react';
import Link from 'next/link';

const J4_START = Date.parse('2026-06-30T00:00:00Z');
const J4_END   = Date.parse('2026-07-06T04:00:00Z');

export default function July4Banner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const now = Date.now();
    if (now >= J4_START && now <= J4_END) setShow(true);
  }, []);
  if (!show) return null;

  return (
    <section style={{ padding: '20px 24px 0' }}>
      <div className="container" style={{ maxWidth: 1040 }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at 30% 20%, rgba(178,34,52,0.22), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(19,41,75,0.4), transparent 55%), #0a0e17',
          border: '1px solid rgba(178,34,52,0.4)', borderRadius: '22px', padding: '24px 28px',
          boxShadow: '0 0 0 1px rgba(19,41,75,0.4), 0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <Link href="/shop" style={{ flex: '0 0 auto', display: 'block', lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/july4-2026.jpg" alt="4th of July Sale poster"
              style={{ width: '230px', maxWidth: '60vw', borderRadius: '12px', display: 'block', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
          </Link>
          <div style={{ flex: '1 1 320px', minWidth: 260, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', background: 'linear-gradient(90deg,#b22234,#13294b)', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: '14px' }}>🇺🇸 USA 250th · June 30 – July 5</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 900, color: '#fff', margin: '0 0 6px', lineHeight: 1.05 }}>
              4th of July <span style={{ background: 'linear-gradient(90deg,#ff5a6e,#7aa2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sale</span>
            </h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '0.02em' }}>25% OFF SITEWIDE</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 8px' }}>
              No code needed · stack your creator code for even more.
            </p>
            <p style={{ color: '#fbbf24', fontSize: '0.88rem', fontWeight: 700, margin: '0 0 18px' }}>🎁 FREE MOTS-C 10mg on every order over $250</p>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 40px', background: 'linear-gradient(90deg,#b22234,#13294b)', borderRadius: '12px', color: '#fff', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none', boxShadow: '0 0 28px rgba(178,34,52,0.45)' }}>
              Shop the Sale →
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.74rem', margin: '14px 0 0' }}>Ends Saturday, July 5 · midnight ET</p>
          </div>
        </div>
      </div>
    </section>
  );
}

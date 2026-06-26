'use client';

// Lacey's Birthday Bash homepage banner — shows the promo graphic linking to the
// shop, only during the sale window (Fri Jun 26 7PM CT → Sun Jun 28 7PM CT).

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const BB_START = Date.parse('2026-06-27T00:00:00Z');
const BB_END   = Date.parse('2026-06-29T00:00:00Z');

export default function BirthdayBashBanner() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const check = () => { const n = Date.now(); setActive(n >= BB_START && n < BB_END); };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  if (!active) return null;

  return (
    <section style={{ padding: '44px 24px 8px' }}>
      <div className="container" style={{ maxWidth: 680 }}>
        <Link href="/shop" aria-label="Shop Lacey's Birthday Bash — 15% off sitewide"
          style={{ display: 'block', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(236,72,153,0.4)', boxShadow: '0 0 44px rgba(236,72,153,0.28)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lacey-birthday-bash.jpg" alt="Lacey's Birthday Bash — 15% off sitewide, no code needed, plus a chance to win a $250 gift card"
            style={{ width: '100%', display: 'block' }} />
        </Link>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/shop"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '15px 38px', background: 'linear-gradient(90deg,#ec4899,#f5d272)', borderRadius: '12px', color: '#0a0a0a', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none', boxShadow: '0 0 30px rgba(236,72,153,0.4)' }}>
            Shop the Birthday Bash — 15% Off <ArrowRight size={17} />
          </Link>
          <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Auto-applied at checkout — no code needed. Every order of $100+ is entered to win a $250 gift card.
          </p>
        </div>
      </div>
    </section>
  );
}

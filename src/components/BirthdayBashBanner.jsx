'use client';

// Kelly's Birthday Bash homepage banner (Wed 4 Nov -> Fri 6 Nov 2026, CT). VIP gold + electric
// blue on black, the Founding Five look. Window and numbers come from lib/kellyBday.js, which
// mirrors the backend (slot 28 in iw-freaky-fridays.php, iw-p2p-gift.php). Renders nothing
// outside the window. Lacey's June version is in git history.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { kbLive, KB_END, KB_PCT, KB_GIFT_MIN, KB_GOLD, KB_GOLD_DEEP, KB_BLUE } from '@/lib/kellyBday';

function left(ms) {
  if (ms <= 0) return '';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  return d > 0 ? `${d}d ${h}h ${String(m).padStart(2, '0')}m` : `${h}h ${String(m).padStart(2, '0')}m`;
}

export default function BirthdayBashBanner() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  if (!now || !kbLive(now)) return null;

  return (
    <section style={{ padding: '40px 20px 8px' }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 20, textAlign: 'center',
          padding: '38px 24px 32px',
          background: 'radial-gradient(120% 90% at 50% 0%, #0f2347 0%, #070b14 55%, #030407 100%)',
          border: `1px solid ${KB_GOLD}80`,
          boxShadow: `0 0 0 1px rgba(47,140,255,0.18) inset, 0 20px 60px -20px rgba(47,140,255,0.35)`,
        }}>
          <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${KB_GOLD}, ${KB_BLUE}, ${KB_GOLD}, transparent)` }} />
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: KB_BLUE, marginBottom: 10 }}>
            Iron Within VIP · Founding Five
          </div>
          <h2 style={{
            fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, margin: '0 0 6px',
            fontSize: 'clamp(1.9rem, 5vw, 2.9rem)', lineHeight: 1.08,
            background: `linear-gradient(180deg, #fbeaa8 0%, ${KB_GOLD} 45%, ${KB_GOLD_DEEP} 100%)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>
            Kelly&rsquo;s Birthday Bash
          </h2>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.25rem, 3.2vw, 1.7rem)', margin: '14px 0 6px' }}>
            Up to {KB_PCT}% off <span style={{ color: KB_BLUE }}>·</span> creator codes stack
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.55, maxWidth: 560, margin: '0 auto' }}>
            Orders of <strong style={{ color: KB_GOLD }}>${KB_GIFT_MIN}+</strong> get a free <strong style={{ color: '#fff' }}>RT-3 or TRZ-2 10mg</strong> while supplies last. Pick yours at checkout.
          </div>
          <Link href="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 22, padding: '14px 34px',
            borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: '1.02rem', color: '#0a0a0a',
            background: `linear-gradient(90deg, ${KB_GOLD_DEEP}, ${KB_GOLD}, #fbeaa8)`,
            boxShadow: `0 0 26px rgba(232,199,102,0.35)`,
          }}>
            Shop the Birthday Bash <ArrowRight size={17} />
          </Link>
          <div style={{ marginTop: 14, fontSize: '0.86rem', color: 'rgba(255,255,255,0.65)' }}>
            Ends Friday 11:59pm CT{left(KB_END - now) ? ` · ${left(KB_END - now)} left` : ''}
          </div>
          <div style={{ marginTop: 14, fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>
            No code needed. The $175 is measured after discounts. Aminos, merch, bundles, gift cards and a few low-stock items are not on sale. Limit 15 items per order and 5 RT-3 and TRZ-2 combined. If your free-vial pick sells out, we send the other one.
            <br />For research use only. Not for human or veterinary use.
          </div>
        </div>
      </div>
    </section>
  );
}

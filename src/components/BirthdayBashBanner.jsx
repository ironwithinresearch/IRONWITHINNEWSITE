'use client';

// NewMe's Birthday Bash homepage banner (Thu 19 Nov 8am -> Sat 21 Nov 8am CT, 2026). VIP gold +
// electric blue on black, the Founding Five look. Window and numbers come from lib/newmeBday.js,
// which mirrors the backend (iw-freaky-fridays.php, iw-p2p-gift.php). Renders nothing outside
// the window, and nothing on the server (it waits for the client clock). Kelly's (4-6 Nov) and
// Lacey's (June) versions are in git history.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { nbLive, NB_PCT, NB_GIFT_MIN, NB_EXTRA_MIN, NB_ENDS_LABEL, NB_GOLD as KB_GOLD, NB_GOLD_DEEP as KB_GOLD_DEEP, NB_BLUE as KB_BLUE } from '@/lib/newmeBday';

export default function BirthdayBashBanner() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  if (!now || !nbLive(now)) return null;

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
            NewMe&rsquo;s Birthday Bash
          </h2>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.25rem, 3.2vw, 1.7rem)', margin: '14px 0 6px' }}>
            {NB_PCT}% off almost everything <span style={{ color: KB_BLUE }}>·</span> creator codes stack
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.55, maxWidth: 560, margin: '0 auto' }}>
            Orders of <strong style={{ color: KB_GOLD }}>${NB_GIFT_MIN}+</strong> get a free <strong style={{ color: '#fff' }}>RT-3 or TRZ-2 10mg</strong> while supplies last. Pick yours at checkout.
            <br />Plus a free <strong style={{ color: '#fff' }}>KPV 10mg and Pink Glutathione</strong> on orders <strong style={{ color: KB_GOLD }}>${NB_EXTRA_MIN}+</strong>, added automatically.
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
            Ends {NB_ENDS_LABEL}
          </div>
          <div style={{ marginTop: 14, fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>
            No code needed. The ${NB_GIFT_MIN} and ${NB_EXTRA_MIN} are measured after discounts. Aminos, merch, bundles, gift cards, capsules and a few low-stock items are not on sale. Free items while supplies last; if your free-vial pick sells out, we send the other one.
            <br />For research use only. Not for human or veterinary use.
          </div>
        </div>
      </div>
    </section>
  );
}

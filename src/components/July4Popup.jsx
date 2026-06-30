'use client';

// First-visit popup for the 4th of July / USA 250th sale. Shows the promo poster
// during the sale window only, once per visitor (dismissal remembered in localStorage).

import { useState, useEffect } from 'react';
import Link from 'next/link';

const KEY = 'iw_july4_2026';
const J4_START = Date.parse('2026-06-30T00:00:00Z');
const J4_END   = Date.parse('2026-07-06T04:00:00Z');

export default function July4Popup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (now < J4_START || now >= J4_END) return; // only during the sale
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (saved) return; // already seen/dismissed this sale
    const timer = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem(KEY, String(Date.now())); } catch { /* ignore */ }
  };

  if (!open) return null;

  return (
    <div onClick={dismiss}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(2,5,10,0.82)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 400, background: 'var(--card-dark)', border: '1px solid rgba(178,34,52,0.5)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 70px rgba(0,0,0,0.7)' }}>
        <button onClick={dismiss} aria-label="Close"
          style={{ position: 'absolute', top: 10, right: 12, zIndex: 2, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 22, lineHeight: 1, width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}>×</button>
        <Link href="/shop" onClick={dismiss} style={{ display: 'block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/july4-2026.jpg" alt="4th of July Sale — 25% off sitewide, no code needed, plus a free MOTS-C 10mg on orders $250+"
            style={{ width: '100%', display: 'block' }} />
        </Link>
        <div style={{ padding: '16px 20px 20px', textAlign: 'center' }}>
          <Link href="/shop" onClick={dismiss}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box', padding: '14px', background: 'linear-gradient(90deg,#b22234,#13294b)', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '1rem', textDecoration: 'none' }}>
            Shop 25% Off — No Code Needed →
          </Link>
          <button onClick={dismiss} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>No thanks</button>
        </div>
      </div>
    </div>
  );
}

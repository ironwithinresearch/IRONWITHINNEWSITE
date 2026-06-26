'use client';

// First-visit popup for Lacey's Birthday Bash. Shows the promo graphic during the
// sale window only, once per visitor (dismissal remembered in localStorage).

import { useState, useEffect } from 'react';
import Link from 'next/link';

const KEY = 'iw_bday_bash';
const BB_START = Date.parse('2026-06-27T00:00:00Z');
const BB_END   = Date.parse('2026-06-29T00:00:00Z');

export default function BirthdayBashPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (now < BB_START || now >= BB_END) return; // only during the sale
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
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(2,5,10,0.78)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 440, background: 'var(--card-dark)', border: '1px solid rgba(236,72,153,0.45)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        <button onClick={dismiss} aria-label="Close"
          style={{ position: 'absolute', top: 10, right: 12, zIndex: 2, background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', fontSize: 22, lineHeight: 1, width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}>×</button>
        <Link href="/shop" onClick={dismiss} style={{ display: 'block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lacey-birthday-bash.jpg" alt="Lacey's Birthday Bash — 15% off sitewide, no code needed, plus a chance to win a $250 gift card"
            style={{ width: '100%', display: 'block' }} />
        </Link>
        <div style={{ padding: '18px 20px 22px', textAlign: 'center' }}>
          <Link href="/shop" onClick={dismiss}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box', padding: '14px', background: 'linear-gradient(90deg,#ec4899,#f5d272)', borderRadius: 10, color: '#0a0a0a', fontWeight: 800, fontSize: '1rem', textDecoration: 'none' }}>
            Shop 15% Off — No Code Needed
          </Link>
          <button onClick={dismiss} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>No thanks</button>
        </div>
      </div>
    </div>
  );
}

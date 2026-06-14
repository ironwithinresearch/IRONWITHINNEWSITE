'use client';

/* Site-wide announcement strip, fixed above the navbar.
   Height is 36px; the navbar (top: 36) and main padding are offset to match. */

import { Truck, Tag } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Store announcements"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 36, zIndex: 101,
        background: 'var(--gradient-primary, linear-gradient(90deg,#00CFFF,#7c3aed))',
        color: '#001018',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 18, padding: '0 12px',
        fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.01em',
        whiteSpace: 'nowrap', overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Truck size={14} /> Free Shipping on Orders Over $225
      </span>
      <span aria-hidden style={{ opacity: 0.5 }}>|</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Tag size={14} /> Father&apos;s Day Sale — Use Code{' '}
        <strong style={{ fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 2 }}>DAD15</strong>
      </span>
    </div>
  );
}

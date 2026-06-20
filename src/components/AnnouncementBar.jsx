'use client';

import { useState, useEffect } from 'react';

/* Scrolling announcement ticker, fixed above the navbar (height 36px).
   The navbar (top: 36) and main padding are offset to match. */

// Father's Day sale ends 11:59pm Central, Sun 6/21/2026 == 04:59:59 UTC Mon 6/22.
// The sale message auto-disappears after this; product prices revert via the
// WooCommerce sale schedule (date_on_sale_to) at the same moment.
const SALE_ENDS = Date.parse('2026-06-22T04:59:59Z');
const SALE_MESSAGE = "🏷️  Father's Day Sale — 15% off everything, no code needed — use your favorite affiliate code for an additional discount";

// July 4th: free MOTS-C 10mg on orders $250+. Window Jul 3 00:00 → Jul 5 11:59pm
// Central (== 05:00 UTC Jul 3 → 04:59:59 UTC Jul 6), matching the backend promo.
const J4_START = Date.parse('2026-07-03T05:00:00Z');
const J4_END = Date.parse('2026-07-06T04:59:59Z');
const J4_MESSAGE = '🇺🇸  4th of July — get a FREE MOTS-C 10mg on every order over $250';

const BASE_MESSAGES = [
  '🔬  Certificate of Analysis available for every product',
  '🧪  Research-grade peptides, independently lab-tested',
  '📱  New — the free Peptide Paradigm reference guide. Look up any compound.',
];

export default function AnnouncementBar() {
  // Start with the Father's Day message (matches the server render while it's on),
  // then recompute on the client by date — no hydration mismatch.
  const [messages, setMessages] = useState([SALE_MESSAGE, ...BASE_MESSAGES]);
  useEffect(() => {
    const now = Date.now();
    const promos = [];
    if (now < SALE_ENDS) promos.push(SALE_MESSAGE);
    if (now >= J4_START && now <= J4_END) promos.push(J4_MESSAGE);
    setMessages([...promos, ...BASE_MESSAGES]);
  }, []);

  // Repeat the message set so the track is wide enough, then render it twice
  // for a seamless -50% loop.
  const base = [...messages, ...messages, ...messages];
  const track = [...base, ...base];

  return (
    <div
      role="region"
      aria-label="Store announcements"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 36, zIndex: 101,
        background: 'var(--gradient-primary, linear-gradient(90deg,#00CFFF,#7c3aed))',
        color: '#001018', overflow: 'hidden', display: 'flex', alignItems: 'center',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        className="iw-ticker"
        style={{ display: 'flex', flexShrink: 0, whiteSpace: 'nowrap', willChange: 'transform' }}
      >
        {track.map((msg, i) => (
          <span
            key={i}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0 34px', fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.01em' }}
          >
            {msg}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes iw-ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .iw-ticker { animation: iw-ticker-scroll 40s linear infinite; }
        .iw-ticker:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .iw-ticker { animation: none; } }
      `}</style>
    </div>
  );
}

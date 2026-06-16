'use client';

import { useState, useEffect } from 'react';

/* Scrolling announcement ticker, fixed above the navbar (height 36px).
   The navbar (top: 36) and main padding are offset to match. */

// Father's Day sale ends 11:59pm Central, Sun 6/21/2026 == 04:59:59 UTC Mon 6/22.
// The sale message auto-disappears after this; product prices revert via the
// WooCommerce sale schedule (date_on_sale_to) at the same moment.
const SALE_ENDS = Date.parse('2026-06-22T04:59:59Z');
const SALE_MESSAGE = "🏷️  Father's Day Sale — 15% off everything, no code needed";
const BASE_MESSAGES = [
  '🔬  Certificate of Analysis available for every product',
  '🧪  Research-grade peptides, independently lab-tested',
];

export default function AnnouncementBar() {
  // Start with the sale message (matches the server render while the sale is on),
  // then drop it on the client once the sale has ended — no hydration mismatch.
  const [messages, setMessages] = useState([SALE_MESSAGE, ...BASE_MESSAGES]);
  useEffect(() => {
    if (Date.now() >= SALE_ENDS) setMessages(BASE_MESSAGES);
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

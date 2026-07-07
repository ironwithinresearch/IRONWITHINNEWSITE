'use client';

import { useState, useEffect } from 'react';

/* Scrolling announcement ticker, fixed above the navbar (height 36px).
   The navbar (top: 36) and main padding are offset to match. */

// Father's Day sale ends 11:59pm Central, Sun 6/21/2026 == 04:59:59 UTC Mon 6/22.
// The sale message auto-disappears after this; product prices revert via the
// WooCommerce sale schedule (date_on_sale_to) at the same moment.
const SALE_ENDS = Date.parse('2026-06-22T04:59:59Z');
const SALE_MESSAGE = "⏰  FINAL HOURS — Father's Day Sale ends at midnight tonight · 15% off everything, no code needed · stack your affiliate code for even more";

// Lacey's Birthday Bash — Fri Jun 26 7PM CT → Sun Jun 28 7PM CT (CDT = UTC-5,
// so 7PM CDT = 00:00 UTC next day). 15% off sitewide, no code, stacks with codes.
const BB_START = Date.parse('2026-06-27T00:00:00Z');
const BB_END = Date.parse('2026-06-29T00:00:00Z');
const BB_MESSAGE = "🎂  LACEY'S BIRTHDAY BASH — 15% OFF SITEWIDE, no code needed · stack your affiliate code for even more · 🎁 every $100+ order = a shot at a $250 gift card · ends Sunday 7PM";

// USA 250th / 4th of July Sale — 25% OFF SITEWIDE + free MOTS-C 10mg on $250+.
// Live now (launched early) → Sat Jul 5 midnight ET (== 04:00 UTC Jul 6).
const J4_START = Date.parse('2026-06-30T00:00:00Z');
const J4_END = Date.parse('2026-07-06T04:00:00Z');
const J4_MESSAGE = '🇺🇸  4TH OF JULY SALE — 25% OFF SITEWIDE, no code needed · stack your creator code for even more · 🎁  FREE MOTS-C 10mg on orders $250+ · ends Sat Jul 5, midnight ET';

// 12 Days of Christmas in July — Jul 14–25 CT (CDT = UTC-5, midnight CT = 05:00 UTC).
const XJ_START = Date.parse('2026-07-14T05:00:00Z');
const XJ_END = Date.parse('2026-07-26T05:00:00Z');
function xjDayNum() {
  const ctToday = new Date(Date.now() - 5 * 3600000);
  ctToday.setUTCHours(0, 0, 0, 0);
  const d = Math.round((ctToday.getTime() - Date.parse('2026-07-14T00:00:00Z')) / 86400000) + 1;
  return Math.min(12, Math.max(1, d));
}
const XJ_MESSAGE = (n) => `🎄  12 DAYS OF CHRISTMAS IN JULY — Day ${n} of 12 is LIVE · scratch today's card to reveal the deal 🎟️ · shop all 12 days → win 1 of 5 $1,000 credits`;

const BASE_MESSAGES = [
  '🔬  Certificate of Analysis available for every product',
  '🧪  Research-grade peptides, independently lab-tested',
  '📱  New — the free Peptide Paradigm reference guide. Look up any compound.',
];

export default function AnnouncementBar() {
  // Start with base messages (no promo) so the server render is safe, then
  // recompute promos on the client by date — no hydration mismatch.
  const [messages, setMessages] = useState(BASE_MESSAGES);
  const [bbActive, setBbActive] = useState(false);
  const [j4Active, setJ4Active] = useState(false);
  const [xjActive, setXjActive] = useState(false);
  useEffect(() => {
    const now = Date.now();
    const promos = [];
    if (now >= XJ_START && now < XJ_END) { promos.push(XJ_MESSAGE(xjDayNum())); setXjActive(true); }
    if (now >= J4_START && now <= J4_END) { promos.push(J4_MESSAGE); setJ4Active(true); }
    if (now >= BB_START && now < BB_END) { promos.push(BB_MESSAGE); setBbActive(true); }
    if (now < SALE_ENDS) promos.push(SALE_MESSAGE);
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
        background: xjActive ? 'linear-gradient(90deg,#c8102e,#0f5132,#f5c542,#0f5132,#c8102e)' : j4Active ? 'linear-gradient(90deg,#b22234,#7a1228,#13294b,#7a1228,#b22234)' : bbActive ? 'linear-gradient(90deg,#ec4899,#f5d272)' : 'var(--gradient-primary, linear-gradient(90deg,#00CFFF,#7c3aed))',
        color: (j4Active || xjActive) ? '#fff' : '#001018', overflow: 'hidden', display: 'flex', alignItems: 'center',
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
        .iw-ticker { animation: iw-ticker-scroll 56s linear infinite; }
        .iw-ticker:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .iw-ticker { animation: none; } }
      `}</style>
    </div>
  );
}

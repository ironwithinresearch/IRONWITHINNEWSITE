'use client';

/* Scrolling announcement ticker, fixed above the navbar (height 36px).
   The navbar (top: 36) and main padding are offset to match. */

const MESSAGES = [
  "🏷️  Father's Day Sale — use code DAD15 for 15% off",
  '🔬  Certificate of Analysis available for every product',
  '🧪  Research-grade peptides, independently lab-tested',
];

export default function AnnouncementBar() {
  // Repeat the message set so the track is wide enough, then render it twice
  // for a seamless -50% loop.
  const base = [...MESSAGES, ...MESSAGES, ...MESSAGES];
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
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0 34px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.01em' }}
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

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { shipDaysLive, SHIPDAYS_LABEL, SHIPDAYS_UNTIL } from '@/lib/shipDays';
import { annPromoLive } from '@/lib/anniversary';

/* One calm, static announcement line, fixed above the navbar (height 36px — the navbar
   sits at top: 36 and main is padded to match).

   Operator, 17 Oct 2026: the old scrolling ticker (emoji, all caps, five promos at once)
   made the store look like a deal site. Now exactly ONE line shows, in priority order:
     1. anything that changes what every buyer gets (the reduced shipping schedule)
     2. the current promotion — pointing at /deals, where every offer lives
     3. the default trust line
   The pre-17-Oct ticker (every past promo) is in git history if it's ever needed. */

const DEFAULT_LINE = {
  text: 'Every lot is third-party tested, with a Certificate of Analysis for each batch.',
  cta: 'Look up a lot',
  href: '/lab-reports',
};

function currentLine(now) {
  if (shipDaysLive(now)) {
    return { text: `Shipping update: through ${SHIPDAYS_UNTIL}, orders ship ${SHIPDAYS_LABEL} only.`, cta: 'Details', href: '/shipping' };
  }
  if (annPromoLive(now)) {
    return { text: 'Anniversary Month: a new offer every day through October 31.', cta: 'See current deals', href: '/deals' };
  }
  return DEFAULT_LINE;
}

export default function AnnouncementBar() {
  // Server render uses the default line; the client swaps in the date-based one after
  // mount, so the two renders never disagree (no hydration mismatch).
  const [line, setLine] = useState(DEFAULT_LINE);
  useEffect(() => { setLine(currentLine(Date.now())); }, []);

  return (
    <div
      role="region"
      aria-label="Store announcement"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 36, zIndex: 101,
        background: '#1c1917', color: '#f5f5f4', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px',
        fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.01em',
      }}
    >
      <Link href={line.href} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.text}</span>
        <span className="iw-ann-cta" style={{ whiteSpace: 'nowrap', textDecoration: 'underline', textUnderlineOffset: 3, opacity: 0.85 }}>{line.cta}</span>
      </Link>
      <style>{`@media (max-width: 560px) { .iw-ann-cta { display: none; } }`}</style>
    </div>
  );
}

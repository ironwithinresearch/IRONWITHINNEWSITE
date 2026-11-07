'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { shipDaysLive, SHIPDAYS_LABEL, SHIPDAYS_UNTIL } from '@/lib/shipDays';
import { annPromoLive } from '@/lib/anniversary';
import { kbLive, KB_PCT, KB_APP_PCT, KB_GIFT_MIN } from '@/lib/kellyBday';
import { bfLive, bfgOpen, bfWeekLive } from '@/lib/blackFriday';

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
    return { text: `Shipping update: through ${SHIPDAYS_UNTIL}, orders ship ${SHIPDAYS_LABEL} only.`, short: `Through ${SHIPDAYS_UNTIL} we ship Mon, Wed & Thu`, cta: 'Details', href: '/shipping' };
  }
  if (bfLive(now)) {
    return { text: 'Black Friday sale day: buy 1, get 2 free on RT-3 20mg, RT-3 30mg and TRZ-2 30mg, plus 35% off most other items. Limit 2 deals per item per order. Creator codes stack. Ends 11:59 p.m. CT.', short: 'Sale day: buy 1, get 2 free on select RT-3 and TRZ-2', cta: 'See the deals', href: '/deals' };
  }
  if (bfWeekLive(now)) {
    return { text: 'Black Friday sale: 35% off most items through November 27, no code needed, and creator codes stack. Saturdays add buy 1, get 2 free on select RT-3 and TRZ-2.', short: '35% off most items through Nov 27', cta: 'Shop the sale', href: '/shop' };
  }
  if (bfgOpen(now)) {
    return { text: 'Black Friday Giveaway: one winner gets up to $3,000 in store credit. No purchase necessary.', short: 'Giveaway: up to $3,000 in store credit', cta: 'Enter or read the rules', href: '/giveaway' };
  }
  if (kbLive(now)) {
    return { text: `Kelly's Birthday Bash: ${KB_PCT}% off most items, up to ${KB_APP_PCT}% off with Venmo, Cash App, Zelle or crypto. Creator codes stack, plus a free RT-3 or TRZ-2 10mg on orders $${KB_GIFT_MIN}+ while supplies last. Ends tonight.`, short: `${KB_PCT}% off, up to ${KB_APP_PCT}% with Venmo, Cash App, Zelle or crypto`, cta: 'Shop now', href: '/shop', vip: true };
  }
  if (annPromoLive(now)) {
    return { text: 'Anniversary Month: a new offer every day through October 31.', short: 'Anniversary Month: a deal every day', cta: 'See current deals', href: '/deals' };
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
        background: line.vip ? 'linear-gradient(90deg,#05070d,#0b1a33 50%,#05070d)' : '#1c1917', color: line.vip ? '#f3e2a4' : '#f5f5f4', borderBottom: line.vip ? '1px solid rgba(232,199,102,0.45)' : '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px',
        fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.01em',
      }}
    >
      <Link href={line.href} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span className="iw-ann-long" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.text}</span>
        <span className="iw-ann-short" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.short || line.text}</span>
        <span className="iw-ann-cta" style={{ whiteSpace: 'nowrap', textDecoration: 'underline', textUnderlineOffset: 3, opacity: 0.85 }}>{line.cta}</span>
      </Link>
      <style>{`@media (max-width: 560px) { .iw-ann-cta, .iw-ann-long { display: none; } } @media (min-width: 561px) { .iw-ann-short { display: none; } }`}</style>
    </div>
  );
}

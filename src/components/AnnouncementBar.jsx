'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { shipDaysLive, SHIPDAYS_LABEL, SHIPDAYS_UNTIL } from '@/lib/shipDays';
import { shipPauseLive, PAUSE_MESSAGE, PAUSE_MID, PAUSE_SHORT } from '@/lib/shipPause';
import { annPromoLive } from '@/lib/anniversary';
import { nbLive, NB_PCT, NB_GIFT_MIN, NB_EXTRA_MIN } from '@/lib/newmeBday';
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

// Lines that must show IN ADDITION to the current promo (operational notices that change
// what every buyer gets). When one is live the bar alternates: notice first, then promo.
function noticeLine(now) {
  if (shipPauseLive(now)) {
    return { text: PAUSE_MESSAGE, mid: PAUSE_MID, short: PAUSE_SHORT, cta: 'Details', href: '/shipping', notice: true };
  }
  return null;
}

function currentLine(now) {
  if (shipDaysLive(now)) {
    return { text: `Shipping update: through ${SHIPDAYS_UNTIL}, orders ship ${SHIPDAYS_LABEL} only.`, short: `Through ${SHIPDAYS_UNTIL} we ship Mon, Wed & Thu`, cta: 'Details', href: '/shipping' };
  }
  // NewMe's Birthday Bash (Thu 19 Nov 8am -> Sat 21 Nov 8am CT) sits ABOVE the Black Friday
  // lines: its 40% supersedes the 35%, so no line may say 35% while it is live. That includes
  // Sale day 3 now starts at 8am Sat 21 Nov, when the Bash ends; this order is a belt-and-braces guard.
  if (nbLive(now)) {
    return { text: `NewMe's Birthday Bash: ${NB_PCT}% off almost everything, creator codes stack. Free RT-3 or TRZ-2 10mg on orders $${NB_GIFT_MIN}+, plus free KPV 10mg and Pink Glutathione at $${NB_EXTRA_MIN}+, while supplies last. Ends Saturday 8am CT.`, short: `Birthday Bash: ${NB_PCT}% off + free vial at $${NB_GIFT_MIN}`, cta: 'Shop now', href: '/shop', vip: true };
  }
  if (bfLive(now)) {
    return { text: 'Black Friday sale day: buy 1, get 2 free on RT-3 20mg, RT-3 30mg and TRZ-2 30mg, plus 35% off most other items. Limit 2 deals per item per order, Venmo, Zelle or crypto checkout only. Creator codes stack. Ends 11:59 p.m. CT.', short: 'Sale day: buy 1, get 2 free on select RT-3 and TRZ-2 (P2P only)', cta: 'See the deals', href: '/deals' };
  }
  if (bfWeekLive(now)) {
    return { text: 'Black Friday sale: 35% off most items through November 27, no code needed, and creator codes stack.', short: '35% off most items through Nov 27', cta: 'Shop the sale', href: '/shop' };
  }
  if (bfgOpen(now)) {
    return { text: 'Black Friday Giveaway: one winner gets up to $3,000 in store credit. No purchase necessary.', short: 'Giveaway: up to $3,000 in store credit', cta: 'Enter or read the rules', href: '/giveaway' };
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
  useEffect(() => {
    const now = Date.now();
    const notice = noticeLine(now);
    const promo = currentLine(now);
    const lines = notice ? (promo === DEFAULT_LINE ? [notice] : [notice, promo]) : [promo];
    setLine(lines[0]);
    if (lines.length < 2) return;
    // Two lines: swap every 7s (a plain swap, no motion). The notice always shows first.
    // Paused while hovered/focused so it can't move under a tap.
    let i = 0;
    let hold = false;
    const el = document.getElementById('iw-ann');
    const on = () => { hold = true; };
    const off = () => { hold = false; };
    el?.addEventListener('mouseenter', on); el?.addEventListener('mouseleave', off);
    el?.addEventListener('focusin', on); el?.addEventListener('focusout', off);
    const id = setInterval(() => { if (hold) return; i = (i + 1) % lines.length; setLine(lines[i]); }, 7000);
    return () => {
      clearInterval(id);
      el?.removeEventListener('mouseenter', on); el?.removeEventListener('mouseleave', off);
      el?.removeEventListener('focusin', on); el?.removeEventListener('focusout', off);
    };
  }, []);

  return (
    <div
      id="iw-ann"
      role="region"
      aria-label="Store announcement"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 36, zIndex: 101,
        background: line.notice ? '#78350f' : line.vip ? 'linear-gradient(90deg,#05070d,#0b1a33 50%,#05070d)' : '#1c1917', color: line.vip ? '#f3e2a4' : '#f5f5f4', borderBottom: line.vip ? '1px solid rgba(232,199,102,0.45)' : '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px',
        fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.01em',
      }}
    >
      <Link href={line.href} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span className="iw-ann-long" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.text}</span>
        <span className="iw-ann-mid" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.mid || line.text}</span>
        <span className="iw-ann-short" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.short || line.text}</span>
        <span className="iw-ann-cta" style={{ whiteSpace: 'nowrap', textDecoration: 'underline', textUnderlineOffset: 3, opacity: 0.85 }}>{line.cta}</span>
      </Link>
      <style dangerouslySetInnerHTML={{ __html: '@media (max-width: 560px) { .iw-ann-cta, .iw-ann-long, .iw-ann-mid { display: none; } } @media (min-width: 561px) and (max-width: 1239px) { .iw-ann-short, .iw-ann-long { display: none; } } @media (min-width: 1240px) { .iw-ann-short, .iw-ann-mid { display: none; } }' }} />
    </div>
  );
}

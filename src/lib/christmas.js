/* 25 Days of Christmas — Tue 1 Dec 12:00am CT -> Sat 26 Dec 12:00am CT (Brian approved 28 Nov 2026).
   One themed deal per day, midnight to midnight Central, plus one Golden Ticket drawn per day.

   The BACKEND is the only authority on price, themes and which products are in each day:
   iw-freaky-fridays.php slots 37-61 (IW_XMAS_RATES) + iw-xmas.php (calendar, Golden Tickets),
   both generated from ~/iw-xmas-2026/tools/plan.py. /api/christmas returns past + today's
   themes and today's on-sale product slugs; future themes are never sent, so nothing here can
   reveal a future door. Everything that reads xmasLive() renders nothing outside the window
   (components wait for a client clock), so pushing early is safe.
   Chicago is UTC-6 in December, so 12:00am CT = 06:00Z. */
import { BFG } from './blackFriday';

export const XMAS_START = Date.parse('2026-12-01T06:00:00Z');
export const XMAS_END = Date.parse('2026-12-26T06:00:00Z');
export const XMAS_DAYS = 25;

export const xmasLive = (now = Date.now()) => now >= XMAS_START && now < XMAS_END;
/** Day 1-25 by the client clock, or 0. The backend's own day number wins wherever it is loaded. */
export const xmasDayAt = (now = Date.now()) => (xmasLive(now) ? Math.floor((now - XMAS_START) / 86400000) + 1 : 0);
/** UTC start of Day d (all of December is CST, so days are exactly 24h). */
export const xmasDayStart = (d) => XMAS_START + (d - 1) * 86400000;
export const xmasDateLabel = (d, opts = { weekday: 'short', month: 'short', day: 'numeric' }) =>
  new Date(xmasDayStart(d) + 12 * 3600000).toLocaleDateString('en-US', { ...opts, timeZone: 'America/Chicago' });

/* Christmas delivery cutoff (UPS 2nd Day Air from Pensacola FL). Processing can take up to 3 business
   days, so an order placed by 2 p.m. CT Thu 17 Dec ships by Tue 22 Dec, which UPS 2nd Day Air schedules
   for Thu 24 Dec. 25 Dec is a carrier holiday (CARRIER_HOLIDAYS in shipping-cutoff.js). We never promise
   a date past this: after the cutoff the copy only says orders are expected to arrive after Christmas. */
export const XMAS_ORDER_BY = Date.parse('2026-12-17T20:00:00Z');   // Thu 17 Dec 2:00pm CST
export const XMAS_ORDER_BY_LABEL = '2 p.m. CT on Thursday, December 17';
export const xmasBeforeCutoff = (now = Date.now()) => now < XMAS_ORDER_BY;
export const xmasShipLine = (now = Date.now()) => (xmasBeforeCutoff(now)
  ? `Christmas delivery: choose Expedited shipping at checkout and place and pay for your order by ${XMAS_ORDER_BY_LABEL}. Those orders ship by Tuesday, December 22, by UPS 2nd Day Air, which UPS schedules for delivery by December 24. Standard shipping takes 2–7 business days after dispatch. Carrier delays can happen.`
  : 'Orders placed now are expected to arrive after Christmas.');
export const xmasShipShort = (now = Date.now()) => (xmasBeforeCutoff(now)
  ? 'For Christmas delivery, choose Expedited and order by 2 p.m. CT Dec 17'
  : 'Orders placed now are expected to arrive after Christmas');

/* Golden Tickets — mirrors iw-xmas.php, which implements the Official Rules at /golden-ticket/rules. */
export const GT = {
  tickets: 25,
  // [count, $ store credit]. To change a prize: edit here + IW_XMAS_POOL, then `wp iw-xmas prize-swap --from= --to=`.
  prizes: [[15, 25], [7, 50], [2, 100], [1, 400]],   // Brian 28 Nov: top prize $400 (pool $1,325)
  get total() { return this.prizes.reduce((t, [n, v]) => t + n * v, 0); },
  opensLabel: 'December 1, 2026 at 12:00 a.m. Central Time',
  closesLabel: 'December 25, 2026 at 11:59 p.m. Central Time',
  drawTime: 'shortly after midnight Central Time (normally by 1:00 a.m.) on the following day',
  claimDays: 14,
  redeemByLabel: 'January 31, 2027',   // gold-card codes stop working after 11:59 p.m. CT that day (IW_XMAS_REDEEM_BY)
  expiryDays: 30,
  sponsor: BFG.sponsor,
  sponsorAddress: BFG.sponsorAddress,
  sponsorEmail: BFG.sponsorEmail,
};
// Rules s.3 (Rhode Island included, Brian 28 Nov). Mirrors IW_XMAS_STATES in iw-xmas.php.
export const GT_ELIGIBLE = 'legal residents of the 50 United States and D.C., 21 or older';
export const GT_LABEL_LINE = 'As a festive marker, one vial label in a winning box is applied upside down; the product name, lot number, COA QR code and research-use statement stay fully readable.';
export const gtPrizeLine = GT.prizes.map(([n, v]) => `${n} × $${v}`).join(', ');

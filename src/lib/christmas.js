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

/* Christmas delivery cutoffs from Pensacola FL — CONSERVATIVE, dates we can meet (Brian 28 Nov: Expedited = UPS Next
   Day Air). Processing can take up to 72 hours (3 business days); UPS does not deliver Dec 25 (CARRIER_HOLIDAYS).
   - Expedited (UPS Next Day Air): placed + paid by 2 p.m. CT Fri 18 Dec -> processed by Wed 23 Dec (Mon/Tue/Wed)
     -> UPS schedules delivery Thu 24 Dec.
   - Standard: usually UPS 2nd Day Air, but the published transit is 2–7 business days, so: placed + paid by 2 p.m. CT
     Thu 10 Dec -> ships by Tue 15 Dec -> 7 business days = Thu 24 Dec.
   After a cutoff the copy only says orders may / are expected to arrive after Christmas. Never promise past these. */
export const XMAS_STD_BY = Date.parse('2026-12-10T20:00:00Z');   // Thu 10 Dec 2:00pm CST
export const XMAS_EXP_BY = Date.parse('2026-12-18T20:00:00Z');   // Fri 18 Dec 2:00pm CST
export const XMAS_ORDER_BY = XMAS_EXP_BY;                        // last moment ANY method can make it
export const xmasBeforeCutoff = (now = Date.now()) => now < XMAS_EXP_BY;
export const xmasShipLine = (now = Date.now()) => (now < XMAS_STD_BY
  ? 'Christmas delivery: place and pay for your order by 2 p.m. CT on Thursday, December 10 with Standard shipping, or by 2 p.m. CT on Friday, December 18 with Expedited (UPS Next Day Air). Processing can take up to 3 business days; orders placed by those times are expected to arrive by December 24. Carrier delays can happen.'
  : now < XMAS_EXP_BY
    ? 'Christmas delivery: choose Expedited (UPS Next Day Air) and place and pay for your order by 2 p.m. CT on Friday, December 18; it is expected to arrive by December 24. Standard orders placed now may arrive after Christmas. Carrier delays can happen.'
    : 'Orders placed now are expected to arrive after Christmas.');
export const xmasShipShort = (now = Date.now()) => (now < XMAS_STD_BY
  ? 'Christmas delivery: order by Dec 10 (Standard) or Dec 18 (Expedited), 2 p.m. CT'
  : now < XMAS_EXP_BY
    ? 'For Christmas delivery, choose Expedited and order by 2 p.m. CT Dec 18'
    : 'Orders placed now are expected to arrive after Christmas');

/* Golden Tickets — mirrors iw-xmas.php, which implements the Official Rules at /golden-ticket/rules. */
export const GT = {
  tickets: 25,
  // [count, $ store credit]. To change a prize: edit here AND IW_XMAS_POOL in iw-xmas.php (values are drawn from what is left).
  prizes: [[15, 25], [7, 50], [2, 100], [1, 400]],   // Brian 28 Nov: top prize $400 (pool $1,325)
  get total() { return this.prizes.reduce((t, [n, v]) => t + n * v, 0); },
  opensLabel: 'December 1, 2026 at 12:00 a.m. Central Time',
  closesLabel: 'December 25, 2026 at 11:59 p.m. Central Time',
  drawTime: 'shortly after midnight Central Time (usually between 12:10 a.m. and 12:30 a.m.) on the following day',
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

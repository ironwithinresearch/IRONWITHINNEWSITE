/* Black Friday Giveaway + sale days (Brian, 7 Nov 2026).

   Mirrors the backend, which is the authority on every price and every entry:
     - iw-bf-sale.php        buy 1, get 2 free on RT-3 20mg / RT-3 30mg / TRZ-2 30mg (iw_bf_days)
     - iw-freaky-fridays.php slots 29-31 + IW_BF_RATES (35% / 25% / shallower on everything else)
     - iw-bf-giveaway.php    entry period (IW_BFG_OPEN / IW_BFG_CLOSE), $450 purchase entry, free form
   Change a date here and there in the same change. After DST (1 Nov) Chicago is UTC-6.

   The rate list on /giveaway is NOT copied here: it is read live from /api/black-friday, so the
   page can never advertise a rate the engine does not charge. */

export const BF_DAYS = [
  { day: 1, start: Date.parse('2026-11-07T17:45:00Z'), end: Date.parse('2026-11-08T06:00:00Z'), label: 'Saturday, November 7', when: 'from 11:45 a.m. to 11:59 p.m. CT' },
  { day: 2, start: Date.parse('2026-11-14T06:00:00Z'), end: Date.parse('2026-11-15T06:00:00Z'), label: 'Saturday, November 14', when: 'all day, 12:00 a.m. to 11:59 p.m. CT' },
  { day: 3, start: Date.parse('2026-11-21T06:00:00Z'), end: Date.parse('2026-11-22T06:00:00Z'), label: 'Saturday, November 21', when: 'all day, 12:00 a.m. to 11:59 p.m. CT' },
];

export const bfDay = (now = Date.now()) => BF_DAYS.find((d) => now >= d.start && now < d.end) || null;
export const bfLive = (now = Date.now()) => !!bfDay(now);

/* 35% between sale days (Brian, 7 Nov): every day from Sun 8 Nov through Fri 27 Nov 11:59pm CT that is not a
   sale day. Mirrors slots 32-34 in iw-freaky-fridays.php (IW_BF_WEEK_RATES). */
export const BF_WEEK_START = Date.parse('2026-11-08T06:00:00Z');
export const BF_WEEK_END = Date.parse('2026-11-28T06:00:00Z');
export const bfWeekLive = (now = Date.now()) => !bfLive(now) && now >= BF_WEEK_START && now < BF_WEEK_END;
export const bfNext = (now = Date.now()) => BF_DAYS.find((d) => now < d.start) || null;

/* Buy 1, get 2 free: every 3 units of the SAME variation, 2 are free. Max 2 deals per variation. */
export const BF_B1G2 = {
  522: { slug: 'rt-3', name: 'RT-3 20mg' },
  523: { slug: 'rt-3', name: 'RT-3 30mg' },
  524: { slug: 'trz-2', name: 'TRZ-2 30mg' },
};
export const BF_B1G2_MAX_DEALS = 2;
export const isB1G2 = (variationId) => !!BF_B1G2[Number(variationId)];
export const B1G2_BY_SLUG = { 'rt-3': '20mg and 30mg', 'trz-2': '30mg' };

/* Giveaway (sweepstakes). Mirrors iw-bf-giveaway.php. */
export const BFG = {
  opensISO: '2026-11-07T18:30:00Z',
  closesISO: '2026-11-28T05:59:59Z',
  opensLabel: 'November 7, 2026 at 12:30 p.m. Central Time',
  closesLabel: 'November 27, 2026 at 11:59 p.m. Central Time',
  drawLabel: 'Tuesday, December 1, 2026',
  minSpend: 450,
  tierMin: 10,
  bigPrize: { total: 3000, months: 12, monthly: 250 },
  smallPrize: { total: 1200, months: 6, monthly: 200 },
  sponsor: 'Iron Within Nutrition LLC DBA Iron Within Research',
  sponsorAddress: '8180 Pensacola Blvd, Unit 205, Pensacola, FL 32534',
  sponsorEmail: 'support@ironwithin.io',
};

export const bfgOpen = (now = Date.now()) => now >= Date.parse(BFG.opensISO) && now <= Date.parse(BFG.closesISO);

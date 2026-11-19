/* NewMe's Birthday Bash — Thu 19 Nov 8:00am CT -> Sat 21 Nov 8:00am CT (Brian, 19 Nov 2026).
   NewMe = Christina Mulligan, Iron Within VIP · Founding Five.
   40% off almost everything (no code, creator codes stack), a free RT-3 or TRZ-2 10mg on orders
   $175+ after discounts, and KPV 10mg + Pink Glutathione added free on top at $225+.

   Mirrors the backend, which is the authority on price and on what is actually added:
     - the 40% in the sale engine (iw-freaky-fridays.php)
     - IW_GIFT_FROM / IW_GIFT_TO / IW_GIFT_MIN + extra_min / extra_items in iw-p2p-gift.php
       (GET /wp-json/iw/v1/p2p-gift). The checkout prefers those live fields; the constants
       below are only the fallback.
   Kept OUT of FF_WINDOWS on purpose, same as lib/kellyBday.js. Change a date here, in
   GIFT_FROM / GIFT_TO in lib/p2p.js and on the backend in the same change.
   Chicago is UTC-6 in November, so 8:00am CT = 14:00Z. Everything that reads nbLive() renders
   nothing outside the window (server render included: the components wait for a client clock). */

export const NB_START = Date.parse('2026-11-19T14:00:00Z');
export const NB_END = Date.parse('2026-11-21T14:00:00Z');
export const NB_PCT = 40;
export const NB_GIFT_MIN = 175;
export const NB_EXTRA_MIN = 225;
export const NB_EXTRA_ITEMS = ['KPV 10mg', 'Pink Glutathione'];
export const NB_NAME = "NewMe's Birthday Bash";
export const NB_ENDS_LABEL = 'Saturday 8:00am CT';

export const nbLive = (now = Date.now()) => now >= NB_START && now < NB_END;

/** "KPV 10mg and Pink Glutathione" from a label list. */
export const nbJoin = (items) => {
  const xs = (items || []).filter(Boolean);
  if (xs.length <= 1) return xs.join('');
  return xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
};

/* VIP palette — the Founding Five look (same as Kelly's). */
export const NB_GOLD = '#e8c766';
export const NB_GOLD_DEEP = '#b8912f';
export const NB_BLUE = '#2f8cff';

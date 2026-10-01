/* Anniversary Month (Oct 1–31 2026) — the 31-day calendar the /anniversary page renders.

   PRICE days are NOT restated here. They are read from FF_WINDOWS in freakyFridays.js, which
   mirrors IW_FF_FRIDAYS in the backend mu-plugin — the backend is what actually charges. This
   file only adds the days that are not a price window (Flash Saturdays, Loyalty Sundays,
   Credit Wednesday, Stack Day, Passport Early Access) and the copy for each. If a price day
   changes, change it in freakyFridays.js AND iw-freaky-fridays.php; this page follows.

   The non-price days are mirrored from the approved plan (BRIEF.md / iw-anniversary-month
   memory). Their mechanics live in other mu-plugins — if one of those changes, change the copy
   here in the same commit, or the page advertises an offer the cart does not honour.

   All of October is CDT (UTC-5); DST ends 1 Nov. Day N runs 05:00Z on Oct N to 05:00Z on N+1. */

import { FF_WINDOWS } from '@/lib/freakyFridays';

export const ANN_YEAR = 2026;
export const ANN_DAYS = 31;

/** UTC ms when October day `d` begins (midnight CT). */
export const dayStart = (d) => Date.UTC(ANN_YEAR, 9, d, 5);
export const dayEnd = (d) => dayStart(d) + 86400000;

export const ANN_START = dayStart(1);
export const ANN_END = dayEnd(31);

/* A day's deal is revealed at 11pm CT the night before. The finale is always shown — it is the
   headline the whole month builds toward. */
export const REVEAL_LEAD_MS = 60 * 60 * 1000;
export const ALWAYS_SHOWN = [30, 31];
export const revealAt = (d) => dayStart(d) - REVEAL_LEAD_MS;
export const isRevealed = (d, now) => ALWAYS_SHOWN.includes(d) || now >= revealAt(d);

/* The link from the announcement bar and the nav: from the moment day 1 is revealed until
   the month closes. */
export const annPromoLive = (now = Date.now()) => now >= revealAt(1) && now < ANN_END;

/* Flash Saturday windows, used only if /api/flash cannot be reached. The live schedule comes
   from iw-flash.php (IW_FLASH_WINDOWS); these are the same times as written in the plan. */
export const FLASH_TIMES_CT = ['8:00am', '11:00am', '4:30pm', '8:30pm'];

export const PASSPORT_TIERS = [
  { stamps: 5, credit: 75 },
  { stamps: 10, credit: 150 },
  { stamps: 20, credit: 300 },
];
export const PASSPORT_MAX = PASSPORT_TIERS.reduce((s, t) => s + t.credit, 0); // 525
export const PASSPORT_MIN_ORDER = 100;

export const HOLD_TIERS = [
  { days: '2–4', min: 2, price: 12.95 },
  { days: '5–9', min: 5, price: 16.95 },
  { days: '10–14', min: 10, price: 24.95 },
  { days: '15+', min: 15, price: 34.95 },
];

const FINALE_CAPS = 'Max 15 items per order, max 5 RT-3 and TRZ-2 combined, 60mg sizes excluded.';

/* Copy for the days FF_WINDOWS does not carry. */
const EXTRA = {
  saturday: {
    kind: 'flash',
    name: 'Flash Saturday',
    headline: 'Up to 75% off',
    detail: 'Four 20-minute flash windows: 8:00am, 11:00am, 4:30pm and 8:30pm CT. Zelle, Venmo and Cash App only, max 5 of each item.',
    tag: '4 windows',
  },
  sunday: {
    kind: 'loyalty',
    name: 'Loyalty Sunday',
    headline: '3× points + $50 credit',
    detail: 'Triple rewards points on every order, and spend $250 or more to get $50 in store credit for your next order.',
    tag: '3× pts',
  },
  14: {
    kind: 'credit',
    name: 'Credit Wednesday',
    headline: 'Spend $200, get $40',
    detail: 'Spend $200 or more and $40 in store credit lands in your account for your next order.',
    tag: '$40 credit',
  },
  27: {
    kind: 'stack',
    name: 'Stack Day',
    headline: '3+ vials 40% · 5+ vials 45%',
    detail: 'Sitewide volume tiers: put 3 or more vials in your cart for 40% off, 5 or more for 45% off.',
    tag: 'up to 45%',
  },
  29: {
    kind: 'passport',
    name: 'Passport Early Access',
    headline: '50% off sitewide — Passport holders',
    detail: 'A day early for the finale: 50% off sitewide, only for customers holding a Passport (5 or more stamps).',
    tag: 'members',
  },
};

/* Category days whose window carries no product list. */
const BLURB_FALLBACK = { 23: 'Glow-Up and Metabolic products' };

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/(^|[\s+\-/])([a-z])/g, (m, p, c) => p + c.toUpperCase())
    .replace(/\bIi\b/g, 'II');
}

function fromWindow(w, d) {
  const raw = (w.name || '').replace(/^ANNIVERSARY\s*·\s*/u, '');
  const name = d >= 30 ? 'Grand Slam Finale' : titleCase(raw || 'Anniversary Day');
  let detail = 'No code needed — prices drop automatically at midnight CT, and your affiliate code stacks on top.';
  if (d >= 30) detail = `${w.pct}% off sitewide — the biggest days of the month. ${FINALE_CAPS}`;
  return {
    kind: d >= 30 ? 'finale' : w.sitewide ? 'sitewide' : 'category',
    name,
    headline: `${w.pct}% off ${w.sitewide ? 'sitewide' : (w.blurb || BLURB_FALLBACK[w.week] || 'select products')}`,
    detail,
    tag: `${w.pct}%`,
    pct: w.pct,
  };
}

/** The 31 days, each { d, date, weekday, start, end, kind, name, headline, detail, tag }. */
export function annCalendar() {
  const days = [];
  for (let d = 1; d <= ANN_DAYS; d++) {
    const start = dayStart(d);
    const end = dayEnd(d);
    const w = FF_WINDOWS.find((x) => Date.parse(x.start) === start);
    const weekday = new Date(Date.UTC(ANN_YEAR, 9, d)).getUTCDay(); // 0 = Sun
    let info;
    if (w) info = fromWindow(w, d);
    else if (EXTRA[d]) info = EXTRA[d];
    else if (weekday === 6) info = EXTRA.saturday;
    else if (weekday === 0) info = EXTRA.sunday;
    else info = { kind: 'none', name: 'Anniversary Month', headline: 'Shop the store', detail: '', tag: '' };
    days.push({ d, date: `${ANN_YEAR}-10-${String(d).padStart(2, '0')}`, weekday, start, end, ...info });
  }
  return days;
}

/** The day live at `now`, or null outside October. */
export function annToday(now, days = annCalendar()) {
  return days.find((x) => now >= x.start && now < x.end) || null;
}

/** Shipping on the releasing order, for a box holding `n` distinct days. */
export function holdTierPrice(n) {
  let p = null;
  for (const t of HOLD_TIERS) if (n >= t.min) p = t.price;
  return p;
}

/** "02:14:09" */
export function hms(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':');
}

export function ctTime(ms) {
  return new Date(ms)
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' })
    .replace(' AM', 'am')
    .replace(' PM', 'pm');
}

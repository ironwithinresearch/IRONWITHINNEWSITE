/* Thanksgiving sale — Thu 26 Nov 12:00am CT -> Mon 30 Nov 12:00am CT (Brian, 23 Nov 2026).
   "Up to 60% off": each product as deep as its margin allows, creator codes stack, nasal sprays
   35%, aminos 15%, capsules full price, a few items excluded, low-stock items drop out.

   Mirrors the backend, which is the ONLY authority on price: slot 36 / IW_TG_RATES in
   iw-freaky-fridays.php (overrides the 35% week, slot 34). No price or per-item % lives here —
   the storefront shows whatever the store charges. Change a date here and there together.
   Chicago is UTC-6 in November, so 12:00am CT = 06:00Z. Everything that reads tgLive() renders
   nothing outside the window (components wait for a client clock), so pushing early is safe. */

export const TG_START = Date.parse('2026-11-26T06:00:00Z');
export const TG_END = Date.parse('2026-11-30T06:00:00Z');
export const TG_ENDS_LABEL = 'Sunday 11:59 p.m. CT';

export const tgLive = (now = Date.now()) => now >= TG_START && now < TG_END;

/* Kelly's Birthday Bash — Wed 4 Nov 12:00am CT -> Fri 6 Nov 11:59pm CT (Brian, 3 Nov 2026).
   25% off sitewide, affiliate codes stack, and a free RT-3 or TRZ-2 10mg on orders $175+.

   Mirrors the backend, which is the authority on price:
     - slot 28 in IW_FF_FRIDAYS / iw_ff_percent() in mu-plugins/iw-freaky-fridays.php (the 25%)
     - IW_GIFT_FROM / IW_GIFT_TO / IW_GIFT_MIN in mu-plugins/iw-p2p-gift.php (the free vial)
   Kept OUT of FF_WINDOWS on purpose: adding it there would stretch the Halloween season theme
   (FF_SEASON_END) into November. Change a date here and there in the same change.
   After DST (1 Nov) Chicago is UTC-6, so midnight CT = 06:00Z. */

export const KB_START = Date.parse('2026-11-04T06:00:00Z');
export const KB_END = Date.parse('2026-11-07T06:00:00Z');
export const KB_PCT = 25;
export const KB_APP_PCT = 55; // 6 Nov (Brian): up to 55% off with Venmo, Cash App, Zelle or crypto
export const KB_GIFT_MIN = 175;
export const KB_NAME = "Kelly's Birthday Bash";

export const kbLive = (now = Date.now()) => now >= KB_START && now < KB_END;

/* VIP palette (gold + electric blue on black) — the Founding Five look. */
export const KB_GOLD = '#e8c766';
export const KB_GOLD_DEEP = '#b8912f';
export const KB_BLUE = '#2f8cff';

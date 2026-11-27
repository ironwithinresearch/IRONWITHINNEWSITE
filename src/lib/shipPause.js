// Thanksgiving shipping pause — Brian, 23 Nov 2026.
// No orders ship Tue 24 Nov through Sun 29 Nov; everything placed in that window ships
// Mon 30 Nov. FTC Mail Order Rule: the ship date we state must be true, so EVERY ship-time
// promise on the site (dispatch countdown, product page, cart, checkout, shipping page,
// FAQ, announcement bar) reads from here and switches itself off at PAUSE_END.
//
// PAUSE_END = Mon 30 Nov 12:00pm CT (CST = UTC-6). After that the normal Mon–Fri 2pm
// cutoff takes over again, always with the 72-hour processing caveat (27 Nov).
export const PAUSE_START = Date.parse('2026-11-23T06:00:00Z'); // Mon 23 Nov 00:00 CT (notice runs from deploy)
export const PAUSE_END = Date.parse('2026-11-30T18:00:00Z');   // Mon 30 Nov 12:00pm CT

// Calendar dates (America/Chicago) on which nothing ships.
export const PAUSE_DATES = ['2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28', '2026-11-29'];
export const RESUME_LABEL = 'Monday, Nov 30';

export function shipPauseLive(now = Date.now()) {
  return now >= PAUSE_START && now < PAUSE_END;
}

export const PAUSE_MESSAGE =
  "Shipping pause: we're not shipping orders Tuesday, Nov 24 through Sunday, Nov 29. Paid orders placed in that window ship Monday, Nov 30.";
export const PAUSE_SHORT = 'No shipping Nov 24–29. Those orders ship Mon, Nov 30.';
export const PAUSE_MID = 'Shipping pause Nov 24–29. Paid orders from the pause ship Monday, Nov 30.';

// Mon 30 Nov: six days of backlog go out that day, so no same-day countdown is promised
// for NEW orders (compliance review, 23 Nov). Those dates show NO_COUNTDOWN_TEXT instead.
export const NO_COUNTDOWN_DATES = ['2026-11-30'];
// 27 Nov: was "Ships within 1 business day" — replaced with the 72-hour processing line.
export const NO_COUNTDOWN_TEXT = 'Processing can take up to 72 hours (3 business days) before your order ships';

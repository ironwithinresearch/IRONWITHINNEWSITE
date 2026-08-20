// Pay-by-app (Zelle / Venmo / Cash App) discount — the storefront's single source of truth.
//
// This file MIRRORS mu-plugin iw-p2p-discount.php. The backend decides what is actually
// charged; this only lets the buyer see the discount before placing the order. If the two
// disagree the customer is quoted one total and charged another, which is a support ticket
// per order — so the constants below MUST stay identical to the PHP ones:
//
//   P2P_BASE_RATE   <-> IW_P2P_RATE
//   P2P_EVENT_RATE  <-> IW_P2P_EVENT_RATE
//   P2P_EVENT_FROM  <-> IW_P2P_EVENT_FROM
//   P2P_EVENT_TO    <-> IW_P2P_EVENT_TO
//   P2P_PAUSE_*     <-> IW_P2P_PAUSE_*
//
// Live values are also served at /wp-json/iw/v1/p2p-discount for spot-checking.

export const P2P_METHODS = new Set(['iwr_zelle', 'iwr_venmo', 'iwr_cashapp']);

/** Baseline rate, outside any event window. */
export const P2P_BASE_RATE = 0.1;

/**
 * Weekend event: 35% off when you pay by app, 2026-08-21 → 2026-08-23 CT.
 * Opens the instant the summer sale_prices expire (2026-08-21 04:59:59 UTC), so list
 * price is back and the 35% lands on regular pricing rather than compounding on a sale.
 */
export const P2P_EVENT_RATE = 0.35;
export const P2P_EVENT_FROM = Date.parse('2026-08-21T05:00:00Z'); // Fri 00:00 CT
export const P2P_EVENT_TO = Date.parse('2026-08-24T04:59:59Z'); // Sun 23:59:59 CT

/** Full suspension of the discount. Null = not paused. */
export const P2P_PAUSE_FROM = null;
export const P2P_PAUSE_TO = null;

export const p2pPaused = (now = Date.now()) =>
  P2P_PAUSE_FROM !== null && now >= P2P_PAUSE_FROM && now <= P2P_PAUSE_TO;

export const p2pEventLive = (now = Date.now()) =>
  now >= P2P_EVENT_FROM && now <= P2P_EVENT_TO;

/** The rate in force right now (0 while paused). */
export const p2pRate = (now = Date.now()) => {
  if (p2pPaused(now)) return 0;
  return p2pEventLive(now) ? P2P_EVENT_RATE : P2P_BASE_RATE;
};

/** Percent for copy: 10 or 35, never "10.0". */
export const p2pPct = (now = Date.now()) => String(Math.round(p2pRate(now) * 100));

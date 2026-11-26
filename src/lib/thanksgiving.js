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

/* Pay by app only (Brian, 25 Nov). Mirrors mu-plugin iw-thanksgiving-p2p.php (REST GET
   /wp-json/iw/v1/thanksgiving): while slot 36 is live, a cart with ANY sale-priced line can only
   use these gateways; the backend removes card gateways and refuses a card order on its own.
   Full-price-only carts (capsules etc.) keep card. */
export const TG_P2P_METHODS = new Set(['iwr_zelle', 'iwr_venmo', 'iwr_cashapp', 'iwr_crypto', 'iw_storecredit', 'iw_giftcard']);
// Wording per ruo-compliance FIX, 25 Nov: brand names only where the method is chosen (checkout).
export const TG_SALE_PAY_LINE = 'Sale price requires bank/app transfer or crypto payment.';
export const TG_P2P_NOTICE = `${TG_SALE_PAY_LINE} Choose Venmo, Zelle, Cash App or crypto below.`;

const money = (s) => {
  const m = String(s ?? '').replace(/&#[0-9]+;|&[a-z]+;/gi, '').replace(/,/g, '').match(/[0-9]+(?:\.[0-9]+)?/);
  return m ? parseFloat(m[0]) : NaN;
};

/** A cart line sells below its regular price (the sale engine's price filter is what lowers it). */
export const tgLineOnSale = (item) => {
  const v = item?.variation?.node;
  const p = item?.product?.node;
  const price = money(v ? v.price : p?.price);
  const regular = money(v ? v.regularPrice : p?.regularPrice);
  return Number.isFinite(price) && Number.isFinite(regular) && regular > 0 && price < regular - 0.004;
};

/** Thanksgiving is live and the cart holds at least one sale-priced line. */
export const tgCartP2POnly = (items, now = Date.now()) => tgLive(now) && (items || []).some(tgLineOnSale);

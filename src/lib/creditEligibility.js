// Whether the account wallet may be spent on this cart.
//
// ⚠ THIS MIRRORS THE SERVER. The rule lives in mu-plugin iw-store-credit-limits.php
// (iw_sc_offer_context) and that copy is the one that decides — it runs at order
// creation and simply refuses to add the credit line. This file exists so the checkout
// does not quote a credit the backend will then withhold, which is exactly how order
// 3889 charged a total the customer never saw. Change one, change the other.
//
// The rule, either half blocks:
//   1. a free-unit offer is in the cart (buy-one-get-one-FREE and friends), or
//   2. the blended discount across the goods is over MAX_DISCOUNT_PCT.
//
// A "buy one get one 1/2 off" is deliberately NOT a free-unit offer; at 25% it is
// allowed to keep the wallet.

export const MAX_DISCOUNT_PCT = 30;

/* Grand Slam Weekend (26 Sep): 41% until Mon 28 Sep 12:00am CT so credit works with the 30% sale
   + a 15% affiliate code. Mirrors iw_sc_max_discount_pct() in iw-store-credit-limits.php. */
const GSW_LIMIT_UNTIL = Date.parse('2026-09-28T05:00:00Z');
export const maxDiscountPct = (now = Date.now()) => (now < GSW_LIMIT_UNTIL ? 41 : MAX_DISCOUNT_PCT);

// Fee labels meaning a unit was given away. Kept in step with
// iw_sc_free_unit_patterns() on the server.
const FREE_UNIT = [/\bbuy\b.{0,12}\bget\b.{0,12}\bfree\b/i, /\bb\dg\d\b/i, /\bbogo\b/i];

// Fees that are a way of PAYING, not a discount — counting them would let the wallet
// disqualify itself.
const PAYMENT_FEE = ['store credit', 'iwr rewards', 'rewards', 'gift card', 'giftcard'];

const num = (v) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (!v) return 0;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const round2 = (n) => Math.round(n * 100) / 100;

/**
 * @param {object} cart  the GET_CART result's `cart`
 * @returns {{eligible:boolean, reason:string, pct:number, freeUnit:boolean}}
 */
export function creditEligibility(cart) {
  const nodes = cart?.contents?.nodes || [];
  if (!nodes.length) return { eligible: true, reason: '', pct: 0, freeUnit: false };
  // Operator, Sun 27 Sep: any credit works today, no limit — mirrors iw_sc_limits_off().
  if (Date.now() < GSW_LIMIT_UNTIL) return { eligible: true, reason: '', pct: 0, freeUnit: false };

  let regular = 0;
  let paid = 0;

  for (const line of nodes) {
    const qty = Number(line?.quantity) || 0;
    const sub = num(line?.subtotal);
    const tot = num(line?.total);

    // A line at zero on both is a server-side gift (the free vial, minted at order
    // creation). The cart never holds one, so the server skips them too — see the
    // matching guard in iw_sc_offer_context().
    if (Math.abs(sub) < 0.005 && Math.abs(tot) < 0.005) continue;

    const v = line?.variation?.node;
    const p = line?.product?.node;
    let unit = num(v?.regularPrice) || num(p?.regularPrice);
    if (!unit) unit = qty > 0 ? sub / qty : 0;
    regular += unit * qty;
    paid += tot;
  }

  let freeUnit = false;
  for (const fee of cart?.fees || []) {
    const name = String(fee?.name || '').toLowerCase();
    if (PAYMENT_FEE.some((k) => name.includes(k))) continue;
    const amount = num(fee?.amount);
    if (amount >= 0) continue;                    // Route protection and other surcharges
    paid += amount;
    if (FREE_UNIT.some((re) => re.test(name))) freeUnit = true;
  }

  const pct = regular > 0 ? round2((1 - paid / regular) * 100) : 0;

  if (freeUnit) {
    return { eligible: false, reason: 'Store credit can’t be combined with a free-unit offer.', pct, freeUnit: true };
  }
  // Half-point tolerance, mirrors iw-store-credit-limits.php: cent rounding makes a flat 30% sale
  // measure 30.01% on some carts, which was blocking credit for shoppers with no code.
  const limit = maxDiscountPct();
  if (pct > limit + 0.5) {
    return { eligible: false, reason: `Store credit can’t be combined with a discount over ${limit}%.`, pct, freeUnit: false };
  }
  return { eligible: true, reason: '', pct, freeUnit: false };
}

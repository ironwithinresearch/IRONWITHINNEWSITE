// Single source of truth for the cruise sweepstakes.
//
// ⚠️ EVERY VALUE MARKED "TODO" MUST BE SET BEFORE THIS IS PROMOTED. Official Rules that name
// the wrong sponsor, or omit the prize's stated value, are not merely untidy — they are the
// parts a regulator or a disappointed entrant actually reads. The page renders these
// placeholders LOUDLY on purpose so it cannot go out half-filled.
//
// ⚠️ THIS IS A COMPETENT TEMPLATE, NOT LEGAL ADVICE. Have it reviewed before promoting it.
// Two specifics worth raising with whoever reviews it:
//   • New York and Florida require registration and bonding for prizes over $5,000. The ARV
//     here is expected to be well under that, but Florida is the sponsor's own state.
//   • A purchase-only entry route is a lottery in most states. The free mail-in route below is
//     what keeps this a lawful sweepstakes, so it must stay genuinely equal — same odds, no
//     limit that a purchaser does not also face.

export const GIVEAWAY = {
  // ── identity ────────────────────────────────────────────────────────────
  sponsorLegalName: 'Iron Within Nutrition LLC',   // confirmed by Brian 2026-09-05
  sponsorAddress: '8180 Pensacola Blvd, Suite 205, Pensacola, FL 32534',
  sponsorEmail: 'support@ironwithin.io',

  // ── the prize ───────────────────────────────────────────────────────────
  prizeName: 'A Carnival cruise for two',
  prizeArv: '$2,500 USD',                    // confirmed by Brian 2026-09-05
  prizeIncludes: 'Cruise fare for two guests sharing one cabin, plus taxes and port fees.',
  prizeExcludes:
    'Airfare and all travel to and from the departure port, ground transfers, passports or travel ' +
    'documents, travel insurance, shore excursions, drinks packages, gratuities, specialty dining, ' +
    'spa, WiFi and any other onboard or personal spending.',
  // Five ports coast to coast, which materially reduces the "winner cannot reach a port"
  // risk that excluding airfare would otherwise create.
  prizePorts: 'New Orleans, LA · Miami, FL · Norfolk, VA · Galveston, TX · Long Beach, CA',

  // ── window (US Central, the fulfilment centre's own clock) ───────────────
  opensISO: '2026-09-05T05:00:00Z',        // Sat 5 Sep, 12:00am CT
  closesISO: '2026-12-01T05:59:59Z',       // Mon 30 Nov, 11:59:59pm CT
  opensLabel: 'September 5, 2026 at 12:00:00 a.m. Central Time',
  closesLabel: 'November 30, 2026 at 11:59:59 p.m. Central Time',
  drawLabel: 'on or about December 4, 2026',

  // ── mechanics ───────────────────────────────────────────────────────────
  dollarsPerEntry: 100,
  bonusFromLabel: 'November 27, 2026',
  bonusToLabel: 'November 30, 2026',
  minAge: 21,                               // matches the store's own age requirement
};

export const giveawayOpen = (now = Date.now()) =>
  now >= Date.parse(GIVEAWAY.opensISO) && now <= Date.parse(GIVEAWAY.closesISO);

/** Anything still unset. The page refuses to look finished while this is non-empty. */
export const giveawayTodos = () =>
  Object.entries(GIVEAWAY)
    .filter(([, v]) => typeof v === 'string' && v.startsWith('TODO'))
    .map(([k]) => k);

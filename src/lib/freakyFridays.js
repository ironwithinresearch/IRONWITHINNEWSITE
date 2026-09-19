/* Freaky Fridays — the weekly sale series, Fri 8:30pm CT through Mon 8:30pm CT,
   every Friday from 11 September to Halloween. Eight windows.

   SINGLE SOURCE OF TRUTH for the frontend. The backend has its own copy of the same
   schedule in wp-content/mu-plugins/iw-freaky-fridays.php and is the authority on PRICE —
   this file only decides what the storefront SAYS and how it LOOKS. If the two disagree the
   customer sees one thing and is charged another, which is the exact failure mode that has
   bitten this store before: a backend window closed while AnnouncementBar.jsx kept its own
   hardcoded timestamps and went on advertising a gift that no longer existed.
   Change a date here and change it there, in the same commit.

   Times are stored as explicit UTC instants rather than local strings. Every window now falls
   before DST ends on 1 Nov, so all of them are CDT (UTC-5); the backend resolves the same
   schedule through America/Chicago by name, so moving a window past 1 Nov stays correct there
   — but these literals would NOT, and would need recomputing. */

export const FF_WINDOWS = [
  // Week 1 is the LAUNCH and runs the whole weekend: Fri 8:30pm -> Mon 8:30pm CT, 72 hours.
  { week: 1, start: '2026-09-12T01:30:00Z', end: '2026-09-15T01:30:00Z' },
  // Weeks 2-8 are a single 12-hour Friday, 8am -> 8pm CT. Shorter on purpose: the launch buys
  // the habit, the rest stay events rather than a standing discount.
  // Week 2 EXTENDED to 9pm CT (operator, 18 Sep). Mirrors IW_FF_FRIDAYS in the mu-plugin.
  { week: 2, start: '2026-09-18T13:00:00Z', end: '2026-09-19T02:00:00Z' },
  { week: 3, start: '2026-09-25T13:00:00Z', end: '2026-09-26T01:00:00Z' },
  { week: 4, start: '2026-10-02T13:00:00Z', end: '2026-10-03T01:00:00Z' },
  { week: 5, start: '2026-10-09T13:00:00Z', end: '2026-10-10T01:00:00Z' },
  { week: 6, start: '2026-10-16T13:00:00Z', end: '2026-10-17T01:00:00Z' },
  { week: 7, start: '2026-10-23T13:00:00Z', end: '2026-10-24T01:00:00Z' },
  // Closes Fri 30 Oct 8pm CT — the night before Halloween.
  { week: 8, start: '2026-10-30T13:00:00Z', end: '2026-10-31T01:00:00Z' },
];

/* The SEASON is deliberately wider than the sale windows.

   The site wears the Halloween costume for the whole run — from the announcement through to
   the last window closing — while PRICES only move inside a window. Separating the two is the
   point: the campaign reads as a season people can anticipate rather than a switch that flips
   on Friday night, and a shopper who lands on a quiet Tuesday still sees the series is running
   and when the next drop is. Dressing the site only during windows would hide the series from
   everyone who visits between them, which is most visitors. */
export const FF_SEASON_START = Date.parse('2026-09-11T20:00:00Z');
export const FF_SEASON_END = Date.parse(FF_WINDOWS[FF_WINDOWS.length - 1].end);

/* Headline depth, and whether it is FLAT or a ceiling.

   Week 1 changed from a tiered 15-60% sheet to a FLAT 50% sitewide on 12 Sep. That distinction
   drives the copy: a tiered sale must say "up to X%" because most products are shallower, and a
   flat sale must NOT, because "up to 50%" on a straight 50% sale undersells every product on it.

   MUST match iw_ff_percent() in wp-content/mu-plugins/iw-freaky-fridays.php. The backend is the
   authority on what is actually charged; this only drives what the site SAYS. The backend now
   derives its own headline from the percent so it cannot drift internally — but this constant
   can still drift from the backend, so change both in one commit. The store has shipped that
   exact bug before: a window closed server-side while the storefront kept advertising it. */
export const FF_HEADLINE = 55;
export const FF_FLAT = true;   // false => copy should read "up to {FF_HEADLINE}%"

/* Products deliberately NOT in the sale, for copy that needs to say so. */
export const FF_EXCLUDED_NOTE =
  'Selected products. Aminos, gift cards, merch and bundles are not in the sale.';

export const FF_NAME = 'FREAKY FRIDAYS';

/** The window live at `now`, or null. */
export function ffCurrent(now = Date.now()) {
  return (
    FF_WINDOWS.find((w) => now >= Date.parse(w.start) && now < Date.parse(w.end)) || null
  );
}

/** The next window that has not finished yet, or null once the season is over. */
export function ffNext(now = Date.now()) {
  return FF_WINDOWS.find((w) => now < Date.parse(w.end)) || null;
}

export function ffLive(now = Date.now()) {
  return ffCurrent(now) !== null;
}

/** Are we inside the season at all (used to decide whether to wear the theme)? */
export function ffSeason(now = Date.now()) {
  return now >= FF_SEASON_START && now < FF_SEASON_END;
}

/** ms until a window's end, or until the next one opens. Negative/0 means done. */
export function ffCountdownTo(now = Date.now()) {
  const cur = ffCurrent(now);
  if (cur) return { kind: 'ends', ms: Date.parse(cur.end) - now, week: cur.week };
  const nxt = ffNext(now);
  if (nxt) return { kind: 'opens', ms: Date.parse(nxt.start) - now, week: nxt.week };
  return { kind: 'over', ms: 0, week: null };
}

/** "2d 14h 06m" — coarse, for a ticker. Returns '' when nothing is pending. */
export function ffFormat(ms) {
  if (!ms || ms <= 0) return '';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${String(m).padStart(2, '0')}m`;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m`;
}

/** Human wording for a window, derived from the data so copy can never drift from the schedule.
    Week 1 is a weekend; the rest are a single Friday. Rendered in CT, which is how the store
    talks to customers. */
export function ffWindowLabel(w) {
  if (!w) return '';
  const opt = { timeZone: 'America/Chicago' };
  const d = new Date(Date.parse(w.start));
  const e = new Date(Date.parse(w.end));
  const day = (x) => x.toLocaleDateString('en-US', { ...opt, weekday: 'long' });
  const time = (x) =>
    x.toLocaleTimeString('en-US', { ...opt, hour: 'numeric', minute: '2-digit' })
      .replace(':00', '')
      .replace(' AM', 'am')
      .replace(' PM', 'pm');
  const sameDay = day(d) === day(e) && Date.parse(w.end) - Date.parse(w.start) < 86400000;
  return sameDay
    ? `${day(d)} ${time(d)}–${time(e)} CT`
    : `${day(d)} ${time(d)} – ${day(e)} ${time(e)} CT`;
}

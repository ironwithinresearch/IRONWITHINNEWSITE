/* Freaky Fridays — the weekly sale series, Fri 8:30pm CT through Mon 8:30pm CT,
   every Friday from 11 September to Halloween. Eight windows.

   SINGLE SOURCE OF TRUTH for the frontend. The backend has its own copy of the same
   schedule in wp-content/mu-plugins/iw-freaky-fridays.php and is the authority on PRICE —
   this file only decides what the storefront SAYS and how it LOOKS. If the two disagree the
   customer sees one thing and is charged another, which is the exact failure mode that has
   bitten this store before: a backend window closed while AnnouncementBar.jsx kept its own
   hardcoded timestamps and went on advertising a gift that no longer existed.
   Change a date here and change it there, in the same commit.

   Times are stored as explicit UTC instants rather than local strings, because CT is UTC-5
   (CDT) for weeks 1-7 and the final window CLOSES on Mon 2 Nov, after DST ends on 1 Nov —
   a flat -5 would close it an hour late. The instants below already account for that. */

export const FF_WINDOWS = [
  { week: 1, start: '2026-09-12T01:30:00Z', end: '2026-09-15T01:30:00Z' },
  { week: 2, start: '2026-09-19T01:30:00Z', end: '2026-09-22T01:30:00Z' },
  { week: 3, start: '2026-09-26T01:30:00Z', end: '2026-09-29T01:30:00Z' },
  { week: 4, start: '2026-10-03T01:30:00Z', end: '2026-10-06T01:30:00Z' },
  { week: 5, start: '2026-10-10T01:30:00Z', end: '2026-10-13T01:30:00Z' },
  { week: 6, start: '2026-10-17T01:30:00Z', end: '2026-10-20T01:30:00Z' },
  { week: 7, start: '2026-10-24T01:30:00Z', end: '2026-10-27T01:30:00Z' },
  // DST ends Sun 1 Nov, so this Monday close is CST (UTC-6) = 02:30Z, not 01:30Z.
  { week: 8, start: '2026-10-31T01:30:00Z', end: '2026-11-03T02:30:00Z' },
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

/* Headline depth. Must never exceed a discount some SKU in the live week actually carries —
   week 1's deepest is RT-3 30mg at 60% off $173.95. */
export const FF_HEADLINE = 60;

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

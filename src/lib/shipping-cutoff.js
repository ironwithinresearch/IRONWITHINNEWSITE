// Dispatch cutoff — one implementation, used everywhere the promise is made.
//
// The rule (operator, 2026-08-23):
//   • the carrier collects at 4:00pm, Monday to Friday
//   • an order placed before 2:00pm makes THAT day's collection
//   • nothing moves at the weekend, so anything after Friday 2:00pm goes Monday
//
// TIMEZONE: the fulfilment address is Pensacola, FL, which is CENTRAL time, and a
// carrier collection is a physical event in the warehouse's own day. So the cutoff is
// evaluated in America/Chicago and the zone is ALWAYS shown to the customer — "order by
// 2pm" with no zone is ambiguous to a buyer in California and to the packer alike.
// If the operator meant Eastern, change ZONE and ZONE_LABEL together; nothing else.
import { shipDaysLive, SHIPDAYS } from './shipDays';
import { shipPauseLive, PAUSE_DATES, NO_COUNTDOWN_DATES, NO_COUNTDOWN_TEXT } from './shipPause';

export const ZONE = 'America/Chicago';
export const ZONE_LABEL = 'CT';
export const CUTOFF_HOUR = 14; // 2:00pm
export const PICKUP_HOUR = 16; // 4:00pm

// Processing-time wording — Brian, 27 Nov 2026: "processing can take up to 72 hours (3 business days)".
// Same-day applies only to orders placed before the 2pm CT cutoff on a ship day (Mon–Fri,
// minus paused dates). FTC Mail Order Rule: never promise "ships today" without the
// 72-hour caveat. Every surface (product page, cart, checkout, /shipping, /faq) reads these.
export const PROCESSING_FULL =
  'Most orders placed before 2 p.m. Central (Mon\u2013Fri) ship the same day, but processing can take up to 72 hours (3 business days).';
export const PROCESSING_SHORT =
  'Order by 2 p.m. CT for same-day shipping on most orders; processing can take up to 72 hours (3 business days).';
export const PROCESSING_CAVEAT = 'processing can take up to 72 hours (3 business days)';

// Carrier (UPS) holidays — no pickup, so no same-day countdown and never named as the next
// ship day (compliance review, 27 Nov 2026). America/Chicago dates. Extend each year.
export const CARRIER_HOLIDAYS = [
  '2026-12-25', '2027-01-01', '2027-05-31', '2027-07-05', '2027-09-06', '2027-11-25', '2027-11-26', '2027-12-24', '2027-12-31',
];

/** The wall-clock parts of `now` in the warehouse's timezone. */
function localParts(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    dow: days[parts.weekday] ?? 1,
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    ymd: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

const DAY_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * When does an order placed right now actually go out?
 *
 * Returns { todayPickup, shipsLabel, minutesLeft, message }.
 * `minutesLeft` is null whenever today's collection is already unreachable, so callers
 * never render a countdown to a deadline that has passed.
 */
export function dispatchStatus(now = new Date()) {
  const { dow, hour, minute, ymd } = localParts(now);
  const mins = hour * 60 + minute;
  const cutoff = CUTOFF_HOUR * 60;
  // Normally Mon–Fri; during the reduced schedule (src/lib/shipDays.js) only those days.
  const shipDays = shipDaysLive(now.getTime()) ? SHIPDAYS : [1, 2, 3, 4, 5];
  // Thanksgiving pause (src/lib/shipPause.js): these CT dates are never ship days.
  const paused = shipPauseLive(now.getTime()) ? PAUSE_DATES : [];
  const isShipDay = (d, date) => shipDays.includes(d) && !paused.includes(date) && !CARRIER_HOLIDAYS.includes(date);

  if (NO_COUNTDOWN_DATES.includes(ymd)) {
    return { todayPickup: false, shipsLabel: NO_COUNTDOWN_TEXT, minutesLeft: null, message: NO_COUNTDOWN_TEXT, plain: true };
  }

  if (isShipDay(dow, ymd) && mins < cutoff) {
    return {
      todayPickup: true,
      shipsLabel: 'today',
      minutesLeft: cutoff - mins,
      message: `Order within %s for same-day shipping on most orders; ${PROCESSING_CAVEAT}.`,
    };
  }

  // Missed today's collection (or today is not a ship day) — walk forward day by day in
  // the warehouse's calendar until a ship day that is not paused.
  let t = now.getTime();
  let next;
  for (let i = 0; i < 21; i++) {
    t += 24 * 60 * 60 * 1000;
    next = localParts(new Date(t));
    if (isShipDay(next.dow, next.ymd)) break;
  }
  // During the pause name the date too ("Monday, Nov 30") — a bare weekday a week out is ambiguous.
  const label = paused.length && next.ymd > paused[0]
    ? new Intl.DateTimeFormat('en-US', { timeZone: ZONE, weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(t))
    : DAY_NAME[next.dow];
  return {
    todayPickup: false,
    shipsLabel: label,
    minutesLeft: null,
    message: `Most orders placed now ship ${label}; ${PROCESSING_CAVEAT}.`,
  };
}

/** "3h 12m" / "47m" — for the countdown. */
export function formatLeft(minutes) {
  if (minutes == null || minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** The full policy, for the shipping page and the FAQ. One source of wording. */
export const POLICY_LINES = [
  PROCESSING_FULL,
  `We ship Monday to Friday. The carrier collects at ${PICKUP_HOUR - 12}:00pm ${ZONE_LABEL} each weekday.`,
  `Most orders placed after ${CUTOFF_HOUR - 12}:00pm ${ZONE_LABEL}, or at the weekend, ship the next business day.`,
];

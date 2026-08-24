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
export const ZONE = 'America/Chicago';
export const ZONE_LABEL = 'CT';
export const CUTOFF_HOUR = 14; // 2:00pm
export const PICKUP_HOUR = 16; // 4:00pm

/** The wall-clock parts of `now` in the warehouse's timezone. */
function localParts(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    weekday: 'short',
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
  const { dow, hour, minute } = localParts(now);
  const mins = hour * 60 + minute;
  const cutoff = CUTOFF_HOUR * 60;
  const isWeekday = dow >= 1 && dow <= 5;

  if (isWeekday && mins < cutoff) {
    return {
      todayPickup: true,
      shipsLabel: 'today',
      minutesLeft: cutoff - mins,
      message: `Order within %s for today's ${PICKUP_HOUR - 12}pm pickup`,
    };
  }

  // Missed today's collection (or it's the weekend) — find the next working day.
  let next = (dow + 1) % 7;
  if (isWeekday && mins >= cutoff) {
    next = dow === 5 ? 1 : dow + 1; // Friday after cutoff rolls to Monday
  } else if (dow === 6) {
    next = 1; // Saturday
  } else if (dow === 0) {
    next = 1; // Sunday
  }

  const label = next === 1 && (dow === 5 || dow === 6 || dow === 0) ? 'Monday' : DAY_NAME[next];
  return {
    todayPickup: false,
    shipsLabel: label,
    minutesLeft: null,
    message: `Ships ${label}`,
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
  `We ship Monday to Friday. The carrier collects at ${PICKUP_HOUR - 12}:00pm ${ZONE_LABEL} each weekday.`,
  `Orders placed before ${CUTOFF_HOUR - 12}:00pm ${ZONE_LABEL} go out on that same day's collection.`,
  `Orders placed after ${CUTOFF_HOUR - 12}:00pm ${ZONE_LABEL} go out on the next working day.`,
  `Anything ordered after ${CUTOFF_HOUR - 12}:00pm ${ZONE_LABEL} on Friday ships Monday afternoon — we do not ship at weekends.`,
];

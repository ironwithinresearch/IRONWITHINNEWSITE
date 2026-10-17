// Reduced shipping schedule — Brian, 17 Oct 2026: for the next two weeks orders ship
// Monday, Wednesday and Thursday only. Runs to the end of Sat 31 Oct CT (CDT = UTC-5).
// One source: the announcement bar, the pop-up and the dispatch cutoff all read this,
// and all of it switches itself off at SHIPDAYS_END.
export const SHIPDAYS_START = Date.parse('2026-10-17T05:00:00Z');
export const SHIPDAYS_END = Date.parse('2026-11-01T05:00:00Z');
export const SHIPDAYS = [1, 3, 4]; // Mon, Wed, Thu
export const SHIPDAYS_LABEL = 'Monday, Wednesday & Thursday';
export const SHIPDAYS_UNTIL = 'Oct 31';

export function shipDaysLive(now = Date.now()) {
  return now >= SHIPDAYS_START && now < SHIPDAYS_END;
}

export const SHIPDAYS_MESSAGE = `🚚  SHIPPING UPDATE — for the next two weeks orders ship ${SHIPDAYS_LABEL} only · through ${SHIPDAYS_UNTIL}`;

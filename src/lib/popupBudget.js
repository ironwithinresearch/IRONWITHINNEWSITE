// One pop-up per visit (operator, 17 Oct 2026). Every pop-up asks here before it opens;
// the first to claim the visit wins and the rest stay closed until the next session.
// The 21+ account gate is not a pop-up and does not count.
const KEY = 'iw_popup_this_visit';

// In the installable app (app.ironwithin.io, <html data-app="1">) promo pop-ups are off
// entirely; only the operational shipping notice may still show. www is unchanged.
const APP_ALLOWED = ['shipping'];

export function claimPopup(id) {
  try {
    if (document.documentElement.getAttribute('data-app') === '1' && !APP_ALLOWED.includes(id)) return false;
  } catch { /* no document — fall through */ }
  try {
    const taken = sessionStorage.getItem(KEY);
    if (taken && taken !== id) return false;
    sessionStorage.setItem(KEY, id);
  } catch { /* storage blocked — fall through and allow it */ }
  return true;
}

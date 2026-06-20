'use client';
function token() { return typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null; }
export function getReferCookie() {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|; )iw_refer=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
export async function fetchReferral() {
  const t = token(); if (!t) return null;
  try { const r = await fetch('/api/referral', { headers: { Authorization: `Bearer ${t}` }, cache: 'no-store' }); return r.ok ? r.json() : null; } catch { return null; }
}
export async function claimReferral(code) {
  const t = token(); if (!t || !code) return;
  try { await fetch('/api/referral/claim', { method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) }); } catch {}
}

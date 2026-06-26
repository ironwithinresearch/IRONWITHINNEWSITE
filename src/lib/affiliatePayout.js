'use client';

// Affiliate payout-preference client helpers. Read the JWT from localStorage
// (same key Apollo uses) and call the same-origin /api/affiliate-payout-pref proxy.

function token() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

export async function getPayoutPref() {
  const t = token();
  if (!t) return { error: 'auth' };
  try {
    const res = await fetch('/api/affiliate-payout-pref', {
      headers: { Authorization: `Bearer ${t}` },
      cache: 'no-store',
    });
    if (res.status === 401) return { error: 'auth' };
    return await res.json();
  } catch {
    return { error: 'unavailable' };
  }
}

export async function setPayoutPref(payInCredit) {
  const t = token();
  if (!t) return { error: 'auth' };
  try {
    const res = await fetch('/api/affiliate-payout-pref', {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ payInCredit }),
    });
    return await res.json();
  } catch {
    return { error: 'unavailable' };
  }
}

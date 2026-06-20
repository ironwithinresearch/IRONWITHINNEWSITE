'use client';

// IWR Rewards client helpers. Read the JWT from localStorage (same key Apollo uses)
// and call the same-origin /api/rewards proxies.

function token() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

export const TIER_STYLE = {
  iron:     { color: '#9ca3af', glow: 'rgba(156,163,175,0.5)' },
  steel:    { color: '#60a5fa', glow: 'rgba(96,165,250,0.5)' },
  titanium: { color: '#a78bfa', glow: 'rgba(167,139,250,0.5)' },
  black:    { color: '#f5d272', glow: 'rgba(245,210,114,0.55)' }, // gold for the top tier
};

export async function fetchRewards() {
  const t = token();
  if (!t) return null;
  try {
    const res = await fetch('/api/rewards', { headers: { Authorization: `Bearer ${t}` }, cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function redeemRewards(dollars) {
  const t = token();
  if (!t) return { success: false, error: 'Please sign in.' };
  try {
    const res = await fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ dollars }),
    });
    return await res.json();
  } catch {
    return { success: false, error: 'Could not redeem right now.' };
  }
}

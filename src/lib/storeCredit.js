'use client';

// Store-credit client helper. Reads the JWT from localStorage (same key Apollo
// uses) and calls the same-origin /api/store-credit proxy. Returns null when not
// signed in or on any error, so callers can treat "no credit" uniformly.

function token() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

export async function fetchStoreCredit() {
  const t = token();
  if (!t) return null;
  try {
    const res = await fetch('/api/store-credit', {
      headers: { Authorization: `Bearer ${t}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json(); // { balance, currency, ledger[] }
  } catch {
    return null;
  }
}

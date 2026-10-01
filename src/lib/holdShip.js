'use client';

import { useQuery } from '@apollo/client';
import { GET_ORDER_HOLD_INFO } from './queries/orders';

// Hold & Ship Together client helper (Anniversary Month, Oct 2026). Reads the JWT from
// localStorage (same key Apollo uses) and calls the same-origin /api/hold-ship proxy.
// Returns the `hold` object, or null when not signed in or on any error — callers treat
// null as "feature off", so a backend hiccup can never change what checkout charges.
//
// The backend (mu-plugin iw-hold-ship.php) is authoritative: it decides whether an order
// may be held and rewrites the shipping line itself. This only lets checkout QUOTE the
// same number before the order is placed.

function token() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

export async function fetchHoldShip() {
  const t = token();
  if (!t) return null;
  try {
    const res = await fetch('/api/hold-ship', {
      headers: { Authorization: `Bearer ${t}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const d = await res.json();
    return d && typeof d.hold === 'object' && d.hold ? d.hold : null;
  } catch {
    return null;
  }
}

// ── Account order list ──────────────────────────────────────────────────────────────────
// A held order is COMPLETED once it is combined into the order that released the box, so
// its own status would read "Delivered" while the parcel is still moving under the other
// order number. These helpers relabel it "Shipping with #<n>".

/** Map of order databaseId -> { holdRole, holdMergedInto }. Empty on any error. */
export function useOrderHoldInfo(isLoggedIn) {
  const { data } = useQuery(GET_ORDER_HOLD_INFO, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });
  const map = new Map();
  for (const n of data?.customer?.orders?.nodes || []) {
    if (n?.databaseId) map.set(n.databaseId, { holdRole: n.holdRole || null, holdMergedInto: n.holdMergedInto || null });
  }
  return map;
}

/** The statusConfig entry to show, given the order and the hold map. */
export function holdAwareStatus(order, holdMap, statusConfig, fallback) {
  const h = holdMap?.get(order?.databaseId);
  if (h?.holdMergedInto) {
    return { ...statusConfig.IW_HELD, label: `Shipping with #${h.holdMergedInto}` };
  }
  return statusConfig[order?.status] || fallback;
}

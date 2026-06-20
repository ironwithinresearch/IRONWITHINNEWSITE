'use client';

import { useEffect } from 'react';
import { claimReferral, getReferCookie } from '@/lib/referral';

/* Captures ?refer=CODE into a 90-day cookie, and (if the visitor is logged in)
   records who referred them so the referrer gets credited on the first order. */
export default function ReferralCapture() {
  useEffect(() => {
    try {
      const code = new URLSearchParams(window.location.search).get('refer');
      if (code) document.cookie = `iw_refer=${encodeURIComponent(code)}; path=/; max-age=${90 * 86400}`;
      const cookie = getReferCookie();
      if (cookie && localStorage.getItem('jwt_token')) claimReferral(cookie);
    } catch {}
  }, []);
  return null;
}

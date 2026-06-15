'use client';
// src/components/AffiliateTracker.jsx
// Loads the GoAffPro tracking loader site-wide (click/visit/referral tracking
// for shop vwzzhsstjt) and captures the ?ref= referral on landing so it can be
// stamped onto the order at checkout for server-side commission attribution.

import { useEffect } from 'react';
import Script from 'next/script';
import { captureAffiliateRef } from '../lib/affiliate';

export default function AffiliateTracker() {
  useEffect(() => {
    captureAffiliateRef();
  }, []);

  return (
    <Script
      src="https://api.goaffpro.com/loader.js?shop=vwzzhsstjt"
      strategy="afterInteractive"
    />
  );
}

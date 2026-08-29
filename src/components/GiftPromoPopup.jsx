'use client';
/* Free-vial promo popup, for SIGNED-IN shoppers only.
 *
 * Replaces the 10%-off lead-capture popup for people who already have an account: they have
 * already given us their email, so asking for it again wastes the one interruption we get.
 * LeadCapture suppresses itself when this can show, so a customer never sees two popups.
 *
 * Window, threshold and the vial list are IMPORTED from lib/p2p.js — the same source the
 * checkout chooser, the announcement bar and mu-plugin iw-p2p-gift.php all read. Offering a
 * vial the backend will not add is the documented way this class of promo breaks.
 *
 * Shown once every 3 days, and never again once dismissed with "Got it".
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GIFT_MIN, GIFT_OPTIONS, GIFT_FROM, GIFT_TO } from '@/lib/p2p';
import { isLoggedIn } from '@/lib/auth';

const KEY = 'iw_gift_promo_v1';
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

export default function GiftPromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (now < GIFT_FROM || now > GIFT_TO) return;      // outside the offer window
    if (!isLoggedIn()) return;                          // anonymous visitors get LeadCapture

    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* private mode */ }
    if (saved === 'done') return;
    if (saved && now - Number(saved) < SNOOZE_MS) return;

    // Long enough that it does not collide with the page settling, short enough that it is
    // still the same visit. Cleared on unmount so a fast navigation cannot fire it twice.
    const t = setTimeout(() => setOpen(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const close = (permanent) => {
    setOpen(false);
    try { localStorage.setItem(KEY, permanent ? 'done' : String(Date.now())); } catch { /* ignore */ }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Spend $${GIFT_MIN} and choose a free vial`}
      onClick={() => close(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(2,6,12,0.72)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 430,
          borderRadius: 16, overflow: 'hidden',
          background: 'linear-gradient(160deg,#0b1418 0%,#0e1c22 55%,#0b1418 100%)',
          border: '1px solid rgba(0,168,214,0.35)',
          boxShadow: '0 24px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset',
        }}
      >
        <button
          onClick={() => close(true)}
          aria-label="Close"
          style={{
            position: 'absolute', top: 10, right: 12, zIndex: 2,
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)', fontSize: 26, lineHeight: 1, padding: 4,
          }}
        >
          ×
        </button>

        {/* glow */}
        <div aria-hidden style={{
          position: 'absolute', top: -90, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 190, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(0,168,214,0.40), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', padding: '30px 26px 24px', textAlign: 'center' }}>
          <div style={{
            fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase',
            color: '#00A8D6', fontWeight: 700, marginBottom: 12,
          }}>
            Iron Within Research
          </div>

          <div style={{ fontSize: 42, lineHeight: 1, marginBottom: 10 }}>🎁</div>

          <h2 style={{
            margin: '0 0 8px', color: '#fff', fontSize: '1.6rem', lineHeight: 1.2, fontWeight: 800,
          }}>
            Spend ${GIFT_MIN}, pick a free vial
          </h2>

          <p style={{
            margin: '0 0 18px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6,
          }}>
            Your choice of a full-size vial on us — plus free US shipping on the same order.
          </p>

          <div style={{
            display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18,
          }}>
            {GIFT_OPTIONS.map((g) => (
              <span key={g.key} style={{
                padding: '9px 15px', borderRadius: 9,
                border: '1px solid rgba(52,211,153,0.45)',
                background: 'rgba(52,211,153,0.10)',
                color: '#6ee7b7', fontWeight: 700, fontSize: '0.92rem',
              }}>
                {g.label}
              </span>
            ))}
          </div>

          <Link
            href="/shop"
            onClick={() => close(true)}
            style={{
              display: 'block', background: '#00A8D6', color: '#fff', textDecoration: 'none',
              fontWeight: 800, fontSize: '1rem', padding: '14px 20px', borderRadius: 9,
              marginBottom: 12,
            }}
          >
            Shop now
          </Link>

          <button
            onClick={() => close(true)}
            style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem',
            }}
          >
            No thanks
          </button>

          <p style={{
            margin: '14px 0 0', color: 'rgba(255,255,255,0.38)', fontSize: '0.72rem', lineHeight: 1.5,
          }}>
            Applied automatically at ${GIFT_MIN}+. Choose your vial at checkout.
            Free shipping applies to US orders.
          </p>
        </div>
      </div>
    </div>
  );
}

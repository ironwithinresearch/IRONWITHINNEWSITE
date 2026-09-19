'use client';
/* "What's on right now" — replaces GiftPromoPopup.
 *
 * The old popup spent the one interruption we get on a single offer (the free vial) while four
 * were running. This shows everything that is actually live, in the order a shopper needs it:
 * the sitewide discount first, then the thresholds that reward a bigger cart, then the standing
 * loyalty earn.
 *
 * EVERY window and number is IMPORTED from lib/p2p.js — the same source the announcement bar, the
 * cart progress bar, the checkout chooser and the mu-plugins all read. Nothing is restated here.
 * A panel that advertises an offer the cart does not honour is the documented way this class of
 * promo breaks on this store, and hardcoding a threshold is exactly how it happens.
 *
 * Renders nothing when no offer is live, so it retires itself.
 *
 * Shown once every 3 days, never again once dismissed with "Got it".
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GIFT_MIN, GIFT_FROM, GIFT_TO,
  LADDER_FROM, LADDER_TO, LADDER_RUNGS,
  LD_FROM, LD_TO, liveOffersActive,
} from '@/lib/p2p';
import { isLoggedIn } from '@/lib/auth';

const KEY = 'iw_live_offers_v1';
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

const money = (n) => `$${n}`;

export default function LiveOffersPopup() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const t0 = Date.now();
    setNow(t0);
    if (!isLoggedIn()) return;                     // anonymous visitors get LeadCapture

    if (!liveOffersActive(t0)) return;             // nothing to announce

    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* private mode */ }
    if (saved === 'done') return;
    if (saved && t0 - Number(saved) < SNOOZE_MS) return;

    const t = setTimeout(() => setOpen(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const close = (permanent) => {
    setOpen(false);
    try { localStorage.setItem(KEY, permanent ? 'done' : String(Date.now())); } catch { /* ignore */ }
  };

  if (!open) return null;

  const bogoLive = now >= LD_FROM && now < LD_TO;
  const ladderLive = now >= LADDER_FROM && now < LADDER_TO;
  const giftLive = now >= GIFT_FROM && now < GIFT_TO;

  const Card = ({ eyebrow, title, children, lead = false }) => (
    <div style={{
      border: `1px solid rgba(0,168,214,${lead ? 0.42 : 0.22})`,
      background: `rgba(0,168,214,${lead ? 0.09 : 0.05})`,
      borderRadius: 12, padding: '14px 16px', marginBottom: 10, textAlign: 'left',
    }}>
      <div style={{
        fontSize: '0.64rem', letterSpacing: '.12em', textTransform: 'uppercase',
        color: '#00A8D6', fontWeight: 800, marginBottom: 6,
      }}>{eyebrow}</div>
      <div style={{ fontSize: lead ? '1.02rem' : '0.95rem', fontWeight: 800, color: '#fff', marginBottom: 4, lineHeight: 1.3 }}>
        {title}
      </div>
      <div style={{ fontSize: '0.84rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.66)' }}>{children}</div>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="What's on right now at Iron Within"
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
          position: 'relative', width: '100%', maxWidth: 440, maxHeight: '86vh', overflowY: 'auto',
          borderRadius: 16,
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
        >×</button>

        <div aria-hidden style={{
          position: 'absolute', top: -90, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 190, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(0,168,214,0.40), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', padding: '28px 24px 22px' }}>
          <div style={{
            fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase',
            color: '#00A8D6', fontWeight: 700, marginBottom: 6, textAlign: 'center',
          }}>Iron Within Research</div>
          <div style={{
            fontSize: '1.3rem', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 18,
          }}>What&apos;s on right now</div>

          {bogoLive && (
            <Card lead eyebrow="Sitewide · ends Mon Sep 7" title="Buy 1, get 1 free">
              Mix &amp; match any two items and the cheaper one is free, automatically. No code
              needed, and your affiliate code still stacks on top.
            </Card>
          )}

          {ladderLive && (
            <Card eyebrow="Ends Mon Sep 7" title="Spend more, get more">
              {LADDER_RUNGS.map((r, i) => (
                <div key={r.min} style={{ display: 'flex', gap: 8, marginBottom: i === LADDER_RUNGS.length - 1 ? 6 : 3 }}>
                  <strong style={{ color: '#00A8D6', minWidth: 42 }}>{money(r.min)}</strong>
                  <span>free {r.label}</span>
                </div>
              ))}
              They stack — a full cart takes all three. Added automatically at checkout, measured
              on what you actually pay.
            </Card>
          )}

          {giftLive && (
            <Card eyebrow={`At $${GIFT_MIN}`} title="A free vial, and free US shipping">
              Spend ${GIFT_MIN} and pick a free RT-3 10mg or TRZ-2 10mg at checkout — free US
              shipping kicks in at the same point.
            </Card>
          )}

          <Card eyebrow="Always on" title="IWR Rewards">
            Earn a point on every $1 and turn 500 points into $5 off. It applies itself.
          </Card>

          <Link
            href="/shop"
            onClick={() => close(true)}
            style={{
              display: 'block', textAlign: 'center', marginTop: 14, padding: '13px 18px',
              borderRadius: 10, background: 'linear-gradient(135deg,#00CFFF,#7C3AED 55%,#EC4899)',
              color: '#fff', fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem',
            }}
          >Start shopping</Link>

          <button
            onClick={() => close(true)}
            style={{
              display: 'block', width: '100%', marginTop: 8, padding: '9px',
              background: 'transparent', border: 0, cursor: 'pointer',
              color: 'rgba(255,255,255,0.42)', fontSize: '0.82rem',
            }}
          >Got it</button>
        </div>
      </div>
    </div>
  );
}

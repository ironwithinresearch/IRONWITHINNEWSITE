'use client';

import { useState, useEffect, useMemo } from 'react';
import { Gift, X, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Back 2 School free vial. Windows mirror mu-plugin iw-back2school.php:
// Thu Aug 6 4:00pm CT -> Fri 11:59:59pm CT, then all of Sunday. CDT = UTC-5.
const GIFT_W1_START = Date.parse('2026-08-06T21:00:00Z');
const GIFT_W1_END   = Date.parse('2026-08-08T04:59:59Z');
const GIFT_W2_START = Date.parse('2026-08-09T05:00:00Z');
const GIFT_W2_END   = Date.parse('2026-08-10T04:59:59Z');
const THRESHOLD     = 200;

const OPTIONS = [
  { pick: 'rt3', productId: 310, variationId: 520,  name: 'RT-3 10mg',  blurb: 'Our best seller' },
  { pick: 'trz', productId: 319, variationId: 1033, name: 'TRZ-2 10mg', blurb: 'Dual-agonist research peptide' },
];

const giftWindowOpen = (now) =>
  (now >= GIFT_W1_START && now <= GIFT_W1_END) || (now >= GIFT_W2_START && now <= GIFT_W2_END);

const money = (s) => {
  const n = parseFloat(String(s ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export default function B2SGiftPopup() {
  const { cart, addToCart, removeItem, refetchCart } = useCart();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Which flagged gift line (if any) is currently in the cart?
  const giftLine = useMemo(() => {
    const nodes = cart?.contents?.nodes || [];
    return nodes.find((n) =>
      (n.extraData || []).some((e) => e.key === 'iw_b2s_gift' && e.value === '1')
    ) || null;
  }, [cart]);

  // Qualifying subtotal = everything except the free vial itself.
  const subtotal = useMemo(() => {
    const nodes = cart?.contents?.nodes || [];
    return nodes.reduce((sum, n) => {
      const isGift = (n.extraData || []).some((e) => e.key === 'iw_b2s_gift' && e.value === '1');
      return isGift ? sum : sum + money(n.total);
    }, 0);
  }, [cart]);

  const currentVar = giftLine?.variation?.node?.databaseId ?? null;

  useEffect(() => {
    if (dismissed) return;
    if (!giftWindowOpen(Date.now())) return;
    if (subtotal < THRESHOLD) return;
    // Ask once per chosen vial — reopening on every cart change would be a nuisance.
    const seen = typeof window !== 'undefined'
      ? window.localStorage.getItem('iw_b2s_gift_picked')
      : null;
    if (seen && String(seen) === String(currentVar)) return;
    setOpen(true);
  }, [subtotal, currentVar, dismissed]);

  const choose = async (opt) => {
    if (busy) return;
    setBusy(true);
    try {
      if (currentVar !== opt.variationId) {
        if (giftLine?.key) await removeItem(giftLine.key);
        await addToCart(opt.productId, 1, opt.variationId, { iw_b2s_gift: 1, iw_free_gift: 1 });
        await refetchCart?.();
      }
      window.localStorage.setItem('iw_b2s_gift_picked', String(opt.variationId));
      setOpen(false);
      setDismissed(true);
    } catch {
      // If the swap fails the backend still guarantees a free vial (defaults to RT-3),
      // so close quietly rather than trapping the shopper in a modal.
      setOpen(false);
      setDismissed(true);
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    setOpen(false);
    setDismissed(true);
    if (currentVar) window.localStorage.setItem('iw_b2s_gift_picked', String(currentVar));
  };

  if (!open) return null;

  const PINK = '#e8194b';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose your free vial"
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(3,6,10,0.78)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 500, borderRadius: 20, padding: '30px 26px 26px',
          background: 'linear-gradient(160deg, #16233d, #0b1220 60%)',
          border: `1px solid ${PINK}`, boxShadow: '0 24px 70px rgba(0,0,0,0.6)',
          position: 'relative', textAlign: 'center',
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute', top: 12, right: 12, background: 'transparent',
            border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 6,
          }}
        >
          <X size={19} />
        </button>

        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: PINK,
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
        }}>
          <Gift size={26} color="#fff" />
        </div>

        <div style={{
          fontSize: '0.72rem', fontWeight: 900, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: PINK, marginBottom: 7,
        }}>
          Back 2 School Bash
        </div>

        <h2 style={{ margin: '0 0 8px', fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>
          You&rsquo;ve earned a free vial
        </h2>
        <p style={{ margin: '0 0 22px', fontSize: '0.94rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
          Your order is over ${THRESHOLD}. Pick the one you want &mdash; it&rsquo;s added to your cart at no charge.
        </p>

        <div style={{ display: 'grid', gap: 11, marginBottom: 16 }}>
          {OPTIONS.map((o) => {
            const active = currentVar === o.variationId;
            return (
              <button
                key={o.pick}
                onClick={() => choose(o)}
                disabled={busy}
                style={{
                  display: 'flex', alignItems: 'center', gap: 13, width: '100%',
                  padding: '15px 17px', borderRadius: 13, cursor: busy ? 'wait' : 'pointer',
                  textAlign: 'left', color: '#fff',
                  background: active ? 'rgba(232,25,75,0.18)' : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${active ? PINK : 'rgba(255,255,255,0.16)'}`,
                  transition: 'all 160ms ease',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.06rem', fontWeight: 800 }}>{o.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                    {o.blurb}
                  </div>
                </div>
                <span style={{
                  fontSize: '0.74rem', fontWeight: 900, letterSpacing: '0.06em',
                  color: PINK, textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {active ? <Check size={17} /> : 'Choose'}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={close}
          style={{
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.45)',
            fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline',
          }}
        >
          Keep my current pick
        </button>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Truck, CreditCard } from 'lucide-react';
import { shipDaysLive, SHIPDAYS_LABEL, SHIPDAYS_UNTIL } from '@/lib/shipDays';
import { claimPopup } from '@/lib/popupBudget';

// Checkout pop-up. Two notices share one modal:
//  1) Shipping pause: Thu Jul 16 (2 PM CT) → Sunday Jul 19 — auto-hides once shipping resumes.
//  2) Payment methods: while Mastercard is disabled on the processor, ask the buyer to
//     acknowledge the currently-accepted methods. Stays up (independent of the shipping
//     pause) until PAYMENT_NOTICE_ACTIVE is flipped to false once Mastercard is live again.
const SHIP_CUTOFF = Date.parse('2026-07-16T19:00:00Z');
const SHIP_END = Date.parse('2026-07-19T05:00:00Z');

// TEMP: while card processing is paused (2026-07-24 — the card rail still isn't working).
// Flip to false to remove the payment notice once cards are back.
const PAYMENT_NOTICE_ACTIVE = false;
const ACCEPTED_METHODS = 'Zelle, Venmo, and Cash App';

// Bump the suffix whenever the notice content changes so returning shoppers see it again.
const SEEN_KEY = 'iw_checkout_notice_seen_2026_10_shipdays';

export default function ShippingPauseNotice() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [afterCutoff, setAfterCutoff] = useState(false);
  const [shipActive, setShipActive] = useState(false);
  const [shipDays, setShipDays] = useState(false);

  useEffect(() => {
    if (!pathname) return;
    const now = Date.now();
    // Reduced ship days (src/lib/shipDays.js) pop up on ANY page, once per visit.
    // The old pause / payment notices stay checkout-only.
    const days = shipDaysLive(now);
    if (!days && !pathname.startsWith('/checkout')) return;
    const shipping = now < SHIP_END || days;
    setShipDays(days);
    if (!shipping && !PAYMENT_NOTICE_ACTIVE) return; // nothing to show
    try { if (sessionStorage.getItem(SEEN_KEY)) return; } catch {}
    setShipActive(shipping);
    setAfterCutoff(now >= SHIP_CUTOFF);
    const t = setTimeout(() => { if (claimPopup('shipping')) setShow(true); }, 450);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!show) return null;
  const close = () => { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {} setShow(false); };

  const accent = shipActive ? '251,191,36' : '0,207,255'; // amber for shipping, cyan for payment-only

  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(15,12,10,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: 440, width: '100%', borderRadius: 20, padding: '32px 26px 24px', textAlign: 'center',
        background: 'var(--card-dark, #fff)',
        border: '1px solid var(--glass-border)', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
        <button onClick={close} aria-label="Close" style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, cursor: 'pointer' }}>×</button>

        <div style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${accent},0.14)`, border: `1px solid rgba(${accent},0.35)` }}>
          {shipActive ? <Truck size={26} color={`rgb(${accent})`} /> : <CreditCard size={26} color={`rgb(${accent})`} />}
        </div>

        {/* Shipping section — only while the pause window is active */}
        {shipActive && (
          <>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#b45309' }}>Shipping notice</div>
            <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-light)', margin: '6px 0 10px' }}>
              {shipDays ? `We ship ${SHIPDAYS_LABEL}` : 'Orders ship Sunday, July 19'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.55, margin: '0 0 18px' }}>
              {shipDays
                ? `For the next two weeks (through ${SHIPDAYS_UNTIL}), orders ship on Mondays, Wednesdays and Thursdays only. Order any time and it goes out on the next ship day. Thank you for your patience.`
                : afterCutoff
                ? 'Our shipping is paused for a short break until Sunday. Any order you place now is safe — it will ship Sunday, July 19. Thanks for your patience! 💙'
                : 'Heads up — shipping pauses Thursday, July 16 at 2 PM CT for a short break. Order before then to ship right away; orders placed after 2 PM Thursday will ship Sunday, July 19.'}
            </p>
          </>
        )}

        {/* Payment methods acknowledgement */}
        {PAYMENT_NOTICE_ACTIVE && (
          <div style={{ marginTop: shipActive ? 4 : 0, padding: '16px 16px', borderRadius: 14, background: 'rgba(0,207,255,0.06)', border: '1px solid rgba(0,207,255,0.28)', textAlign: 'left' }}>
            {!shipActive && (
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary-blue, #00CFFF)', textAlign: 'center', marginBottom: 8 }}>Payment notice</div>
            )}
            <h3 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: shipActive ? '1.02rem' : '1.35rem', fontWeight: 800, color: '#fff', margin: shipActive ? '0 0 8px' : '0 0 10px', textAlign: shipActive ? 'left' : 'center' }}>
              Accepted payment methods
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
              At this time, the <strong style={{ color: '#fff' }}>only</strong> accepted payment methods are <strong style={{ color: '#fff' }}>{ACCEPTED_METHODS}</strong>. Please make sure you can pay with one of these before placing your order.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.5, margin: '8px 0 0' }}>
              Card payments are temporarily unavailable. Checkout takes seconds — pick a method,
              send payment, and we ship right away.
            </p>
          </div>
        )}

        <button onClick={close} style={{ display: 'block', width: '100%', marginTop: 20, padding: '13px', borderRadius: 12, background: '#1c1917', color: '#fafaf9', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
          {shipDays && !(pathname || '').startsWith('/checkout') ? 'Got it — keep shopping' : 'I understand — continue to checkout'}
        </button>
      </div>
    </div>
  );
}

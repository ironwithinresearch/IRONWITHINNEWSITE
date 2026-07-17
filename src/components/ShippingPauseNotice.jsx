'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Truck, CreditCard } from 'lucide-react';

// Checkout pop-up. Two notices share one modal:
//  1) Shipping pause: Thu Jul 16 (2 PM CT) → Sunday Jul 19 — auto-hides once shipping resumes.
//  2) Payment methods: while Mastercard is disabled on the processor, ask the buyer to
//     acknowledge the currently-accepted methods. Stays up (independent of the shipping
//     pause) until PAYMENT_NOTICE_ACTIVE is flipped to false once Mastercard is live again.
const SHIP_CUTOFF = Date.parse('2026-07-16T19:00:00Z');
const SHIP_END = Date.parse('2026-07-19T05:00:00Z');

// TEMP: while Mastercard is not enabled on ChargeX. Flip to false to remove the payment notice.
const PAYMENT_NOTICE_ACTIVE = true;
const ACCEPTED_METHODS = 'Visa, Discover, Amex, Apple Pay, Google Pay, Venmo, Cash App, and Zelle';

// Bump the suffix whenever the notice content changes so returning shoppers see it again.
const SEEN_KEY = 'iw_checkout_notice_seen_2026_07_pay';

export default function ShippingPauseNotice() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [afterCutoff, setAfterCutoff] = useState(false);
  const [shipActive, setShipActive] = useState(false);

  useEffect(() => {
    if (!pathname || !pathname.startsWith('/checkout')) return;
    const now = Date.now();
    const shipping = now < SHIP_END;
    if (!shipping && !PAYMENT_NOTICE_ACTIVE) return; // nothing to show
    try { if (sessionStorage.getItem(SEEN_KEY)) return; } catch {}
    setShipActive(shipping);
    setAfterCutoff(now >= SHIP_CUTOFF);
    const t = setTimeout(() => setShow(true), 450);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!show) return null;
  const close = () => { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {} setShow(false); };

  const accent = shipActive ? '251,191,36' : '0,207,255'; // amber for shipping, cyan for payment-only

  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: 440, width: '100%', borderRadius: 20, padding: '32px 26px 24px', textAlign: 'center',
        background: `radial-gradient(ellipse at 50% 0%, rgba(${accent},0.20), transparent 62%), #0e1420`,
        border: `1px solid rgba(${accent},0.45)`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={close} aria-label="Close" style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>×</button>

        <div style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${accent},0.14)`, border: `1px solid rgba(${accent},0.35)` }}>
          {shipActive ? <Truck size={26} color={`rgb(${accent})`} /> : <CreditCard size={26} color={`rgb(${accent})`} />}
        </div>

        {/* Shipping section — only while the pause window is active */}
        {shipActive && (
          <>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fbbf24' }}>Shipping notice</div>
            <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '6px 0 10px' }}>
              Orders ship Sunday, July 19
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.95rem', lineHeight: 1.55, margin: '0 0 18px' }}>
              {afterCutoff
                ? 'Our shipping is paused for a short break until Sunday. Any order you place now is safe — it will ship Sunday, July 19. Thanks for your patience! 💙'
                : 'Heads up — shipping pauses Thursday, July 16 at 2 PM CT for a short break. Order before then to ship right away; orders placed after 2 PM Thursday will ship Sunday, July 19.'}
            </p>
          </>
        )}

        {/* Payment methods acknowledgement */}
        {PAYMENT_NOTICE_ACTIVE && (
          <div style={{ marginTop: shipActive ? 4 : 0, padding: '16px 16px', borderRadius: 14, background: 'rgba(0,207,255,0.06)', border: '1px solid rgba(0,207,255,0.28)', textAlign: 'left' }}>
            {!shipActive && (
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00CFFF', textAlign: 'center', marginBottom: 8 }}>Payment notice</div>
            )}
            <h3 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: shipActive ? '1.02rem' : '1.35rem', fontWeight: 800, color: '#fff', margin: shipActive ? '0 0 8px' : '0 0 10px', textAlign: shipActive ? 'left' : 'center' }}>
              Accepted payment methods
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
              At this time, the <strong style={{ color: '#fff' }}>only</strong> accepted payment methods are <strong style={{ color: '#fff' }}>{ACCEPTED_METHODS}</strong>. Please make sure you can pay with one of these before placing your order.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.5, margin: '8px 0 0' }}>
              Mastercard is temporarily unavailable and will return soon.
            </p>
          </div>
        )}

        <button onClick={close} style={{ display: 'block', width: '100%', marginTop: 20, padding: '13px', borderRadius: 12, background: `linear-gradient(90deg, rgb(${accent}), ${shipActive ? '#f59e0b' : '#0a93c4'})`, color: shipActive ? '#1a1205' : '#04121a', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
          I understand — continue to checkout
        </button>
      </div>
    </div>
  );
}

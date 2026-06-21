'use client';
// src/app/thank-you/page.js
//
// Order-confirmation page. The clean-rail redirects paid card customers here as
// `/thank-you?o=<orderNumber>` after Stripe captures payment. This route did not
// previously exist, so EVERY card buyer hit a 404 after a successful charge
// (the money went through, but they saw no confirmation). Reads the order number
// from the query string — no GraphQL fetch, because a guest can't read their own
// just-placed order back (same order:null limit as checkout).

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react';

function ThankYouContent() {
  const params = useSearchParams();
  const orderNumber =
    params.get('o') ||
    params.get('order') ||
    params.get('order_id') ||
    params.get('order_number') ||
    '';

  // The order is placed server-side and the Woo cart is already emptied; refresh
  // so the cart badge clears after the customer returns from the Stripe page.
  const { refetchCart } = useCart();
  useEffect(() => {
    try { if (refetchCart) refetchCart(); } catch (e) { /* noop */ }
  }, [refetchCart]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '56px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="#34d399" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, marginBottom: '12px' }}>
            Payment Received — Order Confirmed!
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Thank you for your order. Your payment was successful and your research peptides are being prepared for shipment.
          </p>
          {orderNumber && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '8px' }}>
              Order <strong style={{ color: 'var(--text-light)' }}>#{orderNumber}</strong>
            </p>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '32px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} /> A confirmation email is on its way.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 24px', background: 'var(--gradient-primary)', borderRadius: '10px', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              Track Your Order <ArrowRight size={15} />
            </Link>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 24px', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-light)', fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              Continue Shopping
            </Link>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '28px' }}>
            Questions? Email{' '}
            <a href="mailto:support@ironwithin.io" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
              support@ironwithin.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}

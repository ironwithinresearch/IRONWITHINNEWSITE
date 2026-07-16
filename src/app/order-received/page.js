'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

// Where ChargeX redirects the buyer back to after a successful card payment (success_url).
// The webhook is what actually marks the order paid server-side — this page just confirms.
export default function OrderReceived() {
  const [order, setOrder] = useState('');
  useEffect(() => {
    try { setOrder(new URLSearchParams(window.location.search).get('order') || ''); } catch {}
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '52px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="#34d399" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>Payment received</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: order ? '24px' : '32px' }}>
            Thank you! Your card payment went through and your order is confirmed. You'll get an email confirmation shortly, and we'll ship it out with tracking.
          </p>

          {order && (
            <div style={{ background: 'var(--bg-dark)', border: '1px solid rgba(0,207,255,0.25)', borderRadius: '14px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Package size={18} color="var(--primary-blue)" />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Order</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary-blue)' }}>#{order}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', background: 'var(--gradient-primary)', borderRadius: '12px', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
              View My Orders <ArrowRight size={15} />
            </Link>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-light)', fontWeight: 600, textDecoration: 'none' }}>
              Keep Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

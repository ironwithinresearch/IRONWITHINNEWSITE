'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

/* Subscribe & Save reorder link target (/reorder?sub=<token>). Rebuilds the cart
   from the subscription's items, applies SUBSCRIBE10 (10% + free US shipping),
   then sends the customer to checkout to pay via the normal rail. */

export default function ReorderPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('sub');
    if (!token) { setStatus('error'); setError('This reorder link is missing its code.'); return; }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/subscription?token=${encodeURIComponent(token)}`);
        const d = await r.json();
        if (!r.ok || !Array.isArray(d.items) || !d.items.length) throw new Error('We couldn’t find that subscription.');
        if (d.status === 'cancelled') throw new Error('This subscription has been cancelled.');
        for (const it of d.items) {
          // iw_sub_reorder tags the line for the 10% price override + free US
          // shipping, WITHOUT creating a new subscription (it already exists).
          await addToCart(it.product_id, it.quantity || 1, it.variation_id || null, { iw_sub_reorder: '1' });
        }
        if (!cancelled) router.replace('/checkout');
      } catch (e) {
        if (!cancelled) { setStatus('error'); setError(e.message || 'Something went wrong.'); }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ maxWidth: 460, width: '100%', textAlign: 'center', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '44px 32px' }}>
        {status === 'loading' ? (
          <>
            <div style={{ fontSize: 30, marginBottom: 12 }}>🔁</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, marginBottom: 8 }}>Rebuilding your order…</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Adding your items and applying your subscriber discount — one moment.</p>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, marginBottom: 8 }}>Hmm — that didn’t work</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 20 }}>{error}</p>
            <Link href="/shop" style={{ display: 'inline-block', padding: '12px 26px', background: 'var(--gradient-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Browse Products</Link>
          </>
        )}
      </div>
    </div>
  );
}

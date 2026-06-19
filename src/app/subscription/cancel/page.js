'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/* Subscribe & Save cancel link target (/subscription/cancel?token=<token>). */

export default function CancelSubscriptionPage() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { setStatus('done'); setMessage('This cancellation link is missing its code.'); return; }
    (async () => {
      try {
        const r = await fetch(`/api/subscription/cancel?token=${encodeURIComponent(token)}`);
        const d = await r.json();
        setMessage(d.message || (d.success ? 'Your subscription has been cancelled.' : 'Subscription not found or already cancelled.'));
      } catch {
        setMessage('Something went wrong — please email support@ironwithin.io and we’ll cancel it for you.');
      }
      setStatus('done');
    })();
  }, []);

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ maxWidth: 460, width: '100%', textAlign: 'center', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '44px 32px' }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>🔁</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, marginBottom: 10 }}>Subscribe &amp; Save</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: 22 }}>
          {status === 'loading' ? 'Processing…' : message}
        </p>
        <Link href="/" style={{ display: 'inline-block', padding: '12px 26px', background: 'var(--gradient-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Back to Iron Within</Link>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * PeptidesPayment (SellAbroad) embedded card form.
 *
 * Mounted on the order-placed screen, not the checkout form: the Woo order must exist
 * first so the widget's payload can carry `external_order_id`, which is what the
 * `payment.container.succeeded` webhook uses to find the order and mark it paid.
 *
 * The widget POSTs /carts/from-api itself. Their docs are explicit that also creating the
 * cart server-side produces a duplicate cart, so the backend endpoint here only BUILDS the
 * payload — it does not send it.
 *
 * If this renders as an empty box, the cause is almost always CSP: app.sellabroad.com and
 * *.basistheory.com must be allowed for script, frame and connect in next.config.js. The
 * browser console names the blocked host. That is how Route's widget failed silently.
 */
export default function PeptidesPayContainer({ orderId, orderKey, onUnavailable }) {
  const [state, setState] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const mountRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;      // StrictMode double-invoke would mount two widgets
    startedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/pp-container?order=${orderId}&key=${encodeURIComponent(orderKey)}`);
        const cfg = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (!res.ok) {
          setError(cfg.error || 'Card payment is unavailable right now.');
          setState('error');
          if (onUnavailable) onUnavailable(cfg.error || '');
          return;
        }

        const host = mountRef.current;
        if (!host) return;

        // Build the container div from the server-supplied numbers. Attribute names are
        // theirs and are load-bearing — data-platform must be exactly "api" or the widget
        // silently falls back to Shopify and fetches /cart.js.
        const div = document.createElement('div');
        div.setAttribute('data-sellabroad-payment-container', '');
        div.setAttribute('data-platform', 'api');
        div.setAttribute('data-merchant-id', cfg.merchant_id);
        div.setAttribute('data-currency', cfg.currency);
        div.setAttribute('data-subtotal-cents', String(cfg.subtotal_cents));
        div.setAttribute('data-discount-cents', String(cfg.discount_cents));
        div.setAttribute('data-shipping-cents', String(cfg.shipping_cents));
        div.setAttribute('data-tax-cents', String(cfg.tax_cents));
        div.setAttribute('data-total-cents', String(cfg.total_cents));
        div.setAttribute('data-from-api-payload', JSON.stringify(cfg.from_api));
        host.appendChild(div);

        // Load their script only after the div exists — it scans for the container on init.
        if (!document.querySelector('script[data-sellabroad-widget]')) {
          const s = document.createElement('script');
          s.src = 'https://app.sellabroad.com/api/widget?variant=container';
          s.async = true;
          s.setAttribute('data-sellabroad-widget', '');
          s.onerror = () => {
            setError('The card form could not load. Please use Zelle, Venmo or Cash App, or email support@ironwithin.io.');
            setState('error');
          };
          document.body.appendChild(s);
        }
        setState('ready');
      } catch {
        if (cancelled) return;
        setError('The card form could not load.');
        setState('error');
      }
    })();

    return () => { cancelled = true; };
  }, [orderId, orderKey, onUnavailable]);

  return (
    <div style={{ textAlign: 'left', marginBottom: '24px' }}>
      {state === 'loading' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '28px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading secure card form…
        </div>
      )}

      {state === 'error' && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.35)' }}>
          <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {error}
            <div style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Your order is saved — nothing has been charged.
            </div>
          </div>
        </div>
      )}

      <div ref={mountRef} style={{ display: state === 'ready' ? 'block' : 'none' }} />
    </div>
  );
}

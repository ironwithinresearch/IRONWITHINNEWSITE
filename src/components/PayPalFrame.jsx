'use client';
/* PayPal, embedded.
 *
 * paypal-proxy-phantom is NOT a redirect gateway. The buyer approves the payment inside an
 * iframe served by one of the configured proxies, and that iframe postMessages the approved
 * PayPal order id back to the parent. Only then can the WooCommerce order be placed — its
 * process_payment captures against that id, and without it the gateway fails with
 * "we cannot process your payment right now [19]", which reads like a decline but means
 * nothing was ever presented to PayPal.
 *
 * The message contract is the plugin's own (assets/js/checkout_hook.js):
 *   {name:'mecom-paypalApprovedOrder',       value:{order_id}}   <- the one that matters
 *   {name:'mecom-paypalBodyResizeCreditForm', value:<px>}
 *   {name:'mecom-paypalOpenCreditFormFail',   value:<message>}
 *   'mecom-paypalMakeFullIframeCreditForm' / '…Normal' / '…CloseCreditForm'
 */

import { useEffect, useRef, useState } from 'react';

export default function PayPalFrame({ onApproved, onError }) {
  const [frame, setFrame] = useState(null);   // { url, origin, proxy_id }
  const [height, setHeight] = useState(150);
  const [full, setFull] = useState(false);
  const [failed, setFailed] = useState('');
  const originRef = useRef('');

  useEffect(() => {
    let alive = true;
    fetch('/api/paypal-frame', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (!d?.enabled || !d?.url) { setFailed('PayPal is unavailable right now.'); return; }
        originRef.current = d.origin || '';
        setFrame(d);
      })
      .catch(() => alive && setFailed('PayPal is unavailable right now.'));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    function listener(event) {
      // Only trust the proxy that served this frame. Without the origin check any page in
      // any tab could post an "approved" id and place an order that was never paid for.
      if (!originRef.current || event.origin !== originRef.current) return;

      const d = event.data;
      if (d === 'mecom-paypalMakeFullIframeCreditForm') { setFull(true); return; }
      if (d === 'mecom-paypalMakeIframeCreditFormNormal') { setFull(false); return; }
      if (d === 'mecom-paypalCloseCreditForm') { setHeight(150); return; }

      if (d && typeof d === 'object') {
        if (d.name === 'mecom-paypalBodyResizeCreditForm' && Number(d.value) >= 130) {
          setHeight(Number(d.value) + 10);
        }
        if (d.name === 'mecom-paypalOpenCreditFormFail') {
          const msg = typeof d.value === 'string' ? d.value : 'PayPal could not start.';
          setFailed(msg);
          onError?.(msg);
        }
        if (d.name === 'mecom-paypalApprovedOrder' && d.value?.order_id) {
          onApproved?.({ ppOrderId: String(d.value.order_id), proxyId: frame?.proxy_id || '', proxyUrl: frame?.origin || '' });
        }
      }
    }
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [frame, onApproved, onError]);

  if (failed) {
    return (
      <div style={{ padding: '0.9rem 1rem', border: '1px solid rgba(248,113,113,0.4)', borderRadius: 8, fontSize: '0.9rem' }}>
        {failed} Please choose another payment method — nothing has been charged.
      </div>
    );
  }
  if (!frame) {
    return <div style={{ padding: '0.9rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Loading PayPal…</div>;
  }

  return (
    <iframe
      title="PayPal"
      src={frame.url}
      referrerPolicy="no-referrer"
      height={height}
      frameBorder="0"
      style={{
        width: '100%', border: 0, borderRadius: 8, background: 'transparent',
        ...(full ? { position: 'fixed', inset: 0, height: '100%', width: '100%', zIndex: 9999 } : null),
      }}
    />
  );
}

'use client';

/**
 * Pay an EXISTING order by card on the PeptidesPayment rail.
 *
 * WHY THIS PAGE EXISTS
 * The two card rails are reached in completely different ways. KeyBilling takes a signed
 * link to the isolated pay app at pay.ironwithin.io, so any unpaid order can be re-sent to
 * it at any time. PeptidesPayment does not work that way: its widget was only ever mounted
 * on the checkout success screen, from React state set moments earlier, so there was NO URL
 * that could put an existing order back in front of it. Once a buyer left that screen, that
 * rail was unreachable for that order forever.
 *
 * That gap matters because of how declines actually land here. "Pick up card - SF; Code:253"
 * is 56% of all declines on this account, and the router treats it as a hard decline and
 * refuses to re-present it on the other acquirer — correctly, since re-presenting genuine
 * pickup-card declines is what gets a MID reviewed. But 80% of the customers who get that
 * code go on to pay successfully, so most of them are not fraud at all. Those orders used to
 * dead-end with no second rail available. This page is the second rail.
 *
 * The order id alone reveals nothing: /pp/container-payload requires the order KEY and
 * returns an identical "not found" for a wrong key as for an unknown order, and it refuses
 * an order that is already paid with a 409. The same key already rides in the buyer's own
 * order links, so this exposes nothing new.
 *
 * The widget reports its own funnel (paymentShown / payClicked / paymentError) and
 * PeptidesPayContainer forwards it to /iw/v1/pp-funnel, so a payment attempted here is
 * measured exactly like one attempted at checkout.
 */

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import PeptidesPayContainer from '../../components/PeptidesPayContainer';

const SUPPORT_EMAIL = 'support@ironwithin.io';

function PayCardInner() {
  const params = useSearchParams();
  const orderId = params.get('order');
  const orderKey = params.get('key');

  const shell = (children) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 24, padding: '48px 32px' }}>
        {children}
      </div>
    </div>
  );

  // Never render the widget without both halves — it would fetch with key=null and show
  // the generic "unavailable" error, which reads like the store is broken.
  if (!orderId || !orderKey) {
    return shell(
      <>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginBottom: 12 }}>
          This payment link is incomplete
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Open the link straight from your email rather than copying part of it. If it still
          does not work, email <strong>{SUPPORT_EMAIL}</strong> with your order number and
          we will send a new one.
        </p>
        <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Return to the store</Link>
      </>
    );
  }

  return shell(
    <>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 900, marginBottom: 10 }}>
        Complete your payment
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>
        Enter your card below. Your order is saved and nothing has been charged yet.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
        Order #{orderId}
      </p>

      <PeptidesPayContainer orderId={orderId} orderKey={orderKey} />

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <ShieldCheck size={14} /> Card details are entered directly with our payment processor.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 10 }}>
        Card not working? Email <strong>{SUPPORT_EMAIL}</strong> and we will send you a
        Zelle, Venmo or Cash App link instead.
      </p>
    </>
  );
}

export default function PayCardPage() {
  // useSearchParams needs a Suspense boundary or the whole route opts into dynamic
  // rendering and the build warns.
  return (
    <Suspense fallback={null}>
      <PayCardInner />
    </Suspense>
  );
}

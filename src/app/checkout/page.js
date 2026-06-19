'use client';
// src/app/checkout/page.js

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { CHECKOUT, buildCheckoutInput } from '../../lib/queries/checkout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { decodePriceHtml } from '../../lib/utils';
import { getAffiliateRef } from '../../lib/affiliate';
import PaymentMethods from '../../components/PaymentMethods';
import {
  ShieldCheck, CreditCard, Truck, ChevronRight,
  Lock, CheckCircle2, Package, ArrowRight,
  Info, Loader2,
} from 'lucide-react';
 
const steps = ['Shipping', 'Review'];

// Payment methods. iwr_rail = card (via the rail). The rest are manual P2P
// gateways (registered on the WooCommerce backend in iw-p2p-pay.php) — the order
// is placed on-hold and the buyer is shown send-to instructions.
const PAY_METHODS = [
  { id: 'iwr_rail',    label: 'Credit / Debit Card', desc: 'Pay by card on our secure encrypted payment page.' },
  { id: 'iwr_zelle',   label: 'Zelle',    handle: '8508980623' },
  { id: 'iwr_venmo',   label: 'Venmo',    handle: '@iwrpay' },
  { id: 'iwr_cashapp', label: 'Cash App', handle: '$ironwithinresearch' },
];

// Countries for the checkout address (ISO 3166-1 alpha-2 codes — WooCommerce format).
// US/CA/GB/AU surfaced first, then the rest alphabetically.
const COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'AU', name: 'Australia' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'AR', name: 'Argentina' },
  { code: 'AT', name: 'Austria' }, { code: 'BE', name: 'Belgium' }, { code: 'BR', name: 'Brazil' },
  { code: 'BG', name: 'Bulgaria' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'HR', name: 'Croatia' }, { code: 'CZ', name: 'Czechia' },
  { code: 'DK', name: 'Denmark' }, { code: 'EG', name: 'Egypt' }, { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' }, { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' }, { code: 'HK', name: 'Hong Kong' }, { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' },
  { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' }, { code: 'KR', name: 'South Korea' }, { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' }, { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' }, { code: 'NL', name: 'Netherlands' }, { code: 'NZ', name: 'New Zealand' },
  { code: 'NO', name: 'Norway' }, { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' }, { code: 'RO', name: 'Romania' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SG', name: 'Singapore' }, { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' },
  { code: 'ZA', name: 'South Africa' }, { code: 'ES', name: 'Spain' }, { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' }, { code: 'TW', name: 'Taiwan' }, { code: 'TH', name: 'Thailand' },
  { code: 'TR', name: 'Turkey' }, { code: 'UA', name: 'Ukraine' }, { code: 'VN', name: 'Vietnam' },
];

// Helper: strip all HTML from price for plain text use (e.g. button label)
function plainPrice(price) {
  if (!price) return '';
  return price.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartItems, cartTotal, cartSubtotal, refetchCart,
    setShippingAddress, setShippingMethod, availableShippingRates, chosenShippingMethods, shippingTotal,
    updatingAddress, updatingShipping } = useCart();
  const { isLoggedIn, user, mounted: authMounted } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [payMethod, setPayMethod] = useState('iwr_rail');
  const [p2pInfo, setP2pInfo] = useState(null);
  const payMethodRef = useRef('iwr_rail');

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '', city: '', state: '', zip: '', country: 'US',
  });

  const [billing, setBilling] = useState({ sameAsShipping: true });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });

  // Locally-tracked shipping choice (WooGraphQL's session "chosen method" is flaky;
  // we drive both the displayed cost and the charged cost from this selection).
  const [shipRate, setShipRate] = useState('');
  useEffect(() => {
    if (!availableShippingRates.length) return;
    if (!availableShippingRates.some(r => r.id === shipRate)) {
      // Default to the cheapest available rate, so US carts over $225 default to
      // Free Shipping rather than a paid option.
      const cost = (c) => parseFloat(String(c || '').replace(/[^0-9.]/g, '')) || 0;
      const cheapest = [...availableShippingRates].sort((a, b) => cost(a.cost) - cost(b.cost))[0];
      setShipRate(cheapest.id);
    }
  }, [availableShippingRates, shipRate]);

  const money = (s) => parseFloat(String(s || '').replace(/&nbsp;/g, '').replace(/[^0-9.]/g, '') || '0');
  const fmt = (n) => `$${n.toFixed(2)}`;

  const subtotalNum = money(cartSubtotal);
  const selectedRate = availableShippingRates.find(r => r.id === shipRate) || null;
  // Shipping stays $0.00 until the customer reaches the review/order step (where
  // they pick a method); only then does it count toward the displayed total.
  const showShipping = currentStep >= 1;
  const shipCostNum = showShipping ? (selectedRate ? money(selectedRate.cost) : money(shippingTotal)) : 0;
  const shipDisplay = showShipping ? (selectedRate ? selectedRate.cost : (shippingTotal || '$0.00')) : '$0.00';
  // Total = cart total minus whatever shipping the cart auto-applied, plus the
  // rate the customer actually selected — so the display always matches the charge.
  const computedTotalNum = Math.max(0, money(cartTotal) - money(shippingTotal) + shipCostNum);
  const displayTotal = fmt(computedTotalNum);

  // When a gift card fully covers the order (incl. shipping), nothing is due — we
  // complete the $0 order through the backend gift-card gateway, not the card rail.
  const isZeroDue = (cartItems?.length || 0) > 0 && computedTotalNum <= 0;
  const effectiveMethod = isZeroDue ? 'iw_giftcard' : payMethod;

  const [checkoutMutation, { loading: placingOrder }] = useMutation(CHECKOUT, {
    onCompleted: (data) => {
      const result = data?.checkout;
      const method = payMethodRef.current;
      // Card: clean-rail gateway returns a redirect to the secure payment page.
      if (method === 'iwr_rail' && result?.redirect) {
        window.location.href = result.redirect;
        return;
      }
      // P2P (Zelle/Venmo/Cash App): order placed on-hold — show pay-to instructions.
      // Gift-card-paid ($0 due) orders are complete already — no P2P instructions.
      const num = result?.order?.orderNumber || result?.order?.databaseId || '';
      setOrderNumber(num);
      if (method !== 'iwr_rail' && method !== 'iw_giftcard') {
        const m = PAY_METHODS.find((x) => x.id === method);
        setP2pInfo({
          label: m?.label || 'P2P',
          handle: m?.handle || '',
          total: plainPrice(result?.order?.total || cartTotal),
          orderNumber: num,
        });
      }
      setOrderPlaced(true);
      refetchCart();
    },
    onError: (err) => {
      alert(`Checkout error: ${err.message}`);
    },
  });

  const handlePlaceOrder = () => {
    payMethodRef.current = effectiveMethod;
    const billingInfo = billing.sameAsShipping ? shipping : billing;
    // Subscribe & Save: only tag the cadence if SUBSCRIBE10 is actually applied.
    const subOn = (cart?.appliedCoupons || []).some((c) => (c.code || '').toLowerCase() === 'subscribe10');
    let subscribeCadence = 0;
    if (subOn) { try { subscribeCadence = parseInt(localStorage.getItem('iw_sub_cadence') || '30', 10) || 30; } catch { subscribeCadence = 30; } }
    const input = buildCheckoutInput({
      billing: { ...billingInfo, email: shipping.email },
      transactionId: '',
      paymentMethod: effectiveMethod,
      affiliateRef: getAffiliateRef(),
      shippingMethod: shipRate,
      subscribeCadence,
    });
    checkoutMutation({ variables: input });
  };

  // ── Order success screen ──
  if (orderPlaced) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ maxWidth: 500, width: '100%', textAlign: 'center', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '56px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={40} color="#34d399" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, marginBottom: '12px' }}>
              {p2pInfo ? 'Order Placed!' : 'Order Confirmed!'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {p2pInfo
                ? 'One more step — send your payment below. Your order ships as soon as payment is received.'
                : 'Thank you for your order. Your research peptides are being prepared for shipment.'}
            </p>
            {orderNumber && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: p2pInfo ? '20px' : '32px' }}>
                Order #{orderNumber} · Confirmation sent to {shipping.email}
              </p>
            )}
            {p2pInfo && (
              <div style={{ textAlign: 'left', background: 'var(--bg-dark)', border: '1px solid var(--primary-blue)', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
                <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '10px' }}>
                  Complete your {p2pInfo.label} payment
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Send <strong style={{ color: 'var(--text-light)' }}>{p2pInfo.total}</strong> via <strong style={{ color: 'var(--text-light)' }}>{p2pInfo.label}</strong> to:
                </p>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-blue)', background: 'rgba(0,207,255,0.08)', borderRadius: '10px', padding: '12px 14px', textAlign: 'center', marginBottom: '12px', wordBreak: 'break-all' }}>
                  {p2pInfo.handle}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Include <strong style={{ color: 'var(--text-secondary)' }}>order #{p2pInfo.orderNumber}</strong> in the payment note so we can match your payment. Questions? Email support@ironwithin.io.
                </p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 24px', background: 'var(--gradient-primary)', borderRadius: '10px', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                View Orders <ArrowRight size={15} />
              </Link>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 24px', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-light)', fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Guest checkout enabled ──
  // No login wall — guests check out with just their email (collected in the
  // form below). The backend (iw-guest-account.php) auto-creates an account from
  // that email so order history still works. Logged-out users see an optional,
  // non-blocking sign-in nudge near the top of the form.

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={13} />
          <Link href="/cart" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cart</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--primary-blue)' }}>Checkout</span>
        </nav>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '48px' }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', background: i === currentStep ? 'rgba(0,207,255,0.1)' : 'transparent' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i < currentStep ? 'rgba(52,211,153,0.2)' : i === currentStep ? 'var(--gradient-primary)' : 'var(--card-dark)', border: `2px solid ${i < currentStep ? '#34d399' : i === currentStep ? 'transparent' : 'var(--glass-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: i < currentStep ? '#34d399' : '#fff' }}>
                  {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: i === currentStep ? 600 : 400, color: i === currentStep ? 'var(--primary-blue)' : i < currentStep ? '#34d399' : 'var(--text-muted)' }}>{step}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 32, height: 1, background: i < currentStep ? '#34d399' : 'var(--glass-border)' }} />}
            </div>
          ))}
        </div>

        {/* Optional sign-in nudge — never blocks guest checkout */}
        {authMounted && !isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px 18px', marginBottom: '28px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span>Checking out as guest — just add your email below.</span>
            <Link href="/login?redirect=/checkout" style={{ color: 'var(--primary-blue)', fontWeight: 600, textDecoration: 'none' }}>
              Have an account? Sign in →
            </Link>
          </div>
        )}

        <div className="checkout-grid">

          {/* ── Left: Form ── */}
          <div>
            {currentStep === 0 && (
              <FormCard icon={<Truck size={17} color="var(--primary-blue)" />} title="Shipping Information">
                <form onSubmit={async e => { e.preventDefault(); await setShippingAddress(shipping); setCurrentStep(1); }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <Field label="First Name *" value={shipping.firstName} onChange={v => setShipping(s => ({ ...s, firstName: v }))} placeholder="John" required />
                    <Field label="Last Name *" value={shipping.lastName} onChange={v => setShipping(s => ({ ...s, lastName: v }))} placeholder="Doe" required />
                  </div>
                  <div style={{ height: 14 }} />
                  <Field label="Email *" type="email" value={shipping.email} onChange={v => setShipping(s => ({ ...s, email: v }))} placeholder="you@example.com" required />
                  <div style={{ height: 14 }} />
                  <Field label="Phone" value={shipping.phone} onChange={v => setShipping(s => ({ ...s, phone: v }))} placeholder="+1 (555) 000-0000" />
                  <div style={{ height: 14 }} />
                  <Field label="Street Address *" value={shipping.address} onChange={v => setShipping(s => ({ ...s, address: v }))} placeholder="123 Research Blvd" required />
                  <div style={{ height: 14 }} />
                  <SelectField label="Country *" value={shipping.country} onChange={v => setShipping(s => ({ ...s, country: v }))} options={COUNTRIES} required />
                  <div style={{ height: 14 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
                    <Field label="City *" value={shipping.city} onChange={v => setShipping(s => ({ ...s, city: v }))} placeholder="City" required />
                    <Field label="State / Province" value={shipping.state} onChange={v => setShipping(s => ({ ...s, state: v }))} placeholder="State / Province" />
                    <Field label="Postal Code *" value={shipping.zip} onChange={v => setShipping(s => ({ ...s, zip: v }))} placeholder="Postal code" required />
                  </div>
                  <div style={{ height: 18 }} />
                  <Disclaimer />
                  <div style={{ height: 18 }} />
                  <SubmitBtn>Continue to Review <ArrowRight size={16} /></SubmitBtn>
                </form>
              </FormCard>
            )}

            {currentStep === 1 && (
              <FormCard icon={<CheckCircle2 size={17} color="#34d399" />} title="Review Your Order">
                <ReviewBlock title="Shipping Address" onEdit={() => setCurrentStep(0)}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {shipping.firstName} {shipping.lastName}<br />
                    {shipping.address}<br />
                    {shipping.city}{shipping.state ? `, ${shipping.state}` : ''} {shipping.zip}<br />
                    {(COUNTRIES.find(c => c.code === shipping.country)?.name) || shipping.country}<br />
                    {shipping.email}
                  </p>
                </ReviewBlock>
                {availableShippingRates.length > 0 && (
                  <ReviewBlock title="Shipping Method">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {availableShippingRates.map((r) => {
                        const active = shipRate === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setShipRate(r.id)}
                            style={{
                              textAlign: 'left', padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                              background: active ? 'rgba(0,207,255,0.08)' : 'var(--bg-dark)',
                              border: `1px solid ${active ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                              display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-body)',
                            }}
                          >
                            <span style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: `2px solid ${active ? 'var(--primary-blue)' : 'var(--text-muted)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              {active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary-blue)' }} />}
                            </span>
                            <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-light)' }}>{r.label}</span>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-light)' }}
                              dangerouslySetInnerHTML={{ __html: decodePriceHtml(r.cost) }} />
                          </button>
                        );
                      })}
                    </div>
                  </ReviewBlock>
                )}
                <ReviewBlock title="Payment Method">
                  {isZeroDue ? (
                    <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0,207,255,0.08)', border: '1px solid var(--primary-blue)', fontFamily: 'var(--font-body)' }}>
                      <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-light)' }}>Paid in full by gift card 🎁</span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Your gift card covers this order — nothing due. No card needed.</span>
                    </div>
                  ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {PAY_METHODS.map((m) => {
                      const active = payMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPayMethod(m.id)}
                          style={{
                            textAlign: 'left', padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                            background: active ? 'rgba(0,207,255,0.08)' : 'var(--bg-dark)',
                            border: `1px solid ${active ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                            display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-body)',
                          }}
                        >
                          <span style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: `2px solid ${active ? 'var(--primary-blue)' : 'var(--text-muted)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            {active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary-blue)' }} />}
                          </span>
                          <span style={{ flex: 1 }}>
                            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-light)' }}>{m.label}</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {m.id === 'iwr_rail' ? m.desc : `Send your payment to ${m.handle} after placing the order`}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  )}
                </ReviewBlock>
                <button onClick={handlePlaceOrder} disabled={placingOrder}
                  style={{ width: '100%', padding: '14px', background: 'var(--gradient-primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: placingOrder ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'var(--glow-blue)', opacity: placingOrder ? 0.8 : 1 }}>
                  {placingOrder ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Placing Order…</>
                  ) : isZeroDue ? (
                    <><Lock size={15} /> Complete Order — $0.00 due</>
                  ) : payMethod === 'iwr_rail' ? (
                    <><Lock size={15} /> Continue to Secure Payment — {displayTotal}</>
                  ) : (
                    <><Lock size={15} /> Place Order — Pay by {PAY_METHODS.find((x) => x.id === payMethod)?.label}</>
                  )}
                </button>
              </FormCard>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '24px', position: 'sticky', top: 'calc(var(--navbar-height) + 20px)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, marginBottom: '18px' }}>Order Summary</h2>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {cartItems.map(item => {
                const isFreeGift = (item.extraData || []).some(e => e.key === 'iw_free_gift' && e.value === '1');
                return (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: '8px', background: 'var(--bg-elevated)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.product?.node?.image?.sourceUrl ? (
                        <img src={item.product.node.image.sourceUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : <Package size={14} color="var(--text-muted)" />}
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product?.node?.name} × {item.quantity}
                    </span>
                    {isFreeGift && (
                      <span style={{ padding: '1px 7px', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.5)', borderRadius: '999px', fontSize: '0.62rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        🎁 Free
                      </span>
                    )}
                  </div>
                  {/* ── item total ("FREE" for the gift) ── */}
                  {isFreeGift ? (
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, color: '#34d399' }}>FREE</span>
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 }}
                      dangerouslySetInnerHTML={{ __html: decodePriceHtml(item.total) }} />
                  )}
                </div>
                );
              })}
            </div>

            <div style={{ height: 1, background: 'var(--glass-border)', marginBottom: '14px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {/* ── Fixed subtotal ── */}
              <SummaryRow label="Subtotal" htmlValue={cartSubtotal} />
              {(cart?.appliedCoupons || []).map((c, _i, arr) => {
                // WooGraphQL sometimes returns an empty per-coupon discountAmount mid-recalc,
                // which would render a bare "Applied". Fall back to the cart's discountTotal
                // (exact when a single coupon is applied) so the subtracted amount always shows.
                const amount = c.discountAmount || (arr.length === 1 ? cart?.discountTotal : null);
                return (
                  <SummaryRow
                    key={c.code}
                    label={`Coupon: ${(c.code || '').toUpperCase()}`}
                    htmlValue={amount ? `- ${amount}` : null}
                    value={amount ? undefined : 'Applied'}
                    valueColor="#34d399"
                  />
                );
              })}
              {/* Shipping — $0.00 until the review step, then the selected rate */}
              <SummaryRow label="Shipping" htmlValue={shipDisplay} value={undefined} />
            </div>

            <div style={{ height: 1, background: 'var(--glass-border)', marginBottom: '14px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              {/* Computed so it reflects the selected shipping rate exactly */}
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {displayTotal}</span>
            </div>

            {[
              { Icon: ShieldCheck, label: 'Secure SSL checkout' },

              { Icon: Package, label: 'Ships in 24–48 hours' },
            ].map(({ Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <Icon size={12} color="var(--primary-blue)" /> {label}
              </div>
            ))}

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
              <PaymentMethods />
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function FormCard({ icon, title, children }) {
  return (
    <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, required, maxLength }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} maxLength={maxLength}
        style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'} />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} required={required}
        style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}
        onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}>
        {options.map(o => <option key={o.code} value={o.code} style={{ background: 'var(--bg-dark)', color: 'var(--text-light)' }}>{o.name}</option>)}
      </select>
    </div>
  );
}

function SubmitBtn({ children, style = {} }) {
  return (
    <button type="submit" style={{ width: '100%', padding: '13px', background: 'var(--gradient-primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'var(--glow-blue)', ...style }}>
      {children}
    </button>
  );
}

function Disclaimer() {
  return (
    <div style={{ display: 'flex', gap: '8px', padding: '12px 14px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px' }}>
      <Info size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        By ordering you confirm these peptides are for research purposes only.
      </p>
    </div>
  );
}

function ReviewBlock({ title, onEdit, children }) {
  return (
    <div style={{ padding: '14px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '10px', marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        <button onClick={onEdit} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Edit</button>
      </div>
      {children}
    </div>
  );
}

// SummaryRow supports both plain value and raw HTML value (for prices)
function SummaryRow({ label, value, htmlValue, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      {htmlValue ? (
        <span style={{ color: valueColor || 'var(--text-light)', fontWeight: 500 }}
          dangerouslySetInnerHTML={{ __html: decodePriceHtml(htmlValue) }} />
      ) : (
        <span style={{ color: valueColor || 'var(--text-light)', fontWeight: 500 }}>{value}</span>
      )}
    </div>
  );
}

'use client';
// src/app/checkout/page.js

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { CHECKOUT, buildCheckoutInput } from '../../lib/queries/checkout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { decodePriceHtml } from '../../lib/utils';
import {
  ShieldCheck, CreditCard, Truck, ChevronRight,
  Lock, CheckCircle2, Package, ArrowRight,
  Info, Loader2,
} from 'lucide-react';
 
const steps = ['Shipping', 'Payment', 'Review'];

// Helper: strip all HTML from price for plain text use (e.g. button label)
function plainPrice(price) {
  if (!price) return '';
  return price.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartItems, cartTotal, cartSubtotal, refetchCart } = useCart();
  const { isLoggedIn, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '', city: '', state: '', zip: '', country: 'US',
  });

  const [billing, setBilling] = useState({ sameAsShipping: true });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });

  const subtotalNum = parseFloat(cartSubtotal?.replace(/[^0-9.]/g, '') || '0');
 
  const [checkoutMutation, { loading: placingOrder }] = useMutation(CHECKOUT, {
    onCompleted: (data) => {
      const result = data?.checkout;
      // Clean-rail gateway returns a redirect to the secure payment page.
      if (result?.redirect) {
        window.location.href = result.redirect;
        return;
      }
      if (result?.result === 'success' || result?.order) {
        setOrderNumber(result.order?.orderNumber || result.order?.id || '');
        setOrderPlaced(true);
        refetchCart();
      }
    },
    onError: (err) => {
      alert(`Checkout error: ${err.message}`);
    },
  });

  const handlePlaceOrder = () => {
    const billingInfo = billing.sameAsShipping ? shipping : billing;
    const input = buildCheckoutInput({
      billing: { ...billingInfo, email: shipping.email },
      shipping,
      transactionId: '',
      paymentMethod: 'iwr_rail',
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
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, marginBottom: '12px' }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Thank you for your order. Your research peptides are being prepared for shipment.
            </p>
            {orderNumber && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '32px' }}>
                Order #{orderNumber} · Confirmation sent to {shipping.email}
              </p>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)', gap: '32px', alignItems: 'start' }}>

          {/* ── Left: Form ── */}
          <div>
            {currentStep === 0 && (
              <FormCard icon={<Truck size={17} color="var(--primary-blue)" />} title="Shipping Information">
                <form onSubmit={e => { e.preventDefault(); setCurrentStep(1); }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
                    <Field label="City *" value={shipping.city} onChange={v => setShipping(s => ({ ...s, city: v }))} placeholder="New York" required />
                    <Field label="State *" value={shipping.state} onChange={v => setShipping(s => ({ ...s, state: v }))} placeholder="NY" required />
                    <Field label="ZIP *" value={shipping.zip} onChange={v => setShipping(s => ({ ...s, zip: v }))} placeholder="10001" required />
                  </div>
                  <div style={{ height: 18 }} />
                  <Disclaimer />
                  <div style={{ height: 18 }} />
                  <SubmitBtn>Continue to Payment <ArrowRight size={16} /></SubmitBtn>
                </form>
              </FormCard>
            )}

            {currentStep === 1 && (
              <FormCard icon={<CreditCard size={17} color="var(--primary-blue)" />} title="Payment Details">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '10px', marginBottom: '20px' }}>
                  <Lock size={13} color="#34d399" />
                  <span style={{ fontSize: '0.8rem', color: '#34d399' }}>256-bit SSL encrypted · Card info never stored</span>
                </div>
                <form onSubmit={e => { e.preventDefault(); setCurrentStep(2); }}>
                  <Field label="Cardholder Name *" value={payment.cardName} onChange={v => setPayment(p => ({ ...p, cardName: v }))} placeholder="John Doe" required />
                  <div style={{ height: 14 }} />
                  <Field label="Card Number *" value={payment.cardNumber} onChange={v => setPayment(p => ({ ...p, cardNumber: v }))} placeholder="1234 5678 9012 3456" required maxLength={19} />
                  <div style={{ height: 14 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <Field label="Expiry *" value={payment.expiry} onChange={v => setPayment(p => ({ ...p, expiry: v }))} placeholder="MM / YY" required />
                    <Field label="CVV *" type="password" value={payment.cvv} onChange={v => setPayment(p => ({ ...p, cvv: v }))} placeholder="•••" required maxLength={4} />
                  </div>
                  <div style={{ height: 18 }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setCurrentStep(0)} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>← Back</button>
                    <SubmitBtn style={{ flex: 2 }}>Review Order <ArrowRight size={15} /></SubmitBtn>
                  </div>
                </form>
              </FormCard>
            )}

            {currentStep === 2 && (
              <FormCard icon={<CheckCircle2 size={17} color="#34d399" />} title="Review Your Order">
                <ReviewBlock title="Shipping Address" onEdit={() => setCurrentStep(0)}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {shipping.firstName} {shipping.lastName}<br />
                    {shipping.address}<br />
                    {shipping.city}, {shipping.state} {shipping.zip}<br />
                    {shipping.email}
                  </p>
                </ReviewBlock>
                <ReviewBlock title="Payment" onEdit={() => setCurrentStep(1)}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Card ending in {payment.cardNumber.slice(-4) || '****'}
                  </p>
                </ReviewBlock>
                <button onClick={handlePlaceOrder} disabled={placingOrder}
                  style={{ width: '100%', padding: '14px', background: 'var(--gradient-primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: placingOrder ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'var(--glow-blue)', opacity: placingOrder ? 0.8 : 1 }}>
                  {placingOrder ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Placing Order…</>
                  ) : (
                    // ── Fixed: use plainPrice() so no &nbsp; shows in button ──
                    <><Lock size={15} /> Place Order — {plainPrice(cartTotal)}</>
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
              {cartItems.map(item => (
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
                  </div>
                  {/* ── Fixed item total price ── */}
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 }}
                    dangerouslySetInnerHTML={{ __html: decodePriceHtml(item.total) }} />
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'var(--glass-border)', marginBottom: '14px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {/* ── Fixed subtotal ── */}
              <SummaryRow label="Subtotal" htmlValue={cartSubtotal} />
              
            </div>

            <div style={{ height: 1, background: 'var(--glass-border)', marginBottom: '14px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              {/* ── Fixed total ── */}
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                dangerouslySetInnerHTML={{ __html: decodePriceHtml(cartTotal) }} />
            </div>

            {[
              { Icon: ShieldCheck, label: 'Secure SSL checkout' },
 
              { Icon: Package, label: 'Ships in 24–48 hours' },
            ].map(({ Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <Icon size={12} color="var(--primary-blue)" /> {label}
              </div>
            ))}
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

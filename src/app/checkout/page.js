'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck, CreditCard, Truck, ChevronRight,
  Lock, CheckCircle2, FlaskConical, Pill, Dna,
  Package, ArrowRight, Info, Eye, EyeOff,
} from 'lucide-react';
import { allProducts } from '../../data/products';
import { getIconByName } from '../../lib/iconMap';

/* ── Mock order summary ──────────────────────────────────── */
const orderItemIds = [1, 3, 4];
const orderItemQtys = { 1: 2, 3: 1, 4: 1 };

const orderItems = orderItemIds.map(id => {
  const product = allProducts.find(p => p.id === id);
  return {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    qty: orderItemQtys[id],
    badgeColor: product.badgeColor,
    iconName: product.iconName,
    image: product.image,
  };
});

const steps = ['Shipping', 'Payment', 'Review'];

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 225;

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCvv, setShowCvv] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', address: '', city: '',
    state: '', zip: '', country: 'US',
  });

  const [payment, setPayment] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    method: 'card',
  });

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const total = subtotal + shippingCost;

  const handleShipping = (e) => {
    e.preventDefault();
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    setTimeout(() => {
      setPlacingOrder(false);
      setOrderPlaced(true);
    }, 2000);
  };

  /* ── Order placed success screen ── */
  if (orderPlaced) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{
          maxWidth: 520, width: '100%', textAlign: 'center',
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '60px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(52,211,153,0.15)',
              border: '2px solid rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle2 size={40} color="#34d399" />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem', fontWeight: 900,
              marginBottom: '12px',
            }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '8px' }}>
              Thank you for your order. Your research peptides are being prepared for shipment.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '32px' }}>
              Order #DP-{Math.floor(Math.random() * 90000) + 10000} · Confirmation sent to {shipping.email || 'your email'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/orders" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '12px 24px',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                color: '#fff', fontWeight: 600,
                textDecoration: 'none', fontFamily: 'var(--font-body)',
              }}>
                View Order <ArrowRight size={15} />
              </Link>
              <Link href="/shop" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '12px 24px',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)', fontWeight: 500,
                textDecoration: 'none', fontFamily: 'var(--font-body)',
              }}>
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

        {/* ── Breadcrumb ── */}
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '32px',
        }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >Home</Link>
          <ChevronRight size={13} />
          <Link href="/cart" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >Cart</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--primary-blue)' }}>Checkout</span>
        </nav>

        {/* ── Step Indicator ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0', marginBottom: '48px',
        }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: i === currentStep
                  ? 'rgba(0,207,255,0.1)'
                  : i < currentStep ? 'rgba(52,211,153,0.08)' : 'transparent',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i < currentStep
                    ? 'rgba(52,211,153,0.2)'
                    : i === currentStep ? 'var(--gradient-primary)' : 'var(--card-dark)',
                  border: `2px solid ${i < currentStep ? '#34d399' : i === currentStep ? 'transparent' : 'var(--glass-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700,
                  color: i < currentStep ? '#34d399' : '#fff',
                }}>
                  {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span style={{
                  fontSize: '0.85rem', fontWeight: i === currentStep ? 600 : 400,
                  color: i === currentStep ? 'var(--primary-blue)'
                    : i < currentStep ? '#34d399' : 'var(--text-muted)',
                }}>{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 40, height: 1,
                  background: i < currentStep ? '#34d399' : 'var(--glass-border)',
                  transition: 'background var(--transition-base)',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Main Layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)',
          gap: '32px',
          alignItems: 'start',
        }}>

          {/* ── Left: Form ── */}
          <div>

            {/* STEP 0: Shipping */}
            {currentStep === 0 && (
              <div style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: 'rgba(0,207,255,0.1)',
                    border: '1px solid rgba(0,207,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Truck size={17} color="var(--primary-blue)" />
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800 }}>
                    Shipping Information
                  </h2>
                </div>

                <form onSubmit={handleShipping}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FormField label="First Name" value={shipping.firstName}
                      onChange={v => setShipping(s => ({ ...s, firstName: v }))}
                      placeholder="John" required />
                    <FormField label="Last Name" value={shipping.lastName}
                      onChange={v => setShipping(s => ({ ...s, lastName: v }))}
                      placeholder="Doe" required />
                  </div>
                  <div style={{ height: 16 }} />
                  <FormField label="Email Address" type="email" value={shipping.email}
                    onChange={v => setShipping(s => ({ ...s, email: v }))}
                    placeholder="john@research.com" required />
                  <div style={{ height: 16 }} />
                  <FormField label="Phone Number" type="tel" value={shipping.phone}
                    onChange={v => setShipping(s => ({ ...s, phone: v }))}
                    placeholder="+1 (555) 000-0000" />
                  <div style={{ height: 16 }} />
                  <FormField label="Street Address" value={shipping.address}
                    onChange={v => setShipping(s => ({ ...s, address: v }))}
                    placeholder="123 Research Blvd" required />
                  <div style={{ height: 16 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                    <FormField label="City" value={shipping.city}
                      onChange={v => setShipping(s => ({ ...s, city: v }))}
                      placeholder="New York" required />
                    <FormField label="State" value={shipping.state}
                      onChange={v => setShipping(s => ({ ...s, state: v }))}
                      placeholder="NY" required />
                    <FormField label="ZIP Code" value={shipping.zip}
                      onChange={v => setShipping(s => ({ ...s, zip: v }))}
                      placeholder="10001" required />
                  </div>
                  <div style={{ height: 16 }} />

                  {/* Disclaimer */}
                  <div style={{
                    display: 'flex', gap: '8px',
                    padding: '12px 14px',
                    background: 'rgba(251,191,36,0.06)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '24px',
                  }}>
                    <Info size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      By ordering you confirm these peptides are for research purposes only and you are a qualified researcher.
                    </p>
                  </div>

                  <button type="submit" style={{
                    width: '100%', padding: '14px',
                    background: 'var(--gradient-primary)',
                    border: 'none', borderRadius: 'var(--radius-md)',
                    color: '#fff', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: 'var(--glow-blue)',
                  }}>
                    Continue to Payment <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 1: Payment */}
            {currentStep === 1 && (
              <div style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: 'rgba(0,207,255,0.1)',
                    border: '1px solid rgba(0,207,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CreditCard size={17} color="var(--primary-blue)" />
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800 }}>
                    Payment Details
                  </h2>
                </div>

                {/* Secure badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px',
                  background: 'rgba(52,211,153,0.06)',
                  border: '1px solid rgba(52,211,153,0.2)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                }}>
                  <Lock size={13} color="#34d399" />
                  <span style={{ fontSize: '0.8rem', color: '#34d399' }}>
                    256-bit SSL encrypted · Your card info is never stored
                  </span>
                </div>

                <form onSubmit={handlePayment}>
                  <FormField label="Cardholder Name" value={payment.cardName}
                    onChange={v => setPayment(p => ({ ...p, cardName: v }))}
                    placeholder="John Doe" required />
                  <div style={{ height: 16 }} />
                  <FormField label="Card Number" value={payment.cardNumber}
                    onChange={v => setPayment(p => ({ ...p, cardNumber: v }))}
                    placeholder="1234 5678 9012 3456" required maxLength={19} />
                  <div style={{ height: 16 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FormField label="Expiry Date" value={payment.expiry}
                      onChange={v => setPayment(p => ({ ...p, expiry: v }))}
                      placeholder="MM / YY" required />
                    <div>
                      <label style={{
                        display: 'block', fontSize: '0.82rem', fontWeight: 500,
                        color: 'var(--text-secondary)', marginBottom: '6px',
                      }}>CVV</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showCvv ? 'text' : 'password'}
                          value={payment.cvv}
                          onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))}
                          placeholder="•••"
                          maxLength={4}
                          required
                          style={{
                            width: '100%', padding: '11px 40px 11px 14px',
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-light)',
                            fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                            outline: 'none',
                          }}
                        />
                        <button type="button" onClick={() => setShowCvv(v => !v)} style={{
                          position: 'absolute', right: '12px', top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none', border: 'none',
                          color: 'var(--text-muted)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                        }}>
                          {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 24 }} />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setCurrentStep(0)} style={{
                      flex: 1, padding: '13px',
                      background: 'none',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-secondary)', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                    }}>← Back</button>
                    <button type="submit" style={{
                      flex: 2, padding: '13px',
                      background: 'var(--gradient-primary)',
                      border: 'none', borderRadius: 'var(--radius-md)',
                      color: '#fff', fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: 'var(--glow-blue)',
                    }}>
                      Review Order <ArrowRight size={15} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Review */}
            {currentStep === 2 && (
              <div style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: 'rgba(52,211,153,0.1)',
                    border: '1px solid rgba(52,211,153,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={17} color="#34d399" />
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800 }}>
                    Review Your Order
                  </h2>
                </div>

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

                {/* Place order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  style={{
                    width: '100%', padding: '15px',
                    background: 'var(--gradient-primary)',
                    border: 'none', borderRadius: 'var(--radius-md)',
                    color: '#fff', fontWeight: 700, fontSize: '1rem',
                    cursor: placingOrder ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: 'var(--glow-blue)',
                    opacity: placingOrder ? 0.8 : 1,
                  }}>
                  {placingOrder ? (
                    <>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      Placing Order…
                    </>
                  ) : (
                    <><Lock size={15} /> Place Order — ${total.toFixed(2)}</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div style={{
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            position: 'sticky',
            top: 'calc(var(--navbar-height) + 20px)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem', fontWeight: 800,
              marginBottom: '20px',
            }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {orderItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 32, height: 32, flexShrink: 0,
                      borderRadius: 'var(--radius-sm)',
                      background: `${item.badgeColor}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={32}
                          height={32}
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        (() => {
                          const Icon = getIconByName(item.iconName);
                          return <Icon size={14} color={item.badgeColor} />;
                        })()
                      )}
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name} × {item.qty}
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--glass-border),transparent)', marginBottom: '16px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              {/* <SummaryRow
                label={`Shipping (free over $${FREE_SHIPPING_THRESHOLD})`}
                value={shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                valueColor={shippingCost === 0 ? '#34d399' : undefined}
              /> */}
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--glass-border),transparent)', marginBottom: '16px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem', fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>${total.toFixed(2)}</span>
            </div>

            {/* Trust — COA removed, updated threshold */}
            <div style={{
              padding: '14px',
              background: 'rgba(0,207,255,0.04)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
            }}>
              {[
                { Icon: ShieldCheck, label: 'Secure 256-bit SSL checkout' },
                // { Icon: Truck, label: `Free shipping over $${FREE_SHIPPING_THRESHOLD}` },
                { Icon: Package, label: 'Orders ship in 24–48 hours' },
              ].map((t, i, arr) => (
                <div key={t.label} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--glass-border)' : 'none',
                  fontSize: '0.78rem', color: 'var(--text-muted)',
                }}>
                  <t.Icon size={13} color="var(--primary-blue)" />
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:768px){
          .checkout-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────── */
function FormField({ label, type = 'text', value, onChange, placeholder, required, maxLength }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '0.82rem', fontWeight: 500,
        color: 'var(--text-secondary)', marginBottom: '6px',
      }}>{label}{required && <span style={{ color: 'var(--pink)', marginLeft: '3px' }}>*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        style={{
          width: '100%', padding: '11px 14px',
          background: 'var(--bg-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-light)',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          outline: 'none',
          transition: 'border-color var(--transition-fast)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
      />
    </div>
  );
}

function ReviewBlock({ title, onEdit, children }) {
  return (
    <div style={{
      padding: '16px',
      background: 'var(--bg-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        <button onClick={onEdit} style={{
          background: 'none', border: 'none',
          color: 'var(--primary-blue)', fontSize: '0.78rem',
          fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>Edit</button>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: valueColor || 'var(--text-light)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

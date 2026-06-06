/* ─────────────────────────────────────────────────────────
   src/app/cart/page.js
   Change: FREE_SHIPPING_THRESHOLD updated from $100 → $225
   ──────────────────────────────────────────────────────── */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight,
  Tag, Truck, ShieldCheck, FlaskConical,
  Beaker, Pill, Dna, ChevronRight, Package,
} from 'lucide-react';
import { allProducts } from '../../data/products';
import { getIconByName } from '../../lib/iconMap';

const FREE_SHIPPING_THRESHOLD = 225;

/* ── Mock cart data ──────────────────────────────────────── */
const initialCartItemIds = [1, 3, 4];
const initialCartQtys = { 1: 2, 3: 1, 4: 1 };

const initialCart = initialCartItemIds.map(id => {
  const product = allProducts.find(p => p.id === id);
  return {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    qty: initialCartQtys[id],
    badgeColor: product.badgeColor,
    iconName: product.iconName,
    image: product.image,
    weight: product.weight,
    inStock: product.inStock,
  };
});

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + delta) }
        : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'RESEARCH10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code.');
      setCouponApplied(false);
    }
  };

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
          <span style={{ color: 'var(--primary-blue)' }}>Cart</span>
        </nav>

        {/* ── Header ── */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--primary-blue)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            <ShoppingCart size={13} /> Your Cart
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 900,
          }}>
            Shopping{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Cart</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* ── Empty state ── */
          <div style={{
            textAlign: 'center', padding: '100px 24px',
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <ShoppingCart size={56} color="var(--text-muted)" style={{ margin: '0 auto 20px', opacity: 0.4 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '12px' }}>
              Your cart is empty
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Browse our research peptide catalogue to get started.
            </p>
            <Link href="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff', fontWeight: 600,
              textDecoration: 'none', fontFamily: 'var(--font-body)',
            }}>
              Browse Shop <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)',
            gap: '32px',
            alignItems: 'start',
          }}>

            {/* ── Cart Items ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Free shipping progress */}
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(0,207,255,0.05)',
                  border: '1px solid rgba(0,207,255,0.15)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Truck size={15} color="var(--primary-blue)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Add <strong style={{ color: 'var(--primary-blue)' }}>${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> more for free shipping
                    </span>
                  </div>
                  <div style={{
                    height: '4px', background: 'var(--glass-border)',
                    borderRadius: '2px', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                      background: 'var(--gradient-primary)',
                      transition: 'width var(--transition-base)',
                      borderRadius: '2px',
                    }} />
                  </div>
                </div>
              )}

              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 16px',
                  background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.25)',
                  borderRadius: 'var(--radius-md)',
                  color: '#34d399', fontSize: '0.85rem', fontWeight: 500,
                }}>
                  <Truck size={15} /> You qualify for free shipping!
                </div>
              )}

              {/* Items */}
              {cartItems.map(item => {
                const Icon = getIconByName(item.iconName);
                return (
                  <div key={item.id} style={{
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '20px',
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                  }}>
                    {/* Image */}
                    <div style={{
                      width: 72, height: 72, flexShrink: 0,
                      borderRadius: 'var(--radius-md)',
                      background: `${item.badgeColor}15`,
                      border: `1px solid ${item.badgeColor}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={72} height={72} style={{ objectFit: 'contain' }} />
                      ) : (
                        <Icon size={28} color={item.badgeColor} />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                        <div>
                          <Link href={`/product/${item.id}`} style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-light)', textDecoration: 'none' }}>
                            {item.name}
                          </Link>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>{item.subtitle}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} style={{
                          background: 'none', border: 'none',
                          color: 'var(--text-muted)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                          transition: 'color var(--transition-fast)',
                          flexShrink: 0,
                        }}
                          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--glass-border)',
                            borderRight: 'none',
                            borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                            color: 'var(--text-light)', cursor: 'pointer',
                          }}>
                            <Minus size={12} />
                          </button>
                          <div style={{
                            width: 40, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--glass-border)',
                            fontWeight: 600, fontSize: '0.85rem',
                          }}>{item.qty}</div>
                          <button onClick={() => updateQty(item.id, 1)} style={{
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--glass-border)',
                            borderLeft: 'none',
                            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                            color: 'var(--text-light)', cursor: 'pointer',
                          }}>
                            <Plus size={12} />
                          </button>
                        </div>

                        <span style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1rem', fontWeight: 800,
                          background: 'var(--gradient-primary)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Continue shopping */}
              <Link href="/shop" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'var(--primary-blue)', fontSize: '0.875rem', fontWeight: 500,
                textDecoration: 'none', padding: '8px 0',
              }}>
                ← Continue Shopping
              </Link>
            </div>

            {/* ── Order Summary ── */}
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
                fontSize: '1.1rem', fontWeight: 800,
                marginBottom: '24px',
              }}>Order Summary</h2>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, minWidth: 0 }}>
                      {item.name} × {item.qty}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', flexShrink: 0 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--glass-border),transparent)', marginBottom: '16px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#34d399' }}>Discount (10%)</span>
                    <span style={{ color: '#34d399' }}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#34d399' : 'var(--text-light)', fontWeight: 500 }}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--glass-border),transparent)', marginBottom: '16px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem', fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>${total.toFixed(2)}</span>
              </div>

              {/* Coupon */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 12px',
                      background: 'var(--bg-dark)',
                      border: `1px solid ${couponError ? 'rgba(239,68,68,0.4)' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-light)',
                      fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                    onBlur={e => e.target.style.borderColor = couponError ? 'rgba(239,68,68,0.4)' : 'var(--glass-border)'}
                  />
                  <button onClick={applyCoupon} style={{
                    padding: '10px 16px',
                    background: 'var(--card-elevated)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)', fontWeight: 500,
                    fontSize: '0.82rem', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    <Tag size={13} /> Apply
                  </button>
                </div>
                {couponError && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '6px' }}>{couponError}</p>}
                {couponApplied && <p style={{ color: '#34d399', fontSize: '0.78rem', marginTop: '6px' }}>✓ Coupon applied — 10% off!</p>}
              </div>

              {/* Checkout */}
              <Link href="/checkout" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', fontFamily: 'var(--font-body)',
                boxShadow: 'var(--glow-blue)',
                marginBottom: '14px',
              }}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {/* Trust row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { Icon: ShieldCheck, label: 'Secure checkout' },
                  { Icon: Truck, label: `Free shipping over $${FREE_SHIPPING_THRESHOLD}` },
                  { Icon: Package, label: 'Ships in 24–48 hours' },
                ].map(({ Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Icon size={12} color="var(--primary-blue)" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
// src/app/cart/page.js

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight,
  Tag, Truck, ShieldCheck, Package, ChevronRight,
  Loader2, AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

const FREE_SHIPPING_THRESHOLD = 225;

export default function CartPage() {
  const {
    cartItems, cartTotal, cartSubtotal, cartLoading,
    updateQuantity, removeItem, applyCoupon, removeCoupon,
    applyingCoupon, cart, notification,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Parse subtotal from WooCommerce string like "$145.00"
  const subtotalNum = parseFloat(cartSubtotal?.replace(/[^0-9.]/g, '') || '0');
  const shippingFree = subtotalNum >= FREE_SHIPPING_THRESHOLD;
  const appliedCoupons = cart?.appliedCoupons || [];

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      await applyCoupon(couponCode.trim());
      setCouponCode('');
    } catch (err) {
      setCouponError('Invalid coupon code');
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* Breadcrumb */}
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '32px',
        }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--primary-blue)' }}>Cart</span>
        </nav>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '8px',
        }}>
          Shopping{' '}
          <span style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Cart</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {cartLoading ? 'Loading…' : `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''}`}
        </p>

        {cartLoading && cartItems.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2 size={36} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: '20px',
          }}>
            <ShoppingCart size={52} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '10px' }}>
              Your cart is empty
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Browse our research peptide catalogue to get started.
            </p>
            <Link href="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px',
              background: 'var(--gradient-primary)',
              borderRadius: '10px',
              color: '#fff', fontWeight: 600, textDecoration: 'none',
              fontFamily: 'var(--font-body)',
            }}>
              Browse Shop <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)',
            gap: '32px', alignItems: 'start',
          }}>

            {/* Cart items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Free shipping progress */}
              {!shippingFree && (
                <div style={{
                  padding: '14px 18px',
                  background: 'rgba(0,207,255,0.05)',
                  border: '1px solid rgba(0,207,255,0.15)',
                  borderRadius: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Truck size={14} color="var(--primary-blue)" />
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      Add <strong style={{ color: 'var(--primary-blue)' }}>
                        ${(FREE_SHIPPING_THRESHOLD - subtotalNum).toFixed(2)}
                      </strong> more for free shipping
                    </span>
                  </div>
                  <div style={{ height: 4, background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (subtotalNum / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                      background: 'var(--gradient-primary)', borderRadius: '2px',
                    }} />
                  </div>
                </div>
              )}

              {shippingFree && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 16px',
                  background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.25)',
                  borderRadius: '10px', color: '#34d399', fontSize: '0.85rem',
                }}>
                  <Truck size={14} /> You qualify for free shipping!
                </div>
              )}

              {/* Items */}
              {cartItems.map(item => {
                const product = item.product?.node;
                const variation = item.variation?.node;
                return (
                  <div key={item.key} style={{
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '18px',
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                  }}>
                    {/* Image */}
                    <div style={{
                      width: 70, height: 70, flexShrink: 0,
                      borderRadius: '10px',
                      background: 'var(--bg-elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {product?.image?.sourceUrl ? (
                        <img src={product.image.sourceUrl} alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Package size={26} color="var(--text-muted)" />
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Link href={`/product/${product?.slug}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-light)' }}>
                            {product?.name}
                          </h3>
                        </Link>
                        <button onClick={() => removeItem(item.key)} style={{
                          background: 'none', border: 'none',
                          color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                        }}
                          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {variation && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          {variation.name}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        {/* Qty */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                          <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            style={{ width: 32, height: 32, background: 'var(--bg-dark)', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ width: 40, textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', background: 'var(--bg-dark)' }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            style={{ width: 32, height: 32, background: 'var(--bg-dark)', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={12} />
                          </button>
                        </div>

                        <span style={{
                          fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800,
                          background: 'var(--gradient-primary)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                          {item.total}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link href="/shop" style={{ color: 'var(--primary-blue)', fontSize: '0.875rem', fontWeight: 500 }}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '28px',
              position: 'sticky',
              top: 'calc(var(--navbar-height) + 20px)',
            }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <SummaryRow label="Subtotal" value={cartSubtotal} />
                {appliedCoupons.map(c => (
                  <SummaryRow key={c.code}
                    label={`Coupon: ${c.code}`}
                    value={`-${c.discountAmount}`}
                    valueColor="#34d399"
                    onRemove={() => removeCoupon(c.code)}
                  />
                ))}
                <SummaryRow
                  label={`Shipping (free over $${FREE_SHIPPING_THRESHOLD})`}
                  value={shippingFree ? 'FREE' : '$9.99'}
                  valueColor={shippingFree ? '#34d399' : undefined}
                />
              </div>

              <div style={{ height: 1, background: 'var(--glass-border)', margin: '14px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{cartTotal}</span>
              </div>

              {/* Coupon */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text" placeholder="Coupon code"
                    value={couponCode} onChange={e => setCouponCode(e.target.value)}
                    style={{
                      flex: 1, padding: '9px 12px',
                      background: 'var(--bg-dark)',
                      border: `1px solid ${couponError ? 'rgba(239,68,68,0.4)' : 'var(--glass-border)'}`,
                      borderRadius: '8px', color: 'var(--text-light)',
                      fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none',
                    }}
                  />
                  <button onClick={handleApplyCoupon} disabled={applyingCoupon} style={{
                    padding: '9px 16px',
                    background: 'var(--card-elevated)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--text-light)', fontWeight: 500, fontSize: '0.82rem',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    <Tag size={13} /> Apply
                  </button>
                </div>
                {couponError && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '5px' }}>{couponError}</p>}
              </div>

              <Link href="/checkout" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '13px',
                background: 'var(--gradient-primary)',
                borderRadius: '10px',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', fontFamily: 'var(--font-body)',
                boxShadow: 'var(--glow-blue)', marginBottom: '14px',
              }}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {/* Trust */}
              {[
                { Icon: ShieldCheck, label: 'Secure checkout' },
                { Icon: Package, label: 'Ships in 24–48 hours' },
              ].map(({ Icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <Icon size={12} color="var(--primary-blue)" /> {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function SummaryRow({ label, value, valueColor, onRemove }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: valueColor || 'var(--text-light)', fontWeight: 500 }}>{value}</span>
        {onRemove && (
          <button onClick={onRemove} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: '0.7rem', padding: '0',
          }}>✕</button>
        )}
      </div>
    </div>
  );
}

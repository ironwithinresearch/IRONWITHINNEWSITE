'use client';
// src/app/cart/page.js

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { decodePriceHtml } from '@/lib/utils';
import { isItemSubscribed } from '@/lib/subscriptions';
import PaymentMethods from '@/components/PaymentMethods';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight,
  Tag, Truck, ShieldCheck, Package, ChevronRight,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
 

export default function CartPage() {
  const {
    cartItems, cartTotal, cartSubtotal, cartLoading, shippingTotal,
    updateQuantity, removeItem, applyCoupon, removeCoupon,
    applyingCoupon, cart, notification,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotalNum = parseFloat(cartSubtotal?.replace(/[^0-9.]/g, '') || '0');
  // Cart total EXCLUDING shipping — shipping is chosen at checkout review, so the
  // cart shouldn't show it (the WC session may already carry a default rate).
  const num = (s) => parseFloat(String(s || '').replace(/&nbsp;/g, '').replace(/[^0-9.]/g, '') || '0');
  const cartTotalNoShipping = `$${Math.max(0, num(cartTotal) - num(shippingTotal)).toFixed(2)}`;
 
  const appliedCoupons = cart?.appliedCoupons || [];

  // Subscribe & Save: count cart items the shopper subscribed to (per product).
  const [subscribedCount, setSubscribedCount] = useState(0);
  useEffect(() => { setSubscribedCount((cartItems || []).filter(isItemSubscribed).length); }, [cartItems]);

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

      {/* Notification toast */}
      {notification && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 9999, padding: '12px 20px', background: notification.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(52,211,153,0.95)', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          {notification.message}
        </div>
      )}

      <div className="container" style={{ paddingTop: '40px' }}>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--primary-blue)' }}>Cart</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '8px' }}>
          Shopping{' '}
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Cart</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {cartLoading ? 'Loading…' : `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''}`}
        </p>

        {cartLoading && cartItems.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2 size={36} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
            <ShoppingCart size={52} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '10px' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Browse our research peptide catalogue to get started.</p>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--gradient-primary)', borderRadius: '10px', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              Browse Shop <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="checkout-grid">

            {/* Cart items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              

              {/* Items */}
              {cartItems.map(item => {
                const product = item.product?.node;
                const variation = item.variation?.node;
                // Get variation attributes for display
                const variationAttrs = variation?.attributes?.nodes || [];
                const isFreeGift = (item.extraData || []).some(e => e.key === 'iw_free_gift' && e.value === '1');

                return (
                  <div key={item.key} style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

                    {/* Image */}
                    <div style={{ width: 70, height: 70, flexShrink: 0, borderRadius: '10px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {product?.image?.sourceUrl ? (
                        <img src={product.image.sourceUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Package size={26} color="var(--text-muted)" />
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <Link href={`/product/${product?.slug}`} style={{ textDecoration: 'none' }}>
                            <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-light)' }}>{product?.name}</h3>
                          </Link>
                          {isFreeGift && (
                            <span style={{ padding: '2px 9px', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.5)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.03em', color: '#34d399', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                              🎁 Free Gift
                            </span>
                          )}
                        </div>
                        {!isFreeGift && (
                          <button onClick={() => removeItem(item.key)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      {/* ── VARIATION ATTRIBUTES — show size/color/etc ── */}
                      {variationAttrs.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {variationAttrs.map((attr, i) => (
                            <span key={i} style={{ padding: '2px 8px', background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.2)', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary-blue)' }}>
                              {attr.name}: {attr.value}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Fallback: show variation name if no attributes */}
                      {variationAttrs.length === 0 && variation?.name && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          {variation.name}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        {/* Qty — free gift is auto-managed, so show a static label */}
                        {isFreeGift ? (
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Qty 1 · added automatically</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                            <button onClick={() => updateQuantity(item.key, item.quantity - 1)} style={{ width: 32, height: 32, background: 'var(--bg-dark)', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Minus size={12} />
                            </button>
                            <span style={{ width: 40, textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', background: 'var(--bg-dark)' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.key, item.quantity + 1)} style={{ width: 32, height: 32, background: 'var(--bg-dark)', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Plus size={12} />
                            </button>
                          </div>
                        )}

                        {/* Price — "FREE" for the gift, otherwise the line total */}
                        {isFreeGift ? (
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>FREE</span>
                        ) : (
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                            dangerouslySetInnerHTML={{ __html: decodePriceHtml(item.total) }} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link href="/shop" style={{ color: 'var(--primary-blue)', fontSize: '0.875rem', fontWeight: 500 }}>← Continue Shopping</Link>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '28px', position: 'sticky', top: 'calc(var(--navbar-height) + 20px)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Order Summary</h2>

            
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <SummaryRow label="Subtotal" rawValue={cartSubtotal} />

                {appliedCoupons.map((c) => {
                  // WooGraphQL sometimes returns an empty per-coupon discountAmount mid-recalc,
                  // which would render a bare "Applied". Fall back to the cart's discountTotal
                  // (exact when a single coupon is applied) so the subtracted amount always shows.
                  const amount = c.discountAmount || (appliedCoupons.length === 1 ? cart?.discountTotal : null);
                  return (
                    <SummaryRow
                      key={c.code}
                      label={`Coupon: ${(c.code || '').toUpperCase()}`}
                      rawValue={amount ? `- ${amount}` : null}
                      value={amount ? undefined : 'Applied'}
                      valueColor="#34d399"
                      onRemove={() => removeCoupon(c.code)}
                    />
                  );
                })}
              </div>

              <div style={{ height: 1, background: 'var(--glass-border)', margin: '14px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {cartTotalNoShipping}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: '0 0 20px' }}>
                Shipping calculated at checkout.
              </p>

              {/* Coupon */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-dark)', border: `1px solid ${couponError ? 'rgba(239,68,68,0.4)' : 'var(--glass-border)'}`, borderRadius: '8px', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none' }} />
                  <button onClick={handleApplyCoupon} disabled={applyingCoupon} style={{ padding: '9px 16px', background: 'var(--card-elevated)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-light)', fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Tag size={13} /> Apply
                  </button>
                </div>
                {couponError && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '5px' }}>{couponError}</p>}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '6px' }}>
                  Gift cards can&apos;t be combined with discount codes.
                </p>
              </div>

              {subscribedCount > 0 && (
                <div style={{ marginBottom: '18px', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--primary-blue)', background: 'rgba(0,207,255,0.06)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  🔁 <strong style={{ color: 'var(--text-light)' }}>Subscribe &amp; Save active</strong> on {subscribedCount} item{subscribedCount > 1 ? 's' : ''} — 10% off + free US shipping. Manage or cancel anytime from your reorder emails.
                </div>
              )}

              <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', background: 'var(--gradient-primary)', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', fontFamily: 'var(--font-body)', boxShadow: 'var(--glow-blue)', marginBottom: '14px' }}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {[
                { Icon: ShieldCheck, label: 'Secure checkout' },
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
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function SummaryRow({ label, value, rawValue, valueColor, onRemove }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {rawValue ? (
          <span style={{ color: valueColor || 'var(--text-light)', fontWeight: 500 }}
            dangerouslySetInnerHTML={{ __html: decodePriceHtml(rawValue) }} />
        ) : (
          <span style={{ color: valueColor || 'var(--text-light)', fontWeight: 500 }}>{value}</span>
        )}
        {onRemove && (
          <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', padding: '0' }}>✕</button>
        )}
      </div>
    </div>
  );
}

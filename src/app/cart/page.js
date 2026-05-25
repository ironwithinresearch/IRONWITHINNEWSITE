'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight,
  Tag, Truck, ShieldCheck, RotateCcw, FlaskConical,
  Beaker, Pill, Dna, ChevronRight, Package,
} from 'lucide-react';
import { allProducts } from '../../data/products';
import { getIconByName } from '../../lib/iconMap';

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
  const [coupon, setCoupon]       = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError]     = useState('');

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

  const subtotal  = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount  = couponApplied ? subtotal * 0.1 : 0;
  const shipping  = subtotal >= 100 ? 0 : 9.99;
  const total     = subtotal - discount + shipping;

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
              {subtotal < 100 && (
                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(0,207,255,0.05)',
                  border: '1px solid rgba(0,207,255,0.15)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Truck size={15} color="var(--primary-blue)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Add <strong style={{ color: 'var(--primary-blue)' }}>${(100 - subtotal).toFixed(2)}</strong> more for free shipping
                    </span>
                  </div>
                  <div style={{
                    height: '4px', background: 'var(--glass-border)',
                    borderRadius: '2px', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (subtotal / 100) * 100)}%`,
                      background: 'var(--gradient-primary)',
                      transition: 'width var(--transition-base)',
                      borderRadius: '2px',
                    }} />
                  </div>
                </div>
              )}

              {subtotal >= 100 && (
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
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQtyChange={updateQty}
                  onRemove={removeItem}
                />
              ))}

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
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', flexShrink: 0 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--glass-border),transparent)', marginBottom: '20px' }} />

              {/* Coupon */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block', fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--text-secondary)', textTransform: 'uppercase',
                  letterSpacing: '0.06em', marginBottom: '8px',
                }}>
                  <Tag size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Coupon Code
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. RESEARCH10"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 12px',
                      background: 'var(--bg-dark)',
                      border: `1px solid ${couponError ? 'rgba(239,68,68,0.4)' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-light)',
                      fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  <button onClick={applyCoupon} style={{
                    padding: '10px 16px',
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff', fontWeight: 600, fontSize: '0.82rem',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                  }}>Apply</button>
                </div>
                {couponError && (
                  <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '6px' }}>{couponError}</p>
                )}
                {couponApplied && (
                  <p style={{ color: '#34d399', fontSize: '0.78rem', marginTop: '6px' }}>
                    ✓ 10% discount applied!
                  </p>
                )}
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--glass-border),transparent)', marginBottom: '20px' }} />

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#34d399' }}>Discount (10%)</span>
                    <span style={{ color: '#34d399' }}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#34d399' : 'var(--text-light)' }}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--glass-border),transparent)', marginBottom: '20px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem', fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '15px',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', fontFamily: 'var(--font-body)',
                boxShadow: 'var(--glow-blue)',
                marginBottom: '16px',
              }}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {/* Trust badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { Icon: ShieldCheck, label: 'Secure' },
                  { Icon: Truck,       label: 'Fast Ship' },
                  { Icon: RotateCcw,   label: 'Easy Returns' },
                ].map(t => (
                  <div key={t.label} style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.72rem', color: 'var(--text-muted)',
                  }}>
                    <t.Icon size={12} color="var(--primary-blue)" />
                    {t.label}
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

/* ── Cart Item Row ────────────────────────────────────────── */
function CartItem({ item, onQtyChange, onRemove }) {
  const { id, name, subtitle, price, qty, badgeColor, iconName, image, weight } = item;
  const Icon = getIconByName(iconName);

  return (
    <div style={{
      background: 'var(--card-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex', gap: '16px', alignItems: 'center',
      flexWrap: 'wrap',
      transition: 'border-color var(--transition-fast)',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,207,255,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
    >
      {/* Icon / Image */}
      <div style={{
        width: 64, height: 64, flexShrink: 0,
        borderRadius: 'var(--radius-md)',
        background: `${badgeColor}15`,
        border: `1px solid ${badgeColor}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {image ? (
          <Image
            src={image}
            alt={name}
            width={'100px'}
            height={'100px'}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          Icon && <Icon size={28} color={badgeColor} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: '160px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800 }}>{name}</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '4px' }}>{subtitle}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Package size={11} color="var(--text-muted)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{weight} per vial</span>
        </div>
      </div>

      {/* Qty control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
        <button onClick={() => onQtyChange(id, -1)} style={{
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-dark)',
          border: '1px solid var(--glass-border)', borderRight: 'none',
          borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
          color: 'var(--text-light)', cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,207,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-dark)'}
        >
          <Minus size={12} />
        </button>
        <div style={{
          width: 40, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-dark)',
          border: '1px solid var(--glass-border)',
          fontWeight: 700, fontSize: '0.88rem',
        }}>{qty}</div>
        <button onClick={() => onQtyChange(id, +1)} style={{
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-dark)',
          border: '1px solid var(--glass-border)', borderLeft: 'none',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          color: 'var(--text-light)', cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,207,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-dark)'}
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Price */}
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '80px' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.05rem', fontWeight: 900,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>${(price * qty).toFixed(2)}</div>
        {qty > 1 && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            ${price.toFixed(2)} each
          </div>
        )}
      </div>

      {/* Remove */}
      <button onClick={() => onRemove(id)} style={{
        width: 34, height: 34, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-muted)', cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#f87171';
          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
          e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.borderColor = 'var(--glass-border)';
          e.currentTarget.style.background = 'none';
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
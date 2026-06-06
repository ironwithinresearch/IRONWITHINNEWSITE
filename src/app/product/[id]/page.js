/* ─────────────────────────────────────────────────────────────
   src/app/product/[id]/page.js
   Changes:
   - Trust row: removed "Easy Returns / 30-day policy" card
   - Trust row: removed "Ships with COA" label — only Lab Verified + Fast Shipping remain
   - Free shipping threshold updated to $225
   ──────────────────────────────────────────────────────────── */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart, Heart, Star, BadgeCheck, ArrowRight,
  ChevronRight, Share2, Shield, Truck,
  Plus, Minus, Package, CheckCircle2, Info, FlaskConical,
} from 'lucide-react';
import { allProducts } from '../../../data/products';
import { getIconByName } from '../../../lib/iconMap';

const relatedProducts = allProducts.slice(0, 3);

export default function ProductDetailPage({ params }) {
  const productId = parseInt(params?.id || '1');
  const product = allProducts.find(p => p.id === productId) || allProducts[0];

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const badgeColor = product.badgeColor || 'var(--primary-blue)';
  const Icon = getIconByName(product.iconName);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const tabs = ['description', 'specifications', 'reviews'];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.82rem', color: 'var(--text-muted)',
          marginBottom: '32px', flexWrap: 'wrap',
        }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >Shop</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--primary-blue)' }}>{product.name}</span>
        </nav>

        {/* ── Main Product Layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: '48px',
          marginBottom: '64px',
          alignItems: 'start',
        }}>

          {/* ── Left: Product Visual ── */}
          <div>
            {/* Main image card */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                width: '200px', height: '200px', borderRadius: '50%',
                background: `radial-gradient(circle, ${badgeColor}25 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div style={{
                position: 'relative', zIndex: 1,
                width: '100%', height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={350}
                    height={350}
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{
                    width: 140, height: 140,
                    borderRadius: 'var(--radius-xl)',
                    background: `${badgeColor}18`,
                    border: `2px solid ${badgeColor}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 40px ${badgeColor}30`,
                  }}>
                    {Icon && <Icon size={64} color={badgeColor} />}
                  </div>
                )}
              </div>
            </div>

            {/* ── Trust row — COA removed, Easy Returns removed ── */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}>
              {[
                { Icon: Shield, label: 'Lab Verified', sub: '3rd-party tested' },
                { Icon: Truck, label: 'Fast Shipping', sub: 'Ships in 24–48hrs' },
              ].map(t => (
                <div key={t.label} style={{
                  background: 'var(--card-dark)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 12px',
                  textAlign: 'center',
                }}>
                  <t.Icon size={18} color="var(--primary-blue)" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '2px' }}>{t.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Category tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px',
              background: `${badgeColor}15`,
              border: `1px solid ${badgeColor}30`,
              borderRadius: '999px',
              fontSize: '0.72rem', fontWeight: 600,
              color: badgeColor,
              width: 'fit-content',
            }}>
              <FlaskConical size={11} />
              {product.category}
            </div>

            {/* Name */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}>{product.name}</h1>
                <BadgeCheck size={22} color="var(--primary-blue)" />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{product.subtitle}</p>
            </div>

            {/* Rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16}
                    fill={i <= Math.round(product.rating) ? '#fbbf24' : 'none'}
                    color={i <= Math.round(product.rating) ? '#fbbf24' : 'var(--text-muted)'}
                  />
                ))}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {product.rating} / 5.0
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ({product.reviews} reviews)
              </span>
              <span style={{
                padding: '3px 10px',
                background: 'rgba(52,211,153,0.12)',
                border: '1px solid rgba(52,211,153,0.3)',
                borderRadius: '999px',
                fontSize: '0.72rem', fontWeight: 600,
                color: '#34d399',
              }}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.4rem', fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', textDecoration: 'line-through' }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    background: 'rgba(236,72,153,0.12)',
                    border: '1px solid rgba(236,72,153,0.3)',
                    borderRadius: '999px',
                    fontSize: '0.78rem', fontWeight: 700,
                    color: 'var(--pink)',
                  }}>
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Purity + weight quick stats */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { label: 'Purity', value: product.purity },
                { label: 'Amount', value: product.weight },
                { label: 'Form', value: 'Lyophilized' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '10px 16px',
                  background: 'var(--card-dark)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem', fontWeight: 800,
                    color: 'var(--primary-blue)',
                  }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Short desc */}
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              padding: '16px',
              background: 'rgba(0,207,255,0.04)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
            }}>{product.desc}</p>

            {/* Disclaimer */}
            <div style={{
              display: 'flex', gap: '8px',
              padding: '12px 14px',
              background: 'rgba(251,191,36,0.06)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: 'var(--radius-md)',
            }}>
              <Info size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                For research purposes only. Not intended for human consumption. Must be handled by qualified researchers.
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.82rem', fontWeight: 600,
                color: 'var(--text-secondary)', marginBottom: '10px',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: 'fit-content' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRight: 'none',
                    borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                    color: 'var(--text-light)', cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,207,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--card-dark)'}
                >
                  <Minus size={14} />
                </button>
                <div style={{
                  width: 52, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--glass-border)',
                  fontWeight: 700, fontSize: '0.95rem',
                }}>{qty}</div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    borderLeft: 'none',
                    borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                    color: 'var(--text-light)', cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,207,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--card-dark)'}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px 24px',
                  background: addedToCart ? 'rgba(52,211,153,0.15)' : 'var(--gradient-primary)',
                  border: addedToCart ? '1px solid rgba(52,211,153,0.4)' : 'none',
                  borderRadius: 'var(--radius-md)',
                  color: addedToCart ? '#34d399' : '#fff',
                  fontWeight: 700, fontSize: '0.95rem',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  boxShadow: addedToCart ? 'none' : 'var(--glow-blue)',
                  transition: 'all var(--transition-base)',
                }}
              >
                {addedToCart ? (
                  <><CheckCircle2 size={16} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={16} /> Add to Cart</>
                )}
              </button>

              <button
                onClick={() => setWishlisted(v => !v)}
                style={{
                  width: 48, height: 48,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: wishlisted ? 'rgba(236,72,153,0.12)' : 'var(--card-dark)',
                  border: `1px solid ${wishlisted ? 'rgba(236,72,153,0.4)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: wishlisted ? 'var(--pink)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  flexShrink: 0,
                }}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Free shipping note */}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Truck size={13} color="var(--primary-blue)" />
              Free shipping on orders over $225
            </p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--glass-border)', marginBottom: '28px' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--primary-blue)' : 'transparent'}`,
                color: activeTab === tab ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)',
                marginBottom: '-1px',
              }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.8,
          }}>
            {activeTab === 'description' && (
              <p>{product.desc || 'No description available.'}</p>
            )}
            {activeTab === 'specifications' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <tbody>
                  {[
                    ['Purity', product.purity],
                    ['Weight', product.weight],
                    ['Form', 'Lyophilized Powder'],
                    ['Storage', '-20°C, dry and away from light'],
                    ['Category', product.category],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--text-light)', width: '40%' }}>{k}</td>
                      <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'reviews' && (
              <p style={{ color: 'var(--text-muted)' }}>Reviews coming soon.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

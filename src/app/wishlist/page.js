'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart, ShoppingCart, Trash2, ArrowRight,
  FlaskConical, Beaker, Pill, Dna, Brain,
  Sparkles, BadgeCheck, Star, Share2,
  Package,
} from 'lucide-react';
import { allProducts, getProductById } from '../../data/products';

/* ── Mock wishlist data ──────────────────────────────────── */
const initialWishlistIds = [1, 2, 3, 7, 9, 4];
const initialWishlist = initialWishlistIds
  .map(id => getProductById(id))
  .filter(Boolean);

export default function WishlistPage() {
  const [items, setItems]   = useState(initialWishlist);
  const [cartAdded, setCartAdded] = useState({});

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const addToCart = (id) => {
    setCartAdded(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCartAdded(prev => ({ ...prev, [id]: false })), 2000);
  };

  const clearAll = () => setItems([]);

  const inStockCount    = items.filter(i => i.inStock).length;
  const outOfStockCount = items.filter(i => !i.inStock).length;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--pink)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            <Heart size={13} /> Saved Items
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900,
          }}>
            My{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Wishlist</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            {items.length} saved items · {inStockCount} in stock
          </p>
        </div>
      </div>

      <div className="container">

        {items.length === 0 ? (
          /* ── Empty state ── */
          <div style={{
            textAlign: 'center', padding: '100px 24px',
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <Heart size={56} color="var(--text-muted)"
              style={{ margin: '0 auto 20px', opacity: 0.3 }} />
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem', marginBottom: '12px',
            }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Save peptides you're interested in for easy access later.
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
          <>
            {/* ── Toolbar ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '24px',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Add all in stock to cart */}
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 20px',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  boxShadow: 'var(--glow-sm)',
                  transition: 'all var(--transition-base)',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--glow-blue)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--glow-sm)'}
                >
                  <ShoppingCart size={15} /> Add All to Cart ({inStockCount})
                </button>

                {/* Share */}
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 18px',
                  background: 'transparent',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'all var(--transition-fast)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <Share2 size={14} /> Share List
                </button>
              </div>

              {/* Clear all */}
              <button onClick={clearAll} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '9px 16px',
                background: 'transparent',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 'var(--radius-md)',
                color: '#f87171', fontWeight: 500, fontSize: '0.82rem',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Trash2 size={13} /> Clear All
              </button>
            </div>

            {/* ── Out of stock notice ── */}
            {outOfStockCount > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', marginBottom: '20px',
                background: 'rgba(251,191,36,0.06)',
                border: '1px solid rgba(251,191,36,0.2)',
                borderRadius: 'var(--radius-md)',
              }}>
                <Package size={15} color="#fbbf24" />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#fbbf24' }}>{outOfStockCount} item{outOfStockCount > 1 ? 's' : ''}</strong> in your wishlist {outOfStockCount > 1 ? 'are' : 'is'} currently out of stock. We'll notify you when available.
                </p>
              </div>
            )}

            {/* ── Grid ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {items.map(item => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onAddToCart={addToCart}
                  added={!!cartAdded[item.id]}
                />
              ))}
            </div>

            {/* ── You might also like ── */}
            <div style={{ marginTop: '56px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '24px',
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontWeight: 800,
                }}>
                  You Might{' '}
                  <span style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>Also Like</span>
                </h2>
                <Link href="/shop" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  color: 'var(--primary-blue)', fontSize: '0.875rem', fontWeight: 500,
                  textDecoration: 'none',
                }}>
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
              }}>
                {[
                  { id: 5,  name: 'Ipamorelin',  subtitle: 'GH Secretagogue',       price: 44.99, Icon: FlaskConical, badgeColor: 'var(--primary-blue)' },
                  { id: 8,  name: 'Semax',        subtitle: 'Cognitive Enhancer',    price: 42.99, Icon: Brain,        badgeColor: 'var(--purple)' },
                  { id: 10, name: 'Follistatin',  subtitle: 'Myostatin Inhibitor',   price: 94.99, Icon: Dna,          badgeColor: '#fbbf24' },
                ].map(p => (
                  <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--card-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '18px',
                      display: 'flex', gap: '14px', alignItems: 'center',
                      transition: 'all var(--transition-base)',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = 'var(--glow-blue)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        width: 48, height: 48, flexShrink: 0,
                        borderRadius: 'var(--radius-md)',
                        background: `${p.badgeColor}15`,
                        border: `1px solid ${p.badgeColor}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <p.Icon size={22} color={p.badgeColor} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '2px' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{p.subtitle}</div>
                        <div style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.9rem', fontWeight: 800,
                          background: 'var(--gradient-primary)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>${p.price.toFixed(2)}</div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Wishlist Card ────────────────────────────────────────── */
function WishlistCard({ item, onRemove, onAddToCart, added }) {
  const {
    id, name, subtitle, price, originalPrice,
    badge, badgeColor = 'var(--primary-blue)',
    image, rating, reviews, inStock, desc,
  } = item;

  return (
    <div style={{
      background: 'var(--card-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      transition: 'all var(--transition-base)',
      opacity: inStock ? 1 : 0.8,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.28)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3), 0 0 20px rgba(0,207,255,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image area */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))',
       
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '160px',
        borderBottom: '1px solid var(--glass-border)',
        overflow: 'hidden',
      }}>
         

       
          {image ? (
            <Image
              src={image}
              alt={name}
              width={'100%'}
              height={100}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : null}
        

        {/* Remove button */}
        <button
          onClick={() => onRemove(id)}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '50%',
            color: 'var(--text-muted)', cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.background = 'var(--glass-bg)';
          }}
        >
          <Trash2 size={13} />
        </button>

        
 
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(2,6,23,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700,
            color: 'var(--text-muted)', letterSpacing: '0.1em',
          }}>OUT OF STOCK</div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem', fontWeight: 800, color: 'var(--text-light)',
            }}>{name}</h3>
            <BadgeCheck size={13} color="var(--primary-blue)" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{subtitle}</p>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={11}
                fill={i <= Math.round(rating) ? '#fbbf24' : 'none'}
                color={i <= Math.round(rating) ? '#fbbf24' : 'var(--text-muted)'}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
            {rating} ({reviews})
          </span>
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.82rem', lineHeight: 1.6, flex: 1,
        }}>{desc}</p>

        {/* Price + actions */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--glass-border)',
          gap: '8px',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem', fontWeight: 900,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>${price.toFixed(2)}</div>
            {originalPrice && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ${originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '7px' }}>
            <button
              onClick={() => onAddToCart(id)}
              disabled={!inStock}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', height: 34,
                background: added
                  ? 'linear-gradient(135deg,#34d399,#059669)'
                  : 'rgba(0,207,255,0.1)',
                border: `1px solid ${added ? 'rgba(52,211,153,0.4)' : 'rgba(0,207,255,0.25)'}`,
                borderRadius: 'var(--radius-md)',
                color: added ? '#fff' : 'var(--primary-blue)',
                fontSize: '0.78rem', fontWeight: 600,
                cursor: inStock ? 'pointer' : 'not-allowed',
                opacity: inStock ? 1 : 0.4,
                transition: 'all var(--transition-base)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (inStock && !added) e.currentTarget.style.background = 'rgba(0,207,255,0.18)'; }}
              onMouseLeave={e => { if (!added) e.currentTarget.style.background = 'rgba(0,207,255,0.1)'; }}
            >
              <ShoppingCart size={13} />
              {added ? 'Added!' : 'Add to Cart'}
            </button>

            <Link href={`/product/${id}`} style={{
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
              flexShrink: 0,
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--glow-blue)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
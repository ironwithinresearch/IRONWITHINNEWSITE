'use client';
// src/app/wishlist/page.js

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight, FlaskConical, Package } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { decodePriceHtml } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [cartAdded, setCartAdded] = useState({});

  const handleAddToCart = async (item) => {
    if (!item.databaseId) return;
    await addToCart(item.databaseId, 1);
    setCartAdded(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setCartAdded(prev => ({ ...prev, [item.id]: false })), 2000);
  };

  const handleAddAllToCart = async () => {
    const inStock = wishlistItems.filter(i => i.stockStatus === 'IN_STOCK');
    for (const item of inStock) {
      await addToCart(item.databaseId, 1);
    }
  };

  const inStockCount = wishlistItems.filter(i => i.stockStatus === 'IN_STOCK').length;
  const outOfStockCount = wishlistItems.filter(i => i.stockStatus !== 'IN_STOCK').length;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      <div className="page-header">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--pink)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            <Heart size={13} /> Saved Items
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900 }}>
            My{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Wishlist</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            {wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''} · {inStockCount} in stock
          </p>
        </div>
      </div>

      <div className="container">
        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 24px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
            <Heart size={56} color="var(--text-muted)" style={{ margin: '0 auto 20px', opacity: 0.3 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '12px' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Save products you're interested in for easy access later.
            </p>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              Browse Shop <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={handleAddAllToCart} disabled={inStockCount === 0}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', background: 'var(--gradient-primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: inStockCount > 0 ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', opacity: inStockCount === 0 ? 0.5 : 1 }}>
                <ShoppingCart size={15} /> Add All to Cart ({inStockCount})
              </button>
              <button onClick={clearWishlist}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'transparent', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', color: '#f87171', fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Trash2 size={13} /> Clear All
              </button>
            </div>

            {outOfStockCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', marginBottom: '20px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 'var(--radius-md)' }}>
                <Package size={15} color="#fbbf24" />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#fbbf24' }}>{outOfStockCount} item{outOfStockCount > 1 ? 's' : ''}</strong> {outOfStockCount > 1 ? 'are' : 'is'} currently out of stock.
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {wishlistItems.map(item => (
                <div key={item.id} style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease', opacity: item.stockStatus !== 'IN_STOCK' ? 0.8 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.28)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                  {/* Image */}
                  <div style={{ position: 'relative', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'contain', padding: '12px' }} />
                    ) : (
                      <FlaskConical size={48} color="var(--primary-blue)" style={{ opacity: 0.25 }} />
                    )}
                    {item.stockStatus !== 'IN_STOCK' && (
                      <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 600, color: '#f87171' }}>
                        Out of Stock
                      </div>
                    )}
                    <button onClick={() => removeFromWishlist(item.id)}
                      style={{ position: 'absolute', top: '10px', right: '10px', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href={`/product/${item.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-light)', lineHeight: 1.3 }}>{item.name}</h3>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      {/* ── Fixed price — no more &nbsp; showing as text ── */}
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                        dangerouslySetInnerHTML={{ __html: decodePriceHtml(item.price) || '—' }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: '999px', background: item.stockStatus === 'IN_STOCK' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${item.stockStatus === 'IN_STOCK' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`, color: item.stockStatus === 'IN_STOCK' ? '#34d399' : '#f87171' }}>
                        {item.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleAddToCart(item)} disabled={item.stockStatus !== 'IN_STOCK' || cartAdded[item.id]}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: cartAdded[item.id] ? 'rgba(52,211,153,0.15)' : item.stockStatus === 'IN_STOCK' ? 'var(--gradient-primary)' : 'var(--card-elevated)', border: cartAdded[item.id] ? '1px solid rgba(52,211,153,0.4)' : 'none', borderRadius: '8px', color: cartAdded[item.id] ? '#34d399' : item.stockStatus === 'IN_STOCK' ? '#fff' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem', cursor: item.stockStatus === 'IN_STOCK' ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', opacity: item.stockStatus !== 'IN_STOCK' ? 0.5 : 1 }}>
                        <ShoppingCart size={13} />
                        {cartAdded[item.id] ? 'Added!' : item.stockStatus === 'IN_STOCK' ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <Link href={`/product/${item.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, background: 'var(--card-elevated)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

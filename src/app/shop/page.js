'use client';
// src/app/shop/page.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_CATEGORIES } from '../../lib/queries/products';
import { useCart } from '../../context/CartContext';
import {
  FlaskConical, ShoppingCart, Search,
  ChevronDown, Loader2, AlertCircle, Package,
  Wifi, RefreshCw,
} from 'lucide-react';

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const { addToCart, addingToCart, notification } = useCart();

  // Fetch categories
  const { data: catData } = useQuery(GET_CATEGORIES, {
    onError: () => {}, // suppress — categories are optional
  });
  const categories = catData?.productCategories?.nodes || [];

  // ── Fetch products — simplified query (no status filter) ──
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      first: 20,
      after: null,
      category: activeCategory || null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo;

  // Client-side search
  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const loadMore = () => {
    if (!pageInfo?.endCursor) return;
    refetch({ first: 20, after: pageInfo.endCursor, category: activeCategory || null });
  };

  // Detect error type
  const isCorsError = error?.networkError?.message?.includes('allowlist') ||
    error?.networkError?.statusCode === 0 ||
    error?.message?.includes('allowlist') ||
    error?.message?.includes('CORS') ||
    error?.message?.includes('Failed to fetch') ||
    error?.networkError?.result === 'Host not in allowlist';

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* Cart notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 200,
          padding: '12px 20px',
          background: notification.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(52,211,153,0.15)',
          border: `1px solid ${notification.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(52,211,153,0.4)'}`,
          borderRadius: '10px',
          color: notification.type === 'error' ? '#f87171' : '#34d399',
          fontWeight: 500, fontSize: '0.875rem',
          backdropFilter: 'blur(12px)',
        }}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <section style={{ padding: '60px 24px 40px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center top, rgba(0,207,255,0.07) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-blue)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            <FlaskConical size={13} /> Research Catalogue
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '10px' }}>
            All{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Products</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {loading ? 'Loading…' : `${filtered.length} compounds available · 99.3%+ purity guaranteed`}
          </p>
        </div>
      </section>

      <div className="container">

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={15} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text" placeholder="Search products…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 36px',
                background: 'var(--card-dark)', border: '1px solid var(--glass-border)',
                borderRadius: '10px', color: 'var(--text-light)',
                fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {categories.length > 0 && (
            <div style={{ position: 'relative' }}>
              <select
                value={activeCategory}
                onChange={e => setActiveCategory(e.target.value)}
                style={{
                  padding: '10px 36px 10px 14px',
                  background: 'var(--card-dark)', border: '1px solid var(--glass-border)',
                  borderRadius: '10px', color: 'var(--text-light)',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  outline: 'none', cursor: 'pointer', appearance: 'none',
                }}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name} ({c.count})</option>
                ))}
              </select>
              <ChevronDown size={14} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
            </div>
          )}
        </div>

        {/* ── ERROR STATE — shows specific error message ── */}
        {error && (
          <div style={{
            padding: '28px 24px', marginBottom: '24px',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {isCorsError
                ? <Wifi size={22} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
                : <AlertCircle size={22} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
              }
              <div style={{ flex: 1 }}>
                <p style={{ color: '#f87171', fontWeight: 700, marginBottom: '6px', fontSize: '0.95rem' }}>
                  {isCorsError ? 'CORS Error — Backend Not Whitelisted' : 'GraphQL Error'}
                </p>
                <p style={{ color: 'rgba(248,113,113,0.8)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '12px' }}>
                  {isCorsError ? (
                    <>
                      Your WordPress backend is blocking requests from <code style={{ background: 'rgba(239,68,68,0.1)', padding: '1px 6px', borderRadius: '4px' }}>localhost:3000</code>.
                      {' '}You need to add it to the CORS allowlist.
                    </>
                  ) : (
                    error.message
                  )}
                </p>

                {isCorsError && (
                  <div style={{
                    background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
                    padding: '14px 16px', marginBottom: '14px',
                  }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Fix — Add to WordPress functions.php
                    </p>
                    <pre style={{
                      fontSize: '0.75rem', color: '#34d399', lineHeight: 1.6,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                      fontFamily: 'monospace', margin: 0,
                    }}>{`add_filter('graphql_response_headers_to_send', function($headers) {
  $allowed = [
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if (in_array($origin, $allowed)) {
    $headers['Access-Control-Allow-Origin'] = $origin;
    $headers['Access-Control-Allow-Credentials'] = 'true';
    $headers['Access-Control-Allow-Headers'] = 
      'Authorization, Content-Type, woocommerce-session';
  }
  return $headers;
});`}</pre>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => refetch()} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px',
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '8px', color: '#f87171',
                    fontWeight: 500, fontSize: '0.82rem',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                    <RefreshCw size={13} /> Retry
                  </button>
                  <a
                    href="https://bhidasowgm.onrocket.site/wp-admin/admin.php?page=graphql-settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px',
                      background: 'transparent',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px', color: 'var(--text-muted)',
                      fontWeight: 500, fontSize: '0.82rem',
                      textDecoration: 'none', fontFamily: 'var(--font-body)',
                    }}
                  >
                    Open WPGraphQL Settings ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && products.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <Loader2 size={36} color="var(--primary-blue)" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Connecting to backend…</p>
            </div>
          </div>
        )}

        {/* Products grid */}
        {filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px', marginBottom: '40px',
          }}>
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product.databaseId, 1)}
                addingToCart={addingToCart}
              />
            ))}
          </div>
        )}

        {/* Empty — no error, just no products */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No products found</p>
            <button onClick={() => { setSearch(''); setActiveCategory(''); }} style={{
              padding: '10px 24px', background: 'var(--gradient-primary)',
              border: 'none', borderRadius: '10px',
              color: '#fff', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}>Clear Filters</button>
          </div>
        )}

        {/* Load more */}
        {pageInfo?.hasNextPage && !error && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={loadMore} disabled={loading} style={{
              padding: '12px 32px',
              background: 'transparent', border: '1px solid var(--glass-border)',
              borderRadius: '10px', color: 'var(--text-light)',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              Load More
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product, onAddToCart, addingToCart }) {
  const price = product.price || '';
  const inStock = product.__typename === 'SimpleProduct'
    ? product.stockStatus === 'IN_STOCK'
    : true;

  return (
    <div style={{
      background: 'var(--card-dark)', border: '1px solid var(--glass-border)',
      borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div style={{
          height: '180px',
          background: 'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', cursor: 'pointer',
        }}>
          {product.image?.sourceUrl ? (
            <img
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              style={{ maxHeight: '150px', objectFit: 'contain' }}
            />
          ) : (
            <FlaskConical size={52} color="var(--primary-blue)" style={{ opacity: 0.3 }} />
          )}
          {!inStock && (
            <div style={{
              position: 'absolute', top: '10px', right: '10px',
              padding: '3px 10px',
              background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, color: '#f87171',
            }}>Out of Stock</div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '18px' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          {product.productCategories?.nodes?.[0]?.name || 'Research'}
        </span>
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800,
            margin: '4px 0', color: 'var(--text-light)',
          }}>{product.name}</h3>
        </Link>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5,
          marginBottom: '14px',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.shortDescription?.replace(/<[^>]+>/g, '') || ''}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 900,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
            dangerouslySetInnerHTML={{ __html: price }}
          />
          <button
            onClick={onAddToCart}
            disabled={!inStock || addingToCart}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              background: inStock ? 'var(--gradient-primary)' : 'var(--card-elevated)',
              border: 'none', borderRadius: '8px',
              color: inStock ? '#fff' : 'var(--text-muted)',
              fontWeight: 600, fontSize: '0.8rem',
              cursor: inStock ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-body)',
              opacity: addingToCart ? 0.7 : 1,
            }}
          >
            <ShoppingCart size={13} />
            {inStock ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}

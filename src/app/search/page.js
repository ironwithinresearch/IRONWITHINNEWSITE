'use client';
// src/app/search/page.js

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_CATEGORIES } from '@/lib/queries/products';
import { useCart } from '@/context/CartContext';
import { decodePriceHtml } from '@/lib/utils';
import {
  Search, FlaskConical, ArrowRight, BadgeCheck,
  ShoppingCart, X, Loader2, CheckCircle2, Tag,
} from 'lucide-react';

const accentColors = [
  'var(--primary-blue)', 'var(--purple)', 'var(--pink)',
  '#34d399', '#fbbf24', 'var(--secondary-blue)',
  '#f87171', '#a78bfa', '#38bdf8',
];

// ── Inner component that uses useSearchParams ──
function SearchInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [inputVal, setInputVal]             = useState(initialQuery);
  const [query, setQuery]                   = useState(initialQuery);
  const [addedItems, setAddedItems]         = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchMode, setSearchMode]         = useState('text');

  const { addToCart } = useCart();

  // ── Fetch categories ──────────────────────────────────────────
  const { data: catData, loading: catLoading } = useQuery(GET_CATEGORIES, {
    fetchPolicy: 'cache-first',
  });
  const categories = catData?.productCategories?.nodes || [];
  const popularSearches = categories.slice(0, 5).map(c => c.name);

  // ── Product search ────────────────────────────────────────────
  const [searchProducts, { data, loading: searchLoading }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: 'network-only',
  });

  // Debounce free-text input → text search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchMode === 'text') {
        setQuery(inputVal);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [inputVal, searchMode]);

  // Fire the correct query whenever query / searchMode changes
  useEffect(() => {
    if (query.trim().length > 1) {
      if (searchMode === 'category') {
        searchProducts({ variables: { first: 48, category: query.trim() } });
      } else {
        searchProducts({ variables: { first: 24, search: query.trim() } });
      }
    }
  }, [query, searchMode, searchProducts]);

  const products = data?.products?.nodes || [];

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.databaseId, 1);
    if (result?.success !== false) {
      setAddedItems(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 2000);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.slug);
    setInputVal(cat.name);
    setSearchMode('category');
    setQuery(cat.slug);
  };

  const handlePopularClick = (term) => {
    setActiveCategory(null);
    setSearchMode('text');
    setInputVal(term);
    setQuery(term);
  };

  const clearSearch = () => {
    setInputVal('');
    setQuery('');
    setActiveCategory(null);
    setSearchMode('text');
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    setSearchMode('text');
    setActiveCategory(null);
  };

  const hasQuery = query.trim().length > 1;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Search Hero ── */}
      <div style={{ padding: '80px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center top, rgba(0,207,255,0.07) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-blue)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
            <Search size={13} /> Site Search
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '28px' }}>
            Search{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Products</span>
          </h1>

          <div style={{ position: 'relative', maxWidth: '580px', margin: '0 auto' }}>
            <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              autoFocus
              value={inputVal}
              onChange={handleInputChange}
              placeholder="Search products…"
              style={{ width: '100%', padding: '16px 50px', background: 'var(--card-dark)', border: '1px solid var(--primary-blue)', borderRadius: 'var(--radius-lg)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '1rem', outline: 'none', boxShadow: 'var(--glow-sm)', boxSizing: 'border-box' }}
            />
            {inputVal && (
              <button onClick={clearSearch} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <X size={16} />
              </button>
            )}
          </div>

          {activeCategory && (
            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.3)', borderRadius: '999px', fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
              <Tag size={11} /> Browsing category: {inputVal}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: '36px' }}>

        {/* ── Empty / Browse state ── */}
        {!hasQuery && (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '36px', textAlign: 'center' }}>
              Start typing or pick a category below.
            </p>

            {catLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
                <Loader2 size={18} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : popularSearches.length > 0 && (
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Popular Searches</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {popularSearches.map(term => (
                    <button key={term} onClick={() => handlePopularClick(term)}
                      style={{ padding: '8px 16px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '999px', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '48px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', textAlign: 'center' }}>Browse by Category</p>
              {catLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ height: 70, background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', opacity: 0.5 }} />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No categories found.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {categories.map(({ id, name, slug, count, image }, idx) => {
                    const color = accentColors[idx % accentColors.length];
                    return (
                      <button key={id} onClick={() => handleCategoryClick({ name, slug, color })}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.18s ease', textAlign: 'left', width: '100%' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 18px ${color}33`; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                          {image?.sourceUrl ? (
                            <img src={image.sourceUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Tag size={16} color={color} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                          {count != null && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{count} product{count !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                        <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Results state ── */}
        {hasQuery && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                {searchLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Searching…
                  </div>
                ) : (
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800 }}>
                    {products.length > 0
                      ? <>{products.length} result{products.length !== 1 ? 's' : ''} for "<span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{inputVal}</span>"</>
                      : <>No results for "<span style={{ color: 'var(--text-muted)' }}>{inputVal}</span>"</>
                    }
                  </h2>
                )}
              </div>

              {categories.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {categories.map(({ id, name, slug }, idx) => {
                    const color = accentColors[idx % accentColors.length];
                    const isActive = activeCategory === slug;
                    return (
                      <button key={id} onClick={() => handleCategoryClick({ name, slug, color })}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: isActive ? `${color}22` : 'var(--card-dark)', border: `1px solid ${isActive ? color : 'var(--glass-border)'}`, borderRadius: '999px', color: isActive ? color : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; } }}
                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}>
                        <Tag size={10} />
                        {name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!searchLoading && products.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
                <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '10px' }}>No results found</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', margin: '0 auto 24px' }}>Try different keywords or browse our shop.</p>
                <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 22px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                  Browse Shop <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {products.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                {products.map(product => {
                  const isVariable = product.__typename === 'VariableProduct';
                  const inStock = isVariable
                    ? product.variations?.nodes?.some(v => v.stockStatus === 'IN_STOCK')
                    : product.stockStatus === 'IN_STOCK';
                  const onBackorder = !inStock && (isVariable
                    ? product.variations?.nodes?.some(v => v.stockStatus === 'ON_BACKORDER')
                    : product.stockStatus === 'ON_BACKORDER');
                  const buyable = inStock || onBackorder;
                  const added = addedItems[product.id];

                  return (
                    <div key={product.id}
                      style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--glow-blue)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {product.image?.sourceUrl ? (
                            <img src={product.image.sourceUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <FlaskConical size={22} color="var(--primary-blue)" style={{ opacity: 0.4 }} />
                          )}
                        </div>
                      </Link>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-light)' }}>{product.name}</span>
                            <BadgeCheck size={12} color="var(--primary-blue)" />
                          </div>
                        </Link>
                        {product.shortDescription && (
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                            dangerouslySetInnerHTML={{ __html: decodePriceHtml(product.price) || '—' }} />
                          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: inStock ? '#34d399' : onBackorder ? '#fbbf24' : '#f87171' }}>
                            {inStock ? '● In Stock' : onBackorder ? '● Backorder' : '● Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {isVariable ? (
                        <Link href={`/product/${product.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'var(--card-elevated)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', textDecoration: 'none', flexShrink: 0 }}>
                          <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <button onClick={() => handleAddToCart(product)} disabled={!buyable || added}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: added ? 'rgba(52,211,153,0.15)' : buyable ? 'var(--gradient-primary)' : 'var(--card-elevated)', border: added ? '1px solid rgba(52,211,153,0.4)' : 'none', borderRadius: 'var(--radius-md)', color: added ? '#34d399' : buyable ? '#fff' : 'var(--text-muted)', cursor: buyable ? 'pointer' : 'not-allowed', flexShrink: 0, opacity: !buyable ? 0.5 : 1 }}>
                          {added ? <CheckCircle2 size={14} /> : <ShoppingCart size={14} />}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Default export wrapped in Suspense ──
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          Loading…
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <SearchInner />
    </Suspense>
  );
}
'use client';
// src/app/shop/page.js

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { GET_PRODUCTS, GET_CATEGORIES } from '@/lib/queries/products';
import { decodePriceHtml } from '@/lib/utils';
import {
  FlaskConical, Search, ShoppingCart, Package,
  Loader2, ChevronRight, AlertCircle,
  CheckCircle2, Heart,
} from 'lucide-react';

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [addedItems, setAddedItems] = useState({});

  const { addToCart, notification } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const { data: catData } = useQuery(GET_CATEGORIES);
  const categories = catData?.productCategories?.nodes || [];

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: {
      first: 100,
      category: activeCategory || undefined,
      search: search || undefined,
    },
    fetchPolicy: 'cache-and-network',
  });

  const products = [...(data?.products?.nodes || [])].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleAddToCart = async (product) => {
    if (!product.databaseId) return;
    const result = await addToCart(product.databaseId, 1);
    if (result?.success !== false) {
      setAddedItems(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 2000);
    }
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* Notification toast */}
      {notification && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 9999, padding: '12px 20px', background: notification.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(52,211,153,0.95)', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Research <span className="gradient-text">Catalogue</span></h1>
          <p>Pharmaceutical-grade peptides, independently verified for purity and potency.</p>
        </div>
      </div>

      <div className="container">

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '32px', maxWidth: '520px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search products…" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              style={{ width: '100%', padding: '11px 14px 11px 40px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'} />
          </div>
          <button type="submit" style={{ padding: '11px 20px', background: 'var(--gradient-primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} style={{ padding: '11px 14px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Clear</button>
          )}
        </form>

        {/* Category filters */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button onClick={() => setActiveCategory('')} style={{ padding: '7px 16px', borderRadius: '999px', background: !activeCategory ? 'var(--gradient-primary)' : 'var(--card-dark)', color: !activeCategory ? '#fff' : 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: !activeCategory ? 'none' : '1px solid var(--glass-border)' }}>All</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.slug)} style={{ padding: '7px 16px', borderRadius: '999px', background: activeCategory === cat.slug ? 'var(--gradient-primary)' : 'var(--card-dark)', color: activeCategory === cat.slug ? '#fff' : 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: activeCategory === cat.slug ? 'none' : '1px solid var(--glass-border)' }}>
                {cat.name} {cat.count ? `(${cat.count})` : ''}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && products.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <Loader2 size={36} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: '20px 24px', marginBottom: '24px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} /> Failed to load products. Please refresh the page.
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>No products found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try a different search or category.</p>
          </div>
        )}

        {/* Products grid */}
        {products.length > 0 && (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
              {search && <> for "<span style={{ color: 'var(--primary-blue)' }}>{search}</span>"</>}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {products.map(product => {
                const isVariable = product.__typename === 'VariableProduct';
                const inStock = isVariable
                  ? product.variations?.nodes?.some(v => v.stockStatus === 'IN_STOCK')
                  : product.stockStatus === 'IN_STOCK';
                const added = addedItems[product.id];
                const wishlisted = isWishlisted(product.id);

                return (
                  <div key={product.id} style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease', position: 'relative' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                    {/* ── Wishlist heart button ── */}
                    <button
                      onClick={(e) => handleWishlist(e, product)}
                      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: wishlisted ? 'rgba(236,72,153,0.15)' : 'rgba(5,7,18,0.55)', border: `1px solid ${wishlisted ? 'rgba(236,72,153,0.5)' : 'var(--glass-border)'}`, borderRadius: '8px', color: wishlisted ? 'var(--pink, #ec4899)' : 'var(--text-muted)', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(236,72,153,0.15)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.5)'; e.currentTarget.style.color = '#ec4899'; }}
                      onMouseLeave={e => { if (!wishlisted) { e.currentTarget.style.background = 'rgba(5,7,18,0.55)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}>
                      <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>

                    {/* Image */}
                    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{ height: 200, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                        {product.image?.sourceUrl ? (
                          <img src={product.image.sourceUrl} alt={product.image.altText || product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
                        ) : (
                          <FlaskConical size={52} color="var(--primary-blue)" style={{ opacity: 0.25 }} />
                        )}
                        {!inStock ? (
                          <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 600, color: '#f87171' }}>Out of Stock</div>
                        ) : isVariable ? (
                          <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 600, color: 'var(--purple)' }}>Options</div>
                        ) : null}
                      </div>
                    </Link>

                    {/* Content */}
                    <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {product.productCategories?.nodes?.[0] && (
                        <p style={{ fontSize: '0.7rem', color: 'var(--primary-blue)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {product.productCategories.nodes[0].name}
                        </p>
                      )}

                      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-light)', lineHeight: 1.3 }}>{product.name}</h3>
                      </Link>

                      {product.shortDescription && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5, marginBottom: '14px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '10px' }}>
                        {/* ── Fixed price display ── */}
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                          dangerouslySetInnerHTML={{ __html: decodePriceHtml(product.price) || 'View Product' }} />

                        {isVariable ? (
                          <Link href={`/product/${product.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', background: 'var(--gradient-primary)', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                            Select <ChevronRight size={13} />
                          </Link>
                        ) : (
                          <button onClick={() => handleAddToCart(product)} disabled={!inStock || added}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', background: added ? 'rgba(52,211,153,0.15)' : inStock ? 'var(--gradient-primary)' : 'var(--card-elevated)', border: added ? '1px solid rgba(52,211,153,0.4)' : 'none', borderRadius: '8px', color: added ? '#34d399' : inStock ? '#fff' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', cursor: inStock ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', opacity: !inStock ? 0.6 : 1 }}>
                            {added ? <><CheckCircle2 size={13} /> Added</> : <><ShoppingCart size={13} /> {inStock ? 'Add' : 'N/A'}</>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

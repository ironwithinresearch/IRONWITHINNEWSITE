'use client';

import { useState } from 'react';
import {
  SlidersHorizontal,
  Search,
  ShoppingCart,
  Heart,
  BadgeCheck,
  Star,
  ChevronDown,
  X,
  Microscope,
  FlaskConical,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import SectionHeader from '../../components/ui/SectionHeader';
import { allProducts } from '../../data/products';
import { getIconByName } from '../../lib/iconMap';

const categories = [
  'All',
  'Healing & Recovery',
  'Metabolic Research',
  'Cognitive Peptides',
  'Anti-Aging',
  'Performance',
  'Hormonal Research',
];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low–High', value: 'price-asc' },
  { label: 'Price: High–Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Reviews', value: 'reviews' },
];

/* ── Page ────────────────────────────────────────────────── */
export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState(100);
  const [inStockOnly, setInStockOnly] = useState(false);

  /* Filter + sort */
  let filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice = p.price <= priceMax;
    const matchStock = !inStockOnly || p.inStock;
    return matchCat && matchSearch && matchPrice && matchStock;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviews - a.reviews;
    return 0;
  });

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--primary-blue)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            <FlaskConical size={13} /> All Products
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            marginBottom: '12px',
          }}>
            Research{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Peptide Shop</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {allProducts.length} premium compounds — all third-party lab verified
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>

        {/* ── Search + Sort bar ── */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '28px',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={15} style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search peptides…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color var(--transition-fast)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '11px 36px 11px 14px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(f => !f)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '11px 18px',
              background: showFilters ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)',
              border: `1px solid ${showFilters ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
              borderRadius: 'var(--radius-md)',
              color: showFilters ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        {/* ── Filter Panel ── */}
        {showFilters && (
          <div style={{
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px',
            alignItems: 'flex-start',
          }}>
            {/* Price slider */}
            <div style={{ minWidth: '200px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8rem', fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Max Price: <span style={{ color: 'var(--primary-blue)' }}>${priceMax}</span>
              </label>
              <input
                type="range"
                min={30} max={100} step={5}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-blue)' }}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px',
              }}>
                <span>$30</span><span>$100</span>
              </div>
            </div>

            {/* In stock toggle */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem', fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>Availability</label>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                cursor: 'pointer', fontSize: '0.9rem',
              }}>
                <div
                  onClick={() => setInStockOnly(v => !v)}
                  style={{
                    width: 40, height: 22,
                    borderRadius: '999px',
                    background: inStockOnly ? 'var(--gradient-primary)' : 'var(--card-elevated)',
                    border: '1px solid var(--glass-border)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 2, left: inStockOnly ? 20 : 2,
                    width: 16, height: 16,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left var(--transition-base)',
                  }} />
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>In Stock Only</span>
              </label>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setPriceMax(100); setInStockOnly(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px',
                background: 'none',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                alignSelf: 'flex-end',
              }}
            >
              <X size={13} /> Reset Filters
            </button>
          </div>
        )}

        {/* ── Category Pills ── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '36px',
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                border: `1px solid ${activeCategory === cat ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                background: activeCategory === cat
                  ? 'rgba(0,207,255,0.12)'
                  : 'var(--card-dark)',
                color: activeCategory === cat
                  ? 'var(--primary-blue)'
                  : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Results count ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Showing <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{filtered.length}</span> results
            {activeCategory !== 'All' && (
              <> in <span style={{ color: 'var(--primary-blue)' }}>{activeCategory}</span></>
            )}
          </p>
        </div>

        {/* ── Product Grid ── */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map(p => <ShopProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: 'var(--text-muted)',
          }}>
            <Microscope size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No products found</p>
            <p style={{ fontSize: '0.875rem' }}>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Shop Product Card ───────────────────────────────────── */
function ShopProductCard({ product }) {
  const {
    id, name, subtitle, price, badge, badgeColor = 'var(--primary-blue)',
    iconName, rating, reviews, inStock, image,
  } = product;

  const Icon = getIconByName(iconName);

  return (
    <div style={{
      background: 'var(--card-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'all var(--transition-base)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.35), 0 0 20px rgba(0,207,255,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
    {/* Image area */}
<div
  style={{
    position: 'relative',
    background:
      'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '150px',
    borderBottom: '1px solid var(--glass-border)',
  }}
>
  <div
    style={{
      width: '100%',
      height: '100px',
      overflow: 'hidden',
    }}
  >
    <Image
      src={product.image}
      alt={name}
      fill
      style={{
        objectFit: 'cover',
      }}
    />
  </div>

  {/* Wishlist */}
  <button
    style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 999,
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: '50%',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = 'var(--pink)';
      e.currentTarget.style.borderColor = 'var(--pink)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = 'var(--text-muted)';
      e.currentTarget.style.borderColor = 'var(--glass-border)';
    }}
  >
    <Heart size={14} />
  </button>

  {/* Out of stock */}
  {!inStock && (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 998,
        background: 'rgba(2,6,23,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
      }}
    >
      OUT OF STOCK
    </div>
  )}
</div>

      {/* Content */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem', fontWeight: 800,
              color: 'var(--text-light)',
            }}>{name}</h3>
            <BadgeCheck size={13} color="var(--primary-blue)" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{subtitle}</p>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i} size={11}
                fill={i <= Math.round(rating) ? '#fbbf24' : 'none'}
                color={i <= Math.round(rating) ? '#fbbf24' : 'var(--text-muted)'}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {rating} ({reviews})
          </span>
        </div>

        {/* Stock indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: inStock ? '#34d399' : '#f87171',
            boxShadow: inStock ? '0 0 6px #34d399' : '0 0 6px #f87171',
          }} />
          <span style={{
            fontSize: '0.75rem',
            color: inStock ? '#34d399' : '#f87171',
          }}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Price + actions */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--glass-border)',
          marginTop: 'auto',
          gap: '8px',
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem', fontWeight: 900,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>${price.toFixed(2)}</span>

          <div style={{ display: 'flex', gap: '7px' }}>
            <button style={{
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,207,255,0.08)',
              border: '1px solid rgba(0,207,255,0.2)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary-blue)',
              cursor: inStock ? 'pointer' : 'not-allowed',
              opacity: inStock ? 1 : 0.4,
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => { if (inStock) e.currentTarget.style.background = 'rgba(0,207,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,207,255,0.08)'; }}
            >
              <ShoppingCart size={14} />
            </button>

            <Link href={`/product/${id}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '0 13px', height: 34,
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: '0.8rem', fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
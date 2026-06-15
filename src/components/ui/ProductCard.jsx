'use client';

import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  Star,
  FlaskConical,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

/**
 * ProductCard component
 *
 * Props:
 *  product: {
 *    id, name, subtitle, price, originalPrice?,
 *    badge?, badgeColor?, desc, icon?, rating?, reviews?,
 *    inStock?, image?
 *  }
 *  variant: 'default' | 'compact' | 'horizontal'
 */

export default function ProductCard({ product, variant = 'default' }) {
  const {
    id,
    name,
    subtitle,
    price,
    originalPrice,
    badge,
    badgeColor = 'var(--primary-blue)',
    desc,
    icon = '🔬',
    rating = 4.8,
    reviews = 0,
    inStock = true,
  } = product;

  if (variant === 'compact') return <CompactCard product={product} />;
  if (variant === 'horizontal') return <HorizontalCard product={product} />;

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
        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.35)';
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4), 0 0 24px rgba(0,207,255,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* ── Image / Icon Area ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--card-elevated) 100%)',
        padding: '36px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '160px',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        {/* Glow behind icon */}
        <div style={{
          position: 'absolute',
          width: '100px', height: '100px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${badgeColor}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          fontSize: '4rem',
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 0 16px rgba(0,207,255,0.3))',
        }}>
          {icon}
        </div>

        {/* Wishlist button */}
        <button style={{
          position: 'absolute',
          top: '12px', right: '12px',
          width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '50%',
          color: 'var(--pink)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--pink)';
            e.currentTarget.style.borderColor = 'var(--pink)';
            e.currentTarget.style.background = 'rgba(236,72,153,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--pink)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.background = 'var(--glass-bg)';
          }}
        >
          <Heart size={15} />
        </button>

        {/* Badge */}
        {badge && (
          <div style={{
            position: 'absolute',
            top: '12px', left: '12px',
            padding: '4px 10px',
            background: `${badgeColor}22`,
            border: `1px solid ${badgeColor}55`,
            borderRadius: '999px',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: badgeColor,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>{badge}</div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(2,6,23,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}>OUT OF STOCK</div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Name + verified */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.05rem',
              fontWeight: 800,
              color: 'var(--text-light)',
            }}>{name}</h3>
            <BadgeCheck size={15} color="var(--primary-blue)" />
          </div>
          <p style={{ color: 'var(--primary-blue)', fontSize: '0.78rem', fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>

        {/* Rating */}
        {reviews > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={12}
                  fill={i <= Math.round(rating) ? '#fbbf24' : 'none'}
                  color={i <= Math.round(rating) ? '#fbbf24' : 'var(--text-muted)'}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {rating} ({reviews})
            </span>
          </div>
        )}

        {/* Description */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.84rem',
          lineHeight: 1.6,
          flex: 1,
        }}>{desc}</p>

        {/* Lab verified tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FlaskConical size={12} color="var(--primary-blue)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Third-party lab verified
          </span>
        </div>

        {/* ── Footer: Price + Actions ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '6px',
          paddingTop: '14px',
          borderTop: '1px solid var(--glass-border)',
          gap: '10px',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 900,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>{price}</div>
            {originalPrice && (
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                textDecoration: 'line-through',
              }}>{originalPrice}</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Add to cart */}
            <button style={{
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,207,255,0.1)',
              border: '1px solid rgba(0,207,255,0.25)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary-blue)',
              cursor: inStock ? 'pointer' : 'not-allowed',
              opacity: inStock ? 1 : 0.5,
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => {
                if (!inStock) return;
                e.currentTarget.style.background = 'rgba(0,207,255,0.2)';
                e.currentTarget.style.boxShadow = 'var(--glow-sm)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(0,207,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ShoppingCart size={15} />
            </button>

            {/* View details */}
            <Link href={`/product/${id}`} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '0 14px',
              height: 36,
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--glow-blue)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              View <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Compact variant ─────────────────────────────────────── */
function CompactCard({ product }) {
  const { id, name, price, icon = '🔬', badge, badgeColor = 'var(--primary-blue)', inStock = true } = product;

  return (
    <Link href={`/product/${id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 16px',
        background: 'var(--card-dark)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)';
          e.currentTarget.style.background = 'var(--card-elevated)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--glass-border)';
          e.currentTarget.style.background = 'var(--card-dark)';
        }}
      >
        <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '2px' }}>
            {name}
          </div>
          {badge && (
            <span style={{
              fontSize: '0.68rem', fontWeight: 700,
              color: badgeColor, letterSpacing: '0.04em',
            }}>{badge}</span>
          )}
        </div>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.95rem', fontWeight: 800,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          flexShrink: 0,
        }}>{price}</div>
      </div>
    </Link>
  );
}

/* ── Horizontal variant ──────────────────────────────────── */
function HorizontalCard({ product }) {
  const { id, name, subtitle, price, originalPrice, icon = '🔬', desc, rating = 4.8, inStock = true } = product;

  return (
    <div style={{
      display: 'flex', gap: '20px',
      background: 'var(--card-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      transition: 'all var(--transition-base)',
      alignItems: 'flex-start',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)';
        e.currentTarget.style.boxShadow = 'var(--glow-blue)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icon */}
      <div style={{
        width: 72, height: 72, flexShrink: 0,
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem',
        border: '1px solid var(--glass-border)',
      }}>{icon}</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>{name}</h3>
          <BadgeCheck size={14} color="var(--primary-blue)" />
        </div>
        <p style={{ color: 'var(--primary-blue)', fontSize: '0.78rem', marginBottom: '6px' }}>{subtitle}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.5 }}>{desc}</p>
      </div>

      {/* Right: price + action */}
      <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.1rem', fontWeight: 900,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>{price}</div>
        {originalPrice && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
            {originalPrice}
          </div>
        )}
        <Link href={`/product/${id}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '7px 14px',
          background: 'var(--gradient-primary)',
          borderRadius: 'var(--radius-md)',
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          View <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
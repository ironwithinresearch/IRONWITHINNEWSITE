'use client';
// src/app/categories/page.js

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES, GET_PRODUCTS } from '@/lib/queries/products';
import { decodePriceHtml } from '@/lib/utils';
import {
  FlaskConical, HeartPulse, Zap, Brain, Sparkles,
  Dumbbell, Microscope, Dna, ArrowRight, BadgeCheck,
  Search, ShieldCheck, Package, Star, Loader2,
} from 'lucide-react';

// Map category slug → color + icon (fallback for categories without images)
const categoryStyle = {
  'healing-recovery':  { color: 'var(--primary-blue)', Icon: HeartPulse,  gradFrom: 'rgba(0,207,255,0.15)',    gradTo: 'rgba(0,207,255,0.03)' },
  'metabolic-research':{ color: 'var(--pink)',          Icon: Zap,         gradFrom: 'rgba(236,72,153,0.15)',   gradTo: 'rgba(236,72,153,0.03)' },
  'cognitive-peptides':{ color: 'var(--purple)',        Icon: Brain,       gradFrom: 'rgba(124,58,237,0.15)',   gradTo: 'rgba(124,58,237,0.03)' },
  'anti-aging':        { color: '#34d399',              Icon: Sparkles,    gradFrom: 'rgba(52,211,153,0.15)',   gradTo: 'rgba(52,211,153,0.03)' },
  'performance':       { color: '#fbbf24',              Icon: Dumbbell,    gradFrom: 'rgba(251,191,36,0.15)',   gradTo: 'rgba(251,191,36,0.03)' },
  'hormonal-research': { color: 'var(--secondary-blue)',Icon: Microscope,  gradFrom: 'rgba(56,189,248,0.15)',   gradTo: 'rgba(56,189,248,0.03)' },
  'growth-hormone':    { color: '#a78bfa',              Icon: Dna,         gradFrom: 'rgba(167,139,250,0.15)',  gradTo: 'rgba(167,139,250,0.03)' },
  'clothing':          { color: 'var(--primary-blue)',  Icon: Package,     gradFrom: 'rgba(0,207,255,0.15)',    gradTo: 'rgba(0,207,255,0.03)' },
  'accessories':       { color: 'var(--purple)',        Icon: Star,        gradFrom: 'rgba(124,58,237,0.15)',   gradTo: 'rgba(124,58,237,0.03)' },
  'hoodies':           { color: '#fbbf24',              Icon: Dumbbell,    gradFrom: 'rgba(251,191,36,0.15)',   gradTo: 'rgba(251,191,36,0.03)' },
  'tshirts':           { color: 'var(--pink)',          Icon: Zap,         gradFrom: 'rgba(236,72,153,0.15)',   gradTo: 'rgba(236,72,153,0.03)' },
  'music':             { color: '#34d399',              Icon: Sparkles,    gradFrom: 'rgba(52,211,153,0.15)',   gradTo: 'rgba(52,211,153,0.03)' },
  'decor':             { color: 'var(--secondary-blue)',Icon: FlaskConical,gradFrom: 'rgba(56,189,248,0.15)',   gradTo: 'rgba(56,189,248,0.03)' },
};

const defaultStyle = { color: 'var(--primary-blue)', Icon: FlaskConical, gradFrom: 'rgba(0,207,255,0.15)', gradTo: 'rgba(0,207,255,0.03)' };

// Sub-component: products preview per category
function CategoryProducts({ categorySlug }) {
  const { data } = useQuery(GET_PRODUCTS, {
    variables: { first: 3, category: categorySlug },
    fetchPolicy: 'cache-and-network',
  });
  const products = data?.products?.nodes || [];
  if (products.length === 0) return (
    <div style={{ padding: '14px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
      Products coming soon
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Featured in this category</p>
      {products.map(p => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {p.image?.sourceUrl ? (
              <img src={p.image.sourceUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <FlaskConical size={14} color="var(--primary-blue)" style={{ opacity: 0.4 }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              <BadgeCheck size={11} color="var(--primary-blue)" />
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: decodePriceHtml(p.price) || '—' }} />
        </div>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  const [hoveredKey, setHoveredKey] = useState(null);

  const { data, loading } = useQuery(GET_CATEGORIES, { fetchPolicy: 'cache-and-network' });
  // Lux Me (beauty line) is hidden from IW browsing — reachable only via a direct link.
  const categories = (data?.productCategories?.nodes || []).filter(c => c.slug !== 'lux-me');

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* Header */}
      <section style={{ position: 'relative', padding: '80px 24px 60px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.10) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(0,207,255,0.08) 0%, transparent 55%)` }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.22)', borderRadius: '999px', marginBottom: '20px', fontSize: '0.72rem', color: 'var(--primary-blue)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <FlaskConical size={12} /> Research Areas
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Browse by{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Category</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
            Explore our catalogue organised by research area. Every compound ships with a Certificate of Analysis.
          </p>
        </div>
      </section>

      <div className="container">

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '56px', padding: '20px 24px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
          {[
            { Icon: FlaskConical, color: 'var(--primary-blue)', value: `${categories.length}`, label: 'Categories' },
            { Icon: Package, color: 'var(--purple)', value: `${categories.reduce((s, c) => s + (c.count || 0), 0)}+`, label: 'Products' },
            { Icon: ShieldCheck, color: '#34d399', value: '99.3%+', label: 'Avg Purity' },
            { Icon: Star, color: '#fbbf24', value: '4.9/5', label: 'Avg Rating' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <s.Icon size={18} color={s.color} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '2px' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && categories.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <Loader2 size={36} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* Categories grid */}
        {categories.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '64px' }}>
            {categories.map(cat => {
              const style = categoryStyle[cat.slug] || defaultStyle;
              const { color, Icon, gradFrom, gradTo } = style;
              const isHovered = hoveredKey === cat.slug;

              return (
                <Link key={cat.id} href={`/shop?category=${cat.slug}`} style={{ textDecoration: 'none' }}
                  onMouseEnter={() => setHoveredKey(cat.slug)}
                  onMouseLeave={() => setHoveredKey(null)}>
                  <div style={{ background: 'var(--card-dark)', border: `1px solid ${isHovered ? `${color}44` : 'var(--glass-border)'}`, borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all 0.2s ease', transform: isHovered ? 'translateY(-5px)' : 'translateY(0)', boxShadow: isHovered ? `0 16px 40px ${color}15` : 'none', height: '100%' }}>

                    {/* Category Header */}
                    <div style={{ padding: '28px 28px 20px', background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`, borderBottom: `1px solid ${color}18`, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: `${color}10`, border: `1px solid ${color}20` }} />

                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div>
                          {/* Category image or icon */}
                          <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', overflow: 'hidden', boxShadow: isHovered ? `0 0 20px ${color}40` : 'none', transition: 'all 0.2s ease' }}>
                            {cat.image?.sourceUrl ? (
                              <img src={cat.image.sourceUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Icon size={24} color={color} />
                            )}
                          </div>
                          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '4px' }}>{cat.name}</h2>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, color }}>
                            <FlaskConical size={10} /> {cat.count > 0 ? `${cat.count} product${cat.count !== 1 ? 's' : ''}` : 'Coming Soon'}
                          </div>
                        </div>
                        <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 'var(--radius-md)', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isHovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s ease' }}>
                          <ArrowRight size={15} color={color} />
                        </div>
                      </div>
                    </div>

                    {/* Preview products */}
                    <div style={{ padding: '20px 28px 24px' }}>
                      <CategoryProducts categorySlug={cat.slug} />
                      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color, fontSize: '0.82rem', fontWeight: 600 }}>
                        Browse {cat.name} <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div style={{ position: 'relative', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(36px, 5vw, 64px)', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,207,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-blue)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
              <Search size={12} /> Can't find what you need?
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 900, marginBottom: '12px' }}>
              Browse the Full{' '}
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Catalogue</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.7 }}>
              Search and filter across all compounds in our full shop.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '13px 28px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)', boxShadow: 'var(--glow-blue)' }}>
                <FlaskConical size={15} /> View All Products
              </Link>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '13px 28px', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

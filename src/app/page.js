'use client';
// src/app/page.js — Featured Products section wired to real GraphQL
// All other sections remain identical to original

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/queries/products';
import { decodePriceHtml } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import GuaranteeBadge from '@/components/GuaranteeBadge';
import {
  FlaskConical, Beaker, Pill, Dna, HeartPulse, Zap, Brain,
  Sparkles, Dumbbell, Microscope, Trophy, Rocket, ShieldCheck,
  Mail, ArrowRight, CheckCircle2, Star, BadgeCheck,
  ShoppingCart, Heart, Loader2,
} from 'lucide-react';

const categories = [
  { name: 'Healing & Recovery', Icon: HeartPulse, count: 12, href: '/categories', color: 'var(--primary-blue)' },
  { name: 'Metabolic Research', Icon: Zap, count: 8, href: '/categories', color: 'var(--purple)' },
  { name: 'Cognitive Peptides', Icon: Brain, count: 6, href: '/categories', color: 'var(--pink)' },
  { name: 'Anti-Aging', Icon: Sparkles, count: 9, href: '/categories', color: '#34d399' },
  { name: 'Performance', Icon: Dumbbell, count: 11, href: '/categories', color: '#fbbf24' },
  { name: 'Hormonal Research', Icon: Microscope, count: 7, href: '/categories', color: 'var(--secondary-blue)' },
];

const stats = [
  { value: '40+', label: 'Research Products' },
  { value: '99.3%+', label: 'Purity Guaranteed' },
  { value: '3K+', label: 'Researchers Served' },
  { value: '24/7', label: 'Email Support' },
];

const whyUs = [
  { Icon: Trophy, color: '#fbbf24', title: 'Third-Party Tested', desc: 'Every batch independently verified for purity, potency, and safety by accredited laboratories.' },
  { Icon: Rocket, color: 'var(--primary-blue)', title: 'Fast Shipping', desc: 'Discreet packaging with express delivery options. Orders ship within 24–48 hours.' },
  { Icon: ShieldCheck, color: '#34d399', title: 'Secure Checkout', desc: 'Bank-level SSL encryption on every transaction. Your data is always protected.' },
  { Icon: Mail, color: 'var(--purple)', title: 'Email Support', desc: 'Reach our research specialists any time at support@ironwithin.io — we reply promptly.' },
];

const trustBadges = [
  { Icon: FlaskConical, label: 'Lab Verified' },
  { Icon: Rocket, label: 'Fast Shipping' },
  { Icon: ShieldCheck, label: 'Secure Payments' },
  { Icon: Star, label: '4.9/5 Rating' },
];

// ── Featured Products Section ─────────────────────────────
function FeaturedProducts() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [addedItems, setAddedItems] = useState({});

  // Curated "Top Research Compounds" — pinned, in this exact order
  const FEATURED_SLUGS = ['rt-3', 'mots-c', 'cjc-ipa', 'glow-bundle'];

  const { data, loading } = useQuery(GET_PRODUCTS, {
    variables: { first: FEATURED_SLUGS.length, slugIn: FEATURED_SLUGS },
    fetchPolicy: 'cache-and-network',
  });

  // Backend ignores slugIn order, so reorder to match FEATURED_SLUGS
  const fetched = data?.products?.nodes || [];
  const products = FEATURED_SLUGS
    .map(slug => fetched.find(p => p.slug === slug))
    .filter(Boolean);

  const handleAddToCart = async (product) => {
    if (product.__typename === 'VariableProduct') return; // redirect to product page
    const result = await addToCart(product.databaseId, 1);
    if (result?.success !== false) {
      setAddedItems(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 2000);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Loader2 size={32} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
      {products.map(product => {
        const isVariable = product.__typename === 'VariableProduct';
        const inStock = isVariable
          ? product.variations?.nodes?.some(v => v.stockStatus === 'IN_STOCK')
          : product.stockStatus === 'IN_STOCK';
        const wishlisted = isWishlisted(product.id);
        const added = addedItems[product.id];

        return (
          <div key={product.id} style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease', position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--glow-blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

            {/* Wishlist button */}
            <button onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
              style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: `1px solid ${wishlisted ? 'rgba(236,72,153,0.4)' : 'var(--glass-border)'}`, borderRadius: '8px', color: wishlisted ? 'var(--pink)' : '#ec4899', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>

            {/* Image */}
            <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ height: 180, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {product.image?.sourceUrl ? (
                  <img src={product.image.sourceUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
                ) : (
                  <FlaskConical size={52} color="var(--primary-blue)" style={{ opacity: 0.2 }} />
                )}
                {!inStock && (
                  <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 600, color: '#f87171' }}>Out of Stock</div>
                )}
              </div>
            </Link>

            {/* Content */}
            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {product.productCategories?.nodes?.[0] && (
                <p style={{ fontSize: '0.7rem', color: 'var(--primary-blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {product.productCategories.nodes[0].name}
                </p>
              )}

              <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-light)', lineHeight: 1.3 }}>{product.name}</h3>
              </Link>

              {product.shortDescription && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {product.onSale && product.regularPrice && (
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'line-through' }}
                      dangerouslySetInnerHTML={{ __html: decodePriceHtml(product.regularPrice) }} />
                  )}
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    dangerouslySetInnerHTML={{ __html: decodePriceHtml(product.price) || 'View' }} />
                </div>

                {isVariable ? (
                  <Link href={`/product/${product.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', background: 'var(--gradient-primary)', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                    Select <ArrowRight size={12} />
                  </Link>
                ) : (
                  <button onClick={() => handleAddToCart(product)} disabled={!inStock || added}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', background: added ? 'rgba(52,211,153,0.15)' : inStock ? 'var(--gradient-primary)' : 'var(--card-elevated)', border: added ? '1px solid rgba(52,211,153,0.4)' : 'none', borderRadius: '8px', color: added ? '#34d399' : inStock ? '#fff' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', cursor: inStock ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', opacity: !inStock ? 0.6 : 1 }}>
                    <ShoppingCart size={13} /> {added ? 'Added!' : inStock ? 'Add' : 'N/A'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Need useState for FeaturedProducts
import { useState } from 'react';

export default function Home() {
  return (
    <>
      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', padding: '60px 24px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,207,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(236,72,153,0.10) 0%, transparent 50%)` }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03, backgroundImage: `linear-gradient(rgba(0,207,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.25)', borderRadius: '999px', marginBottom: '28px', fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <FlaskConical size={13} /> Premium Research Grade &nbsp;·&nbsp; For Research Purposes Only
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
            IRON WITHIN{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>RESEARCH</span>
          </h1>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.35em', color: 'var(--primary-blue)', textAlign: 'center', marginBottom: '24px' }}>
            EST 2025
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Pharmaceutical-grade purity. Independently verified. Trusted by researchers and scientists across the globe.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 0 24px rgba(0,207,255,0.45)', fontFamily: 'var(--font-body)' }}>
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link href="/lab-reports" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              <FlaskConical size={16} /> Lab Reports
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '48px' }}>
            {trustBadges.map(({ Icon, label }) => (
              <span key={label} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={14} color="var(--primary-blue)" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section style={{ background: 'var(--card-dark)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '36px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '4px' }}>{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS — REAL GRAPHQL ══ */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-blue)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              <FlaskConical size={13} /> Featured Products
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '14px' }}>
              Top Research{' '}
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Compounds</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              All peptides are synthesized to 99.3%+ purity standards and independently verified before dispatch.
            </p>
          </div>

          <FeaturedProducts />

          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 32px', border: '2px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; e.currentTarget.style.background = 'rgba(0,207,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.background = 'transparent'; }}>
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ GUARANTEE ══ */}
      <section style={{ padding: '20px 24px 60px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <GuaranteeBadge />
        </div>
      </section>

      {/* ══ MIDDLE BANNER ══ */}
      <section style={{ padding: '60px 24px', background: 'var(--card-dark)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '32px', textAlign: 'center' }}>
            {[{ value: '40+', label: 'Products' }, { value: '99.3%+', label: 'Purity' }, { value: '3k+', label: 'Researchers' }].map((item, i, arr) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: '6px' }}>{item.value}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</div>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, height: 48, background: 'var(--glass-border)' }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ══ */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pink)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              <CheckCircle2 size={13} /> Why Choose Us
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800 }}>
              Built for{' '}
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Researchers</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {whyUs.map(({ Icon, color, title, desc }) => (
              <div key={title} style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '32px 28px', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.boxShadow = `0 0 20px ${color}22`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-light)' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EMAIL SUPPORT CTA ══ */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ position: 'relative', background: 'var(--card-dark)', border: '2px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(36px, 5vw, 64px)', textAlign: 'center', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,207,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Mail size={36} color="var(--primary-blue)" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, marginBottom: '16px' }}>
                Email{' '}
                <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Support</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                Have questions? Our research team is ready to help. Reach us directly at any time.
              </p>
              <a href="mailto:support@ironwithin.io" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', fontFamily: 'var(--font-body)', boxShadow: 'var(--glow-blue)' }}>
                support@ironwithin.io <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

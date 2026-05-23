'use client';

import Link from 'next/link';
import {
  FlaskConical,
  Beaker,
  Pill,
  Dna,
  HeartPulse,
  Zap,
  Brain,
  Sparkles,
  Dumbbell,
  Microscope,
  Trophy,
  Rocket,
  ShieldCheck,
  Phone,
  ArrowRight,
  CheckCircle2,
  Star,
  BadgeCheck,
  ShoppingCart,
  Heart,
} from 'lucide-react';

/* ── Static data ─────────────────────────────────────────── */
const featuredProducts = [
  {
    id: 1,
    name: 'BPC-157',
    subtitle: 'Body Protection Compound',
    price: '$49.99',
    badge: 'Best Seller',
    badgeColor: 'var(--primary-blue)',
    desc: 'Promotes healing and recovery in muscles, tendons, and ligaments.',
    Icon: FlaskConical,
  },
  {
    id: 2,
    name: 'TB-500',
    subtitle: 'Thymosin Beta-4',
    price: '$59.99',
    badge: 'Popular',
    badgeColor: 'var(--purple)',
    desc: 'Widely studied for tissue repair and anti-inflammatory properties.',
    Icon: Beaker,
  },
  {
    id: 3,
    name: 'Semaglutide',
    subtitle: 'GLP-1 Receptor Agonist',
    price: '$79.99',
    badge: 'New',
    badgeColor: 'var(--pink)',
    desc: 'Research compound studied for metabolic and appetite regulation.',
    Icon: Pill,
  },
  {
    id: 4,
    name: 'CJC-1295',
    subtitle: 'Growth Hormone Releasing',
    price: '$54.99',
    badge: 'Top Rated',
    badgeColor: '#34d399',
    desc: 'Studied for its role in stimulating growth hormone secretion.',
    Icon: Dna,
  },
];

const categories = [
  { name: 'Healing & Recovery', Icon: HeartPulse, count: 12, href: '/categories', color: 'var(--primary-blue)' },
  { name: 'Metabolic Research', Icon: Zap, count: 8, href: '/categories', color: 'var(--purple)' },
  { name: 'Cognitive Peptides', Icon: Brain, count: 6, href: '/categories', color: 'var(--pink)' },
  { name: 'Anti-Aging', Icon: Sparkles, count: 9, href: '/categories', color: '#34d399' },
  { name: 'Performance', Icon: Dumbbell, count: 11, href: '/categories', color: '#fbbf24' },
  { name: 'Hormonal Research', Icon: Microscope, count: 7, href: '/categories', color: 'var(--secondary-blue)' },
];

const stats = [
  { value: '500+', label: 'Research Compounds' },
  { value: '99.9%', label: 'Purity Guaranteed' },
  { value: '50K+', label: 'Researchers Served' },
  { value: '24/7', label: 'Expert Support' },
];

const whyUs = [
  {
    Icon: Trophy,
    color: '#fbbf24',
    title: 'Third-Party Tested',
    desc: 'Every batch independently verified for purity, potency, and safety by accredited laboratories.',
  },
  {
    Icon: Rocket,
    color: 'var(--primary-blue)',
    title: 'Fast Global Shipping',
    desc: 'Discreet packaging with express delivery options. Orders ship within 24 hours.',
  },
  {
    Icon: ShieldCheck,
    color: '#34d399',
    title: 'Secure Checkout',
    desc: 'Bank-level SSL encryption on every transaction. Your data is always protected.',
  },
  {
    Icon: Phone,
    color: 'var(--purple)',
    title: '24/7 Expert Support',
    desc: 'Our research specialists are available around the clock to answer your questions.',
  },
];

const trustBadges = [
  { Icon: FlaskConical, label: 'Lab Verified' },
  { Icon: Rocket, label: 'Fast Shipping' },
  { Icon: ShieldCheck, label: 'Secure Payments' },
  { Icon: Star, label: '4.9/5 Rating' },
];

/* ── Page Component ──────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '60px 24px',
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0,207,255,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(236,72,153,0.10) 0%, transparent 50%)
          `,
        }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
          backgroundImage: `
            linear-gradient(rgba(0,207,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,207,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px', margin: '0 auto' }}>

          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'rgba(0,207,255,0.08)',
            border: '1px solid rgba(0,207,255,0.25)',
            borderRadius: '999px',
            marginBottom: '28px',
            fontSize: '0.78rem',
            color: 'var(--primary-blue)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            <FlaskConical size={13} />
            Premium Research Grade &nbsp;·&nbsp; For Research Purposes Only
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 7vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-0.03em',
          }}>
            ADVANCED{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>RESEARCH</span>
            <br />PEPTIDES
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            Pharmaceutical-grade purity. Independently verified. Trusted by
            researchers and scientists across the globe.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(0,207,255,0.45)',
              fontFamily: 'var(--font-body)',
              transition: 'all var(--transition-base)',
            }}>
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link href="/about" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-light)',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'all var(--transition-base)',
            }}>
              Learn More
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex', gap: '28px', justifyContent: 'center',
            flexWrap: 'wrap', marginTop: '48px',
          }}>
            {trustBadges.map(({ Icon, label }) => (
              <span key={label} style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <Icon size={14} color="var(--primary-blue)" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════ */}
      <section style={{
        background: 'var(--card-dark)',
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '36px 24px',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '24px',
            textAlign: 'center',
          }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '4px',
                }}>{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ═════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--primary-blue)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              <FlaskConical size={13} /> Featured Products
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              marginBottom: '14px',
            }}>
              Top Research{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Compounds</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              All peptides are synthesized to the highest purity standards and
              independently verified before dispatch.
            </p>
          </div>

          {/* Product Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link href="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 32px',
              border: '2px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-light)',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'all var(--transition-base)',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary-blue)';
                e.currentTarget.style.color = 'var(--primary-blue)';
                e.currentTarget.style.background = 'rgba(0,207,255,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.color = 'var(--text-light)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ════════════════════════════════════ */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-elevated) 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--purple)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              <Microscope size={13} /> Browse By Category
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
            }}>
              Research{' '}
              <span style={{
                background: 'var(--gradient-secondary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Categories</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {categories.map(({ name, Icon, count, href, color }) => (
              <Link key={name} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--card-dark)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px 20px',
                  textAlign: 'center',
                  transition: 'all var(--transition-base)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${color}55`;
                    e.currentTarget.style.background = 'var(--card-elevated)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 0 20px ${color}33`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.background = 'var(--card-dark)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon circle */}
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: '50%',
                    background: `${color}18`,
                    border: `1px solid ${color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px', color: 'var(--text-light)' }}>
                    {name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {count} products
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ═════════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--pink)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              <CheckCircle2 size={13} /> Why Choose Us
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
            }}>
              Built for{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Researchers</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {whyUs.map(({ Icon, color, title, desc }) => (
              <div key={title} style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                transition: 'all var(--transition-base)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${color}44`;
                  e.currentTarget.style.boxShadow = `0 0 20px ${color}22`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: 52, height: 52,
                  borderRadius: 'var(--radius-md)',
                  background: `${color}18`,
                  border: `1px solid ${color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <Icon size={24} color={color} />
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: '10px',
                  color: 'var(--text-light)',
                }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{
            position: 'relative',
            background: 'var(--card-dark)',
            border: '2px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(40px, 6vw, 80px)',
            textAlign: 'center',
            overflow: 'hidden',
            transition: 'all var(--transition-base)',
            cursor: 'pointer',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary-blue)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0,207,255,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse at center, rgba(0,207,255,0.07) 0%, transparent 70%)',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                fontWeight: 900,
                marginBottom: '16px',
              }}>
                Ready to Start Your{' '}
                <span style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Research?</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                maxWidth: '480px',
                margin: '0 auto 32px',
                lineHeight: 1.7,
              }}>
                Join thousands of researchers who trust Darryl Peptides for
                purity, reliability, and speed.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/shop" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 36px',
                  background: 'var(--gradient-primary)',
                  border: '2px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff', fontWeight: 700, fontSize: '1rem',
                  textDecoration: 'none',
                  boxShadow: '0 0 24px rgba(0,207,255,0.4)',
                  fontFamily: 'var(--font-body)',
                  transition: 'all var(--transition-base)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.boxShadow = '0 0 32px rgba(0,207,255,0.6)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(0,207,255,0.4)';
                  }}
                >
                  <ShoppingCart size={16} /> Shop All Peptides
                </Link>
                <Link
                  href="/register"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 36px',
                    border: '2px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-base)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-blue)';
                    e.currentTarget.style.color = 'var(--primary-blue)';
                    e.currentTarget.style.background = 'rgba(0,207,255,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.color = 'var(--text-light)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Create Account <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Product Card Sub-component ──────────────────────────── */
function ProductCard({ product }) {
  const { id, name, subtitle, price, badge, badgeColor = 'var(--primary-blue)', desc, Icon } = product;

  return (
    <Link href={`/product/${id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--card-dark)',
        border: '2px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'all var(--transition-base)',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${badgeColor}88`;
          e.currentTarget.style.background = 'var(--card-elevated)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 8px 32px ${badgeColor}33`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--glass-border)';
          e.currentTarget.style.background = 'var(--card-dark)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Badge */}
        {badge && (
          <div style={{
            position: 'absolute', top: '16px', right: '16px',
            padding: '4px 10px',
            background: `${badgeColor}22`,
            border: `1px solid ${badgeColor}55`,
            borderRadius: '999px',
            fontSize: '0.7rem', fontWeight: 700,
            color: badgeColor,
            letterSpacing: '0.05em',
          }}>{badge}</div>
        )}

        {/* Icon circle */}
        <div style={{
          width: 60, height: 60,
          borderRadius: 'var(--radius-md)',
          background: `${badgeColor}18`,
          border: `1px solid ${badgeColor}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Icon && <Icon size={28} color={badgeColor} />}
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem', fontWeight: 800,
              color: 'var(--text-light)',
            }}>{name}</h3>
            <BadgeCheck size={14} color="var(--primary-blue)" />
          </div>
          <p style={{ color: 'var(--primary-blue)', fontSize: '0.78rem', fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          flex: 1,
        }}>{desc}</p>

        {/* Lab tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FlaskConical size={12} color="var(--primary-blue)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Third-party lab verified
          </span>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '14px',
          borderTop: '1px solid var(--glass-border)',
          gap: '10px',
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem', fontWeight: 900,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{price}</span>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '7px 14px',
            background: 'rgba(0,207,255,0.1)',
            border: '1px solid rgba(0,207,255,0.25)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--primary-blue)',
            fontSize: '0.8rem', fontWeight: 600,
          }}>
            View <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}
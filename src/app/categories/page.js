'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FlaskConical, HeartPulse, Zap, Brain, Sparkles,
  Dumbbell, Microscope, Dna, ArrowRight, BadgeCheck,
  Search, Star, ShieldCheck, Package,
} from 'lucide-react';
import { allProducts } from '../../data/products';
import { getIconByName } from '../../lib/iconMap';

/* ── Category definitions ────────────────────────────────── */
const categoryData = [
  {
    key: 'Healing & Recovery',
    label: 'Healing & Recovery',
    Icon: HeartPulse,
    color: 'var(--primary-blue)',
    gradFrom: 'rgba(0,207,255,0.15)',
    gradTo: 'rgba(0,207,255,0.03)',
    desc: 'Peptides studied for musculoskeletal repair, tendon healing, and anti-inflammatory properties.',
    topTags: ['BPC-157', 'TB-500', 'GHK-Cu'],
  },
  {
    key: 'Metabolic Research',
    label: 'Metabolic Research',
    Icon: Zap,
    color: 'var(--pink)',
    gradFrom: 'rgba(236,72,153,0.15)',
    gradTo: 'rgba(236,72,153,0.03)',
    desc: 'Research compounds studied for glucose regulation, appetite modulation, and metabolic pathways.',
    topTags: ['Semaglutide', 'Tirzepatide', 'MOTS-c'],
  },
  {
    key: 'Cognitive Peptides',
    label: 'Cognitive Peptides',
    Icon: Brain,
    color: 'var(--purple)',
    gradFrom: 'rgba(124,58,237,0.15)',
    gradTo: 'rgba(124,58,237,0.03)',
    desc: 'Nootropic peptides examined for neuroprotection, anxiety modulation, and cognitive performance.',
    topTags: ['Selank', 'Semax', 'Dihexa'],
  },
  {
    key: 'Anti-Aging',
    label: 'Anti-Aging',
    Icon: Sparkles,
    color: '#34d399',
    gradFrom: 'rgba(52,211,153,0.15)',
    gradTo: 'rgba(52,211,153,0.03)',
    desc: 'Compounds studied for longevity mechanisms, telomere biology, and cellular rejuvenation.',
    topTags: ['Epithalon', 'GHK-Cu', 'Thymalin'],
  },
  {
    key: 'Performance',
    label: 'Performance',
    Icon: Dumbbell,
    color: '#fbbf24',
    gradFrom: 'rgba(251,191,36,0.15)',
    gradTo: 'rgba(251,191,36,0.03)',
    desc: 'Peptides researched for endurance, muscle preservation, and physical performance markers.',
    topTags: ['BPC-157', 'TB-500', 'CJC-1295'],
  },
  {
    key: 'Hormonal Research',
    label: 'Hormonal Research',
    Icon: Microscope,
    color: 'var(--secondary-blue)',
    gradFrom: 'rgba(56,189,248,0.15)',
    gradTo: 'rgba(56,189,248,0.03)',
    desc: 'Compounds examined in the context of endocrine signalling, receptor agonism, and hormone regulation.',
    topTags: ['PT-141', 'Kisspeptin', 'Melanotan'],
  },
  {
    key: 'Growth Hormone',
    label: 'Growth Hormone',
    Icon: Dna,
    color: '#a78bfa',
    gradFrom: 'rgba(167,139,250,0.15)',
    gradTo: 'rgba(167,139,250,0.03)',
    desc: 'GHRPs and GHRHs studied for their interaction with growth hormone release pathways.',
    topTags: ['CJC-1295', 'Ipamorelin', 'GHRP-6'],
  },
];

/* ── Page ────────────────────────────────────────────────── */
export default function CategoriesPage() {
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Page Header ── */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.10) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 30%, rgba(0,207,255,0.08) 0%, transparent 55%)
          `,
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: `
            linear-gradient(rgba(0,207,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,207,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '5px 14px',
            background: 'rgba(0,207,255,0.08)',
            border: '1px solid rgba(0,207,255,0.22)',
            borderRadius: '999px',
            marginBottom: '20px',
            fontSize: '0.72rem', color: 'var(--primary-blue)',
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <FlaskConical size={12} /> Research Areas
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: '16px', letterSpacing: '-0.03em',
          }}>
            Browse by{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Research Category</span>
          </h1>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7,
            maxWidth: '520px', margin: '0 auto',
          }}>
            Explore our catalogue organised by research application. Every compound is independently verified and ships with a Certificate of Analysis.
          </p>
        </div>
      </section>

      <div className="container">

        {/* ── Stats row ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '56px',
          padding: '20px 24px',
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
        }}>
          {[
            { Icon: FlaskConical, color: 'var(--primary-blue)', value: `${categoryData.length}`, label: 'Research Areas' },
            { Icon: Package,      color: 'var(--purple)',       value: `${allProducts.length}+`,  label: 'Compounds' },
            { Icon: ShieldCheck,  color: '#34d399',             value: '99.9%',                  label: 'Avg Purity' },
            { Icon: Star,         color: '#fbbf24',             value: '4.9/5',                  label: 'Avg Rating' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)',
                background: `${s.color}18`,
                border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <s.Icon size={18} color={s.color} />
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem', fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '2px',
              }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Category Cards Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '64px',
        }}>
          {categoryData.map(cat => {
            const count = allProducts.filter(p => p.category === cat.key).length;
            const previewProducts = allProducts.filter(p => p.category === cat.key).slice(0, 3);
            const isHovered = hoveredKey === cat.key;

            return (
              <Link
                key={cat.key}
                href={`/shop?category=${encodeURIComponent(cat.key)}`}
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredKey(cat.key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <div style={{
                  background: 'var(--card-dark)',
                  border: `1px solid ${isHovered ? `${cat.color}44` : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  transition: 'all var(--transition-base)',
                  transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 16px 40px ${cat.color}15, 0 0 0 1px ${cat.color}22` : 'none',
                  height: '100%',
                }}>

                  {/* Category Header */}
                  <div style={{
                    padding: '28px 28px 20px',
                    background: `linear-gradient(135deg, ${cat.gradFrom} 0%, ${cat.gradTo} 100%)`,
                    borderBottom: `1px solid ${cat.color}18`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Decorative circle */}
                    <div style={{
                      position: 'absolute',
                      right: '-20px', top: '-20px',
                      width: '100px', height: '100px',
                      borderRadius: '50%',
                      background: `${cat.color}10`,
                      border: `1px solid ${cat.color}20`,
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        {/* Icon */}
                        <div style={{
                          width: 52, height: 52,
                          borderRadius: 'var(--radius-md)',
                          background: `${cat.color}18`,
                          border: `1px solid ${cat.color}35`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: '14px',
                          transition: 'all var(--transition-base)',
                          boxShadow: isHovered ? `0 0 20px ${cat.color}40` : 'none',
                        }}>
                          <cat.Icon size={24} color={cat.color} />
                        </div>

                        <h2 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.1rem', fontWeight: 800,
                          color: 'var(--text-light)',
                          marginBottom: '4px',
                        }}>{cat.label}</h2>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '3px 10px',
                          background: `${cat.color}15`,
                          border: `1px solid ${cat.color}30`,
                          borderRadius: '999px',
                          fontSize: '0.68rem', fontWeight: 700,
                          color: cat.color,
                        }}>
                          <FlaskConical size={10} />
                          {count > 0 ? `${count} compound${count !== 1 ? 's' : ''}` : 'Coming Soon'}
                        </div>
                      </div>

                      <div style={{
                        width: 32, height: 32, flexShrink: 0,
                        borderRadius: 'var(--radius-md)',
                        background: `${cat.color}15`,
                        border: `1px solid ${cat.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all var(--transition-base)',
                        transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                      }}>
                        <ArrowRight size={15} color={cat.color} />
                      </div>
                    </div>
                  </div>

                  {/* Description + tags */}
                  <div style={{ padding: '20px 28px 24px' }}>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.84rem', lineHeight: 1.7,
                      marginBottom: '16px',
                    }}>{cat.desc}</p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      {cat.topTags.map(tag => (
                        <span key={tag} style={{
                          padding: '3px 10px',
                          background: 'var(--bg-dark)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '999px',
                          fontSize: '0.7rem', color: 'var(--text-muted)',
                          fontWeight: 500,
                        }}>{tag}</span>
                      ))}
                    </div>

                    {/* Preview products */}
                    {previewProducts.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{
                          fontSize: '0.7rem', fontWeight: 700,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.07em',
                          marginBottom: '4px',
                        }}>Featured in this category</p>
                        {previewProducts.map(p => {
                          const PIcon = getIconByName(p.iconName);
                          return (
                            <div key={p.id} style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '9px 12px',
                              background: 'var(--bg-dark)',
                              border: '1px solid var(--glass-border)',
                              borderRadius: 'var(--radius-md)',
                              transition: 'border-color var(--transition-fast)',
                            }}>
                              {/* Mini image */}
                              <div style={{
                                width: 32, height: 32, flexShrink: 0,
                                borderRadius: 'var(--radius-sm)',
                                background: `${p.badgeColor || cat.color}12`,
                                border: `1px solid ${p.badgeColor || cat.color}25`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden',
                              }}>
                                {p.image ? (
                                  <Image src={p.image} alt={p.name} width={32} height={32} style={{ objectFit: 'contain' }} />
                                ) : (
                                  PIcon && <PIcon size={14} color={p.badgeColor || cat.color} />
                                )}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  display: 'flex', alignItems: 'center', gap: '4px',
                                  marginBottom: '1px',
                                }}>
                                  <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-light)' }}>
                                    {p.name}
                                  </span>
                                  <BadgeCheck size={11} color="var(--primary-blue)" />
                                </div>
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.subtitle}</span>
                              </div>

                              <span style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.85rem', fontWeight: 800,
                                background: 'var(--gradient-primary)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                flexShrink: 0,
                              }}>${p.price.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {previewProducts.length === 0 && (
                      <div style={{
                        padding: '16px',
                        background: 'var(--bg-dark)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                      }}>
                        Products coming soon
                      </div>
                    )}

                    {/* Browse button */}
                    <div style={{
                      marginTop: '16px',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      color: cat.color,
                      fontSize: '0.82rem', fontWeight: 600,
                      transition: 'gap var(--transition-fast)',
                    }}>
                      Browse {cat.label}
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── All Products CTA ── */}
        <div style={{
          position: 'relative',
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(36px, 5vw, 64px)',
          textAlign: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,207,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.72rem', fontWeight: 700,
              color: 'var(--primary-blue)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '14px',
            }}>
              <Search size={12} /> Can't find what you need?
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 900,
              marginBottom: '12px',
            }}>
              Browse the Full{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Catalogue</span>
            </h2>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '0.95rem',
              maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.7,
            }}>
              Search and filter across all {allProducts.length}+ compounds in our full shop with advanced filtering options.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/shop" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '13px 28px',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                color: '#fff', fontWeight: 700,
                textDecoration: 'none', fontFamily: 'var(--font-body)',
                boxShadow: 'var(--glow-blue)',
              }}>
                <FlaskConical size={15} /> View All Products
              </Link>
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '13px 28px',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)', fontWeight: 500,
                textDecoration: 'none', fontFamily: 'var(--font-body)',
              }}>
                Request Custom Synthesis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
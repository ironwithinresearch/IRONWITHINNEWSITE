'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical, Beaker, Pill, Dna, Microscope,
  Zap, Brain, HeartPulse, Dumbbell, Sparkles,
  ShoppingCart, Heart, Star, BadgeCheck, ArrowRight,
  ChevronRight, Share2, Shield, Truck, RotateCcw,
  Plus, Minus, Package, CheckCircle2, Info,
} from 'lucide-react';

/* ── Mock product data (replace with real API/DB) ────────── */
const allProducts = [
  {
    id: 1,
    name: 'BPC-157',
    subtitle: 'Body Protection Compound',
    fullName: 'BPC-157 — Body Protection Compound',
    price: 49.99,
    originalPrice: 64.99,
    badge: 'Best Seller',
    badgeColor: 'var(--primary-blue)',
    Icon: FlaskConical,
    category: 'Healing & Recovery',
    rating: 4.9,
    reviews: 214,
    inStock: true,
    purity: '99.1%',
    weight: '5mg',
    sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    casNumber: '137525-51-0',
    desc: 'BPC-157 is a pentadecapeptide composed of 15 amino acids. It is a partial sequence of body protection compound (BPC) that is discovered in and isolated from human gastric juice. Widely studied for its healing and recovery properties.',
    longDesc: `BPC-157 (Body Protection Compound-157) is a synthetic peptide consisting of 15 amino acids. It has been extensively researched for its potential role in tissue repair and regeneration.

Research has indicated that BPC-157 may support healing of various tissues including muscles, tendons, ligaments, and the gastrointestinal tract. Studies suggest it may work by modulating growth factor signaling pathways and promoting angiogenesis.

This compound is for research purposes only and has not been approved by the FDA for human therapeutic use.`,
    benefits: [
      'Promotes tissue and wound healing',
      'Supports musculoskeletal recovery',
      'May aid gastrointestinal health',
      'Studied for anti-inflammatory properties',
      'Research suggests neuroprotective effects',
    ],
    specifications: [
      { label: 'Purity',      value: '≥99.1% (HPLC)' },
      { label: 'Form',        value: 'Lyophilized Powder' },
      { label: 'Weight',      value: '5mg per vial' },
      { label: 'CAS Number',  value: '137525-51-0' },
      { label: 'Sequence',    value: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val' },
      { label: 'Molecular Weight', value: '1419.53 g/mol' },
      { label: 'Storage',     value: '-20°C, protect from light' },
      { label: 'Reconstitution', value: 'Bacteriostatic water' },
    ],
    reviewsList: [
      { author: 'Dr. M. Chen',    rating: 5, date: 'May 2025', text: 'Exceptional purity verified by our lab. Consistent results across multiple research protocols.' },
      { author: 'R. Thompson',    rating: 5, date: 'Apr 2025', text: 'Fast shipping and the CoA matched our independent testing. Will order again.' },
      { author: 'S. Patel',       rating: 5, date: 'Mar 2025', text: 'Best source we have found. Dissolved cleanly with no particulate matter.' },
    ],
  },
  {
    id: 2,
    name: 'TB-500',
    subtitle: 'Thymosin Beta-4',
    fullName: 'TB-500 — Thymosin Beta-4',
    price: 59.99,
    originalPrice: null,
    badge: 'Popular',
    badgeColor: 'var(--purple)',
    Icon: Beaker,
    category: 'Healing & Recovery',
    rating: 4.8,
    reviews: 178,
    inStock: true,
    purity: '99.3%',
    weight: '5mg',
    casNumber: '77591-33-4',
    desc: 'TB-500 is a synthetic version of Thymosin Beta-4, an actin-sequestering protein. Widely studied for tissue repair and anti-inflammatory properties across multiple tissue types.',
    longDesc: `TB-500, the synthetic form of the naturally occurring peptide Thymosin Beta-4, has been extensively studied for its potential role in tissue repair and regeneration. It is found in virtually all human and animal cells.

Research suggests TB-500 may promote cell migration and proliferation, support angiogenesis, and modulate inflammatory pathways. Studies have explored its potential applications in muscle, tendon, and cardiac tissue repair.

For research purposes only.`,
    benefits: [
      'Studied for muscle tissue repair',
      'May support tendon and ligament healing',
      'Research suggests anti-inflammatory properties',
      'Potential role in cardiac tissue studies',
      'May promote cell migration and proliferation',
    ],
    specifications: [
      { label: 'Purity',      value: '≥99.3% (HPLC)' },
      { label: 'Form',        value: 'Lyophilized Powder' },
      { label: 'Weight',      value: '5mg per vial' },
      { label: 'CAS Number',  value: '77591-33-4' },
      { label: 'Molecular Weight', value: '4963.5 g/mol' },
      { label: 'Storage',     value: '-20°C, protect from light' },
      { label: 'Reconstitution', value: 'Bacteriostatic water' },
    ],
    reviewsList: [
      { author: 'Lab Research Team', rating: 5, date: 'May 2025', text: 'Consistent quality across all our orders. CoA always matches our verification.' },
      { author: 'K. Williams',       rating: 4, date: 'Apr 2025', text: 'Good product, fast delivery. Purity confirmed at our facility.' },
    ],
  },
  {
    id: 3, name: 'Semaglutide', subtitle: 'GLP-1 Receptor Agonist', fullName: 'Semaglutide — GLP-1 Receptor Agonist',
    price: 79.99, originalPrice: null, badge: 'New', badgeColor: 'var(--pink)', Icon: Pill,
    category: 'Metabolic Research', rating: 4.7, reviews: 92, inStock: true, purity: '98.9%', weight: '5mg',
    casNumber: '910463-68-2',
    desc: 'Semaglutide is a GLP-1 receptor agonist research peptide studied extensively for metabolic research and appetite regulation pathways.',
    longDesc: 'Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist that has been widely studied in metabolic research. For research purposes only.',
    benefits: ['Studied for metabolic pathway research', 'GLP-1 receptor binding studies', 'Appetite regulation research', 'Insulin secretion studies'],
    specifications: [
      { label: 'Purity', value: '≥98.9% (HPLC)' }, { label: 'Form', value: 'Lyophilized Powder' },
      { label: 'Weight', value: '5mg per vial' }, { label: 'CAS Number', value: '910463-68-2' },
      { label: 'Storage', value: '-20°C, protect from light' },
    ],
    reviewsList: [{ author: 'Research Lab A', rating: 5, date: 'May 2025', text: 'Excellent purity. Confirmed with our HPLC.' }],
  },
  {
    id: 4, name: 'CJC-1295', subtitle: 'Growth Hormone Releasing', fullName: 'CJC-1295 — GHRH Analogue',
    price: 54.99, originalPrice: null, badge: 'Top Rated', badgeColor: '#34d399', Icon: Dna,
    category: 'Hormonal Research', rating: 4.8, reviews: 143, inStock: true, purity: '99.0%', weight: '2mg',
    casNumber: '863288-34-0',
    desc: 'CJC-1295 is a synthetic analogue of growth hormone-releasing hormone (GHRH). Studied for its role in stimulating growth hormone secretion.',
    longDesc: 'CJC-1295 is a tetrasubstituted 30-amino acid peptide hormone, primarily functioning as a GHRH analogue. For research purposes only.',
    benefits: ['GHRH analogue research', 'Growth hormone secretion studies', 'Pituitary research applications', 'IGF-1 pathway studies'],
    specifications: [
      { label: 'Purity', value: '≥99.0% (HPLC)' }, { label: 'Form', value: 'Lyophilized Powder' },
      { label: 'Weight', value: '2mg per vial' }, { label: 'CAS Number', value: '863288-34-0' },
      { label: 'Storage', value: '-20°C, protect from light' },
    ],
    reviewsList: [{ author: 'Dr. A. Roberts', rating: 5, date: 'Apr 2025', text: 'Consistent and reliable. Our go-to source.' }],
  },
];

const relatedProducts = allProducts.slice(0, 3);

/* ── Page ────────────────────────────────────────────────── */
export default function ProductDetailPage({ params }) {
  const productId = parseInt(params?.id || '1');
  const product = allProducts.find(p => p.id === productId) || allProducts[0];

  const [qty, setQty]             = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { Icon, badgeColor = 'var(--primary-blue)' } = product;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const tabs = ['description', 'specifications', 'reviews'];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.82rem', color: 'var(--text-muted)',
          marginBottom: '32px', flexWrap: 'wrap',
        }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >Shop</Link>
          <ChevronRight size={13} />
          <Link href="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >{product.category}</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--primary-blue)' }}>{product.name}</span>
        </nav>

        {/* ── Main Product Layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: '48px',
          marginBottom: '64px',
          alignItems: 'start',
        }}>

          {/* ── Left: Product Visual ── */}
          <div>
            {/* Main image card */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '60px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
              marginBottom: '16px',
              overflow: 'hidden',
            }}>
              {/* Glow bg */}
              <div style={{
                position: 'absolute',
                width: '200px', height: '200px', borderRadius: '50%',
                background: `radial-gradient(circle, ${badgeColor}25 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              {/* Grid pattern */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.03,
                backgroundImage: `linear-gradient(rgba(0,207,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,1) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }} />

              {/* Icon */}
              <div style={{
                position: 'relative', zIndex: 1,
                width: 140, height: 140,
                borderRadius: 'var(--radius-xl)',
                background: `${badgeColor}18`,
                border: `2px solid ${badgeColor}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 40px ${badgeColor}30`,
              }}>
                {Icon && <Icon size={64} color={badgeColor} />}
              </div>

              {/* Badge */}
              {product.badge && (
                <div style={{
                  position: 'absolute', top: '20px', left: '20px',
                  padding: '6px 14px',
                  background: `${badgeColor}20`,
                  border: `1px solid ${badgeColor}50`,
                  borderRadius: '999px',
                  fontSize: '0.72rem', fontWeight: 700,
                  color: badgeColor, letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>{product.badge}</div>
              )}

              {/* Share */}
              <button style={{
                position: 'absolute', top: '20px', right: '20px',
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '50%',
                color: 'var(--text-muted)', cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-blue)'; e.currentTarget.style.borderColor = 'var(--primary-blue)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              >
                <Share2 size={15} />
              </button>
            </div>

            {/* Trust row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
              gap: '10px',
            }}>
              {[
                { Icon: Shield, label: 'Lab Verified',    sub: '3rd-party tested' },
                { Icon: Truck,  label: 'Fast Shipping',   sub: 'Ships in 24hrs' },
                { Icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
              ].map(t => (
                <div key={t.label} style={{
                  background: 'var(--card-dark)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 12px',
                  textAlign: 'center',
                }}>
                  <t.Icon size={18} color="var(--primary-blue)" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '2px' }}>{t.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Category tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px',
              background: `${badgeColor}15`,
              border: `1px solid ${badgeColor}30`,
              borderRadius: '999px',
              fontSize: '0.72rem', fontWeight: 600,
              color: badgeColor,
              width: 'fit-content',
            }}>
              <FlaskConical size={11} />
              {product.category}
            </div>

            {/* Name */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}>{product.name}</h1>
                <BadgeCheck size={22} color="var(--primary-blue)" />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{product.subtitle}</p>
            </div>

            {/* Rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16}
                    fill={i <= Math.round(product.rating) ? '#fbbf24' : 'none'}
                    color={i <= Math.round(product.rating) ? '#fbbf24' : 'var(--text-muted)'}
                  />
                ))}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {product.rating} / 5.0
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ({product.reviews} reviews)
              </span>
              <span style={{
                padding: '3px 10px',
                background: 'rgba(52,211,153,0.12)',
                border: '1px solid rgba(52,211,153,0.3)',
                borderRadius: '999px',
                fontSize: '0.72rem', fontWeight: 600,
                color: '#34d399',
              }}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.4rem', fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', textDecoration: 'line-through' }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    background: 'rgba(236,72,153,0.12)',
                    border: '1px solid rgba(236,72,153,0.3)',
                    borderRadius: '999px',
                    fontSize: '0.78rem', fontWeight: 700,
                    color: 'var(--pink)',
                  }}>
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Purity + weight quick stats */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { label: 'Purity',  value: product.purity },
                { label: 'Amount',  value: product.weight },
                { label: 'Form',    value: 'Lyophilized' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '10px 16px',
                  background: 'var(--card-dark)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem', fontWeight: 800,
                    color: 'var(--primary-blue)',
                  }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Short desc */}
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              padding: '16px',
              background: 'rgba(0,207,255,0.04)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
            }}>{product.desc}</p>

            {/* Disclaimer */}
            <div style={{
              display: 'flex', gap: '8px',
              padding: '12px 14px',
              background: 'rgba(251,191,36,0.06)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: 'var(--radius-md)',
            }}>
              <Info size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                For research purposes only. Not intended for human consumption. Must be handled by qualified researchers.
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.82rem', fontWeight: 600,
                color: 'var(--text-secondary)', marginBottom: '10px',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: 'fit-content' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRight: 'none',
                    borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                    color: 'var(--text-light)', cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,207,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--card-dark)'}
                >
                  <Minus size={14} />
                </button>
                <div style={{
                  width: 52, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--glass-border)',
                  fontWeight: 700, fontSize: '0.95rem',
                }}>{qty}</div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    borderLeft: 'none',
                    borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                    color: 'var(--text-light)', cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,207,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--card-dark)'}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{
                  flex: 1, minWidth: '160px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px 24px',
                  background: addedToCart ? 'linear-gradient(135deg,#34d399,#059669)' : 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff', fontWeight: 700, fontSize: '1rem',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  opacity: product.inStock ? 1 : 0.5,
                  transition: 'all var(--transition-base)',
                  boxShadow: addedToCart ? '0 0 20px rgba(52,211,153,0.4)' : 'var(--glow-blue)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {addedToCart
                  ? <><CheckCircle2 size={16} /> Added!</>
                  : <><ShoppingCart size={16} /> Add to Cart</>
                }
              </button>

              <button
                onClick={() => setWishlisted(w => !w)}
                style={{
                  width: 50, height: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: wishlisted ? 'rgba(236,72,153,0.15)' : 'var(--card-dark)',
                  border: `1px solid ${wishlisted ? 'var(--pink)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: wishlisted ? 'var(--pink)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                }}
              >
                <Heart size={18} fill={wishlisted ? 'var(--pink)' : 'none'} />
              </button>
            </div>

            {/* Subtotal */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Subtotal ({qty} {qty === 1 ? 'item' : 'items'})
              </span>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem', fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>${(product.price * qty).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div style={{ marginBottom: '64px' }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex', gap: '4px',
            borderBottom: '1px solid var(--glass-border)',
            marginBottom: '32px',
          }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '12px 24px',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--primary-blue)' : 'transparent'}`,
                color: activeTab === tab ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)',
                marginBottom: '-1px',
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Description tab */}
          {activeTab === 'description' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)',
              gap: '40px',
            }}>
              <div>
                <p style={{
                  color: 'var(--text-secondary)', lineHeight: 1.9,
                  fontSize: '0.95rem', whiteSpace: 'pre-line',
                  marginBottom: '28px',
                }}>{product.longDesc}</p>

                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem', fontWeight: 700,
                  marginBottom: '16px', color: 'var(--text-light)',
                }}>Research Benefits</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.benefits?.map(b => (
                    <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={15} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                height: 'fit-content',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem', fontWeight: 700,
                  color: 'var(--primary-blue)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  marginBottom: '16px',
                }}>Research Notice</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.7, marginBottom: '14px' }}>
                  All products are intended for laboratory research use only. They are not approved for human or veterinary use.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.7 }}>
                  Researchers must be qualified professionals operating within applicable legal frameworks and institutional guidelines.
                </p>
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,207,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Package size={13} color="var(--primary-blue)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-blue)' }}>Ships with CoA</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Every order includes a Certificate of Analysis from our third-party laboratory.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Specifications tab */}
          {activeTab === 'specifications' && (
            <div style={{ maxWidth: '700px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {product.specifications?.map((spec, i) => (
                    <tr key={spec.label} style={{
                      background: i % 2 === 0 ? 'transparent' : 'rgba(0,207,255,0.02)',
                    }}>
                      <td style={{
                        padding: '14px 20px 14px 0',
                        borderBottom: '1px solid var(--glass-border)',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        width: '40%',
                      }}>{spec.label}</td>
                      <td style={{
                        padding: '14px 0',
                        borderBottom: '1px solid var(--glass-border)',
                        color: 'var(--text-light)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Summary row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '24px',
                padding: '24px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '8px',
                flexWrap: 'wrap',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '3rem', fontWeight: 900,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{product.rating}</div>
                  <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={14}
                        fill={i <= Math.round(product.rating) ? '#fbbf24' : 'none'}
                        color={i <= Math.round(product.rating) ? '#fbbf24' : 'var(--text-muted)'}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {product.reviews} reviews
                  </div>
                </div>
              </div>

              {product.reviewsList?.map((rev, i) => (
                <div key={i} style={{
                  padding: '20px 24px',
                  background: 'var(--card-dark)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                      }}>{rev.author[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rev.author}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12}
                          fill={i <= rev.rating ? '#fbbf24' : 'none'}
                          color={i <= rev.rating ? '#fbbf24' : 'var(--text-muted)'}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>{rev.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Related Products ── */}
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.3rem,3vw,1.8rem)',
              fontWeight: 800,
            }}>
              Related{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Products</span>
            </h2>
            <Link href="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              color: 'var(--primary-blue)', fontSize: '0.875rem', fontWeight: 500,
              textDecoration: 'none',
            }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {relatedProducts.filter(p => p.id !== product.id).slice(0, 3).map(p => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
          .desc-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Related Card ────────────────────────────────────────── */
function RelatedCard({ product }) {
  const { id, name, subtitle, price, badgeColor = 'var(--primary-blue)', Icon } = product;

  return (
    <Link href={`/product/${id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--card-dark)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex', gap: '16px', alignItems: 'center',
        transition: 'all var(--transition-base)',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = 'var(--glow-blue)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--glass-border)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{
          width: 52, height: 52, flexShrink: 0,
          borderRadius: 'var(--radius-md)',
          background: `${badgeColor}15`,
          border: `1px solid ${badgeColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Icon && <Icon size={24} color={badgeColor} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>{name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{subtitle}</div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.95rem', fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>${price.toFixed(2)}</div>
        </div>
        <ArrowRight size={14} color="var(--text-muted)" />
      </div>
    </Link>
  );
}
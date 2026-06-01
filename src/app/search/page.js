'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search, FlaskConical, Beaker, Pill, Dna,
  Brain, Microscope, Zap, HeartPulse, Sparkles,
  Dumbbell, BookOpen, ArrowRight, BadgeCheck,
  Star, SlidersHorizontal, X, Package,
} from 'lucide-react';

/* ── Mock search data ────────────────────────────────────── */
const allProducts = [
  { id: 1,  name: 'BPC-157',     subtitle: 'Body Protection Compound',  price: 49.99, Icon: FlaskConical, badgeColor: 'var(--primary-blue)', category: 'Healing & Recovery',  rating: 4.9, reviews: 214, inStock: true,  type: 'product' },
  { id: 2,  name: 'TB-500',      subtitle: 'Thymosin Beta-4',           price: 59.99, Icon: Beaker,       badgeColor: 'var(--purple)',        category: 'Healing & Recovery',  rating: 4.8, reviews: 178, inStock: true,  type: 'product' },
  { id: 3,  name: 'Semaglutide', subtitle: 'GLP-1 Receptor Agonist',    price: 79.99, Icon: Pill,         badgeColor: 'var(--pink)',          category: 'Metabolic Research',  rating: 4.7, reviews: 92,  inStock: true,  type: 'product' },
  { id: 4,  name: 'CJC-1295',   subtitle: 'Growth Hormone Releasing',  price: 54.99, Icon: Dna,          badgeColor: '#34d399',              category: 'Hormonal Research',   rating: 4.8, reviews: 143, inStock: true,  type: 'product' },
  { id: 5,  name: 'Ipamorelin',  subtitle: 'GH Secretagogue',          price: 44.99, Icon: Microscope,   badgeColor: 'var(--primary-blue)', category: 'Hormonal Research',   rating: 4.6, reviews: 87,  inStock: true,  type: 'product' },
  { id: 6,  name: 'Tirzepatide', subtitle: 'GIP/GLP-1 Agonist',        price: 89.99, Icon: Zap,          badgeColor: 'var(--pink)',          category: 'Metabolic Research',  rating: 4.9, reviews: 61,  inStock: true,  type: 'product' },
  { id: 7,  name: 'Selank',      subtitle: 'Anxiolytic Peptide',        price: 39.99, Icon: Brain,        badgeColor: 'var(--purple)',        category: 'Cognitive Peptides',  rating: 4.5, reviews: 55,  inStock: false, type: 'product' },
  { id: 8,  name: 'Semax',       subtitle: 'Cognitive Enhancer',        price: 42.99, Icon: Brain,        badgeColor: 'var(--purple)',        category: 'Cognitive Peptides',  rating: 4.7, reviews: 69,  inStock: true,  type: 'product' },
  { id: 9,  name: 'Epithalon',   subtitle: 'Telomere Peptide',          price: 64.99, Icon: Sparkles,     badgeColor: '#34d399',              category: 'Anti-Aging',          rating: 4.6, reviews: 48,  inStock: true,  type: 'product' },
  { id: 10, name: 'Follistatin', subtitle: 'Myostatin Inhibitor',       price: 94.99, Icon: Dumbbell,     badgeColor: '#fbbf24',              category: 'Performance',         rating: 4.8, reviews: 33,  inStock: true,  type: 'product' },
  { id: 11, name: 'MOTS-c',     subtitle: 'Mitochondrial Peptide',     price: 74.99, Icon: HeartPulse,   badgeColor: 'var(--primary-blue)', category: 'Anti-Aging',          rating: 4.5, reviews: 27,  inStock: true,  type: 'product' },
];

const allBlogPosts = [
  { id: 1, title: 'BPC-157: A Comprehensive Review of Tissue Repair Research', category: 'Research Review', readTime: '8 min', Icon: FlaskConical, iconColor: 'var(--primary-blue)', type: 'blog' },
  { id: 2, title: 'Understanding GLP-1 Receptor Agonists in Metabolic Research', category: 'Metabolic Research', readTime: '6 min', Icon: Zap, iconColor: 'var(--pink)', type: 'blog' },
  { id: 3, title: 'Cognitive Peptides: Selank and Semax in Neuroscience Studies', category: 'Neuroscience', readTime: '7 min', Icon: Brain, iconColor: 'var(--purple)', type: 'blog' },
  { id: 4, title: 'TB-500 and Cardiac Tissue: What the Research Shows', category: 'Cardiac Research', readTime: '9 min', Icon: HeartPulse, iconColor: '#f87171', type: 'blog' },
  { id: 5, title: 'Proper Reconstitution and Storage of Lyophilized Peptides', category: 'Research Guide', readTime: '4 min', Icon: FlaskConical, iconColor: '#fbbf24', type: 'blog' },
];

const filterTabs = ['All', 'Products', 'Blog'];

export default function SearchPage() {
  const searchParams  = useSearchParams();
  const initialQuery  = searchParams.get('q') || '';

  const [query, setQuery]         = useState(initialQuery);
  const [inputVal, setInputVal]   = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const t = setTimeout(() => setQuery(inputVal), 300);
    return () => clearTimeout(t);
  }, [inputVal]);

  const matchProduct = (p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase());

  const matchBlog = (b) =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.category.toLowerCase().includes(query.toLowerCase());

  const productResults = query ? allProducts.filter(matchProduct) : [];
  const blogResults    = query ? allBlogPosts.filter(matchBlog) : [];

  const showProducts = activeFilter === 'All' || activeFilter === 'Products';
  const showBlog     = activeFilter === 'All' || activeFilter === 'Blog';

  const totalResults =
    (showProducts ? productResults.length : 0) +
    (showBlog ? blogResults.length : 0);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Search Hero ── */}
      <div style={{
        padding: '80px 24px 48px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center top, rgba(0,207,255,0.07) 0%, transparent 65%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--primary-blue)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            <Search size={13} /> Site Search
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900,
            marginBottom: '28px',
          }}>
            Search{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Darryl Peptides</span>
          </h1>

          {/* Search input */}
          <div style={{ position: 'relative', maxWidth: '580px', margin: '0 auto' }}>
            <Search size={18} style={{
              position: 'absolute', left: '18px', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              autoFocus
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search products, blog, categories…"
              style={{
                width: '100%', padding: '16px 50px',
                background: 'var(--card-dark)',
                border: '1px solid var(--primary-blue)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)', fontSize: '1rem', outline: 'none',
                boxShadow: 'var(--glow-sm)',
              }}
            />
            {inputVal && (
              <button onClick={() => { setInputVal(''); setQuery(''); }} style={{
                position: 'absolute', right: '16px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex',
              }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '36px' }}>

        {!query ? (
          /* ── Empty / landing state ── */
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '36px', textAlign: 'center' }}>
              Start typing to search products, blog articles, and more.
            </p>

            {/* Popular searches */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700,
                color: 'var(--text-muted)', textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: '12px',
              }}>Popular Searches</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['BPC-157', 'Semaglutide', 'TB-500', 'CJC-1295', 'Selank', 'Epithalon'].map(term => (
                  <button key={term} onClick={() => { setInputVal(term); setQuery(term); }} style={{
                    padding: '8px 16px',
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '999px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-fast)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >{term}</button>
                ))}
              </div>
            </div>

            {/* Browse categories */}
            <div>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700,
                color: 'var(--text-muted)', textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: '16px', textAlign: 'center',
              }}>Browse Categories</p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '12px',
              }}>
                {[
                  { name: 'Healing & Recovery', Icon: HeartPulse,  color: 'var(--primary-blue)' },
                  { name: 'Metabolic Research', Icon: Zap,          color: 'var(--purple)' },
                  { name: 'Cognitive Peptides', Icon: Brain,        color: 'var(--pink)' },
                  { name: 'Anti-Aging',         Icon: Sparkles,     color: '#34d399' },
                  { name: 'Performance',        Icon: Dumbbell,     color: '#fbbf24' },
                  { name: 'Hormonal Research',  Icon: Microscope,   color: 'var(--secondary-blue)' },
                ].map(cat => (
                  <Link key={cat.name} href="/categories" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--card-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px 16px', textAlign: 'center',
                      transition: 'all var(--transition-base)',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${cat.color}44`;
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = `0 0 16px ${cat.color}22`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: `${cat.color}15`,
                        border: `1px solid ${cat.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 10px',
                      }}>
                        <cat.Icon size={20} color={cat.color} />
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {cat.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Results ── */
          <div>
            {/* Results header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
                  {totalResults > 0
                    ? <>{totalResults} result{totalResults !== 1 ? 's' : ''} for "<span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{query}</span>"</>
                    : <>No results for "<span style={{ color: 'var(--text-muted)' }}>{query}</span>"</>
                  }
                </h2>
              </div>

              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {filterTabs.map(tab => (
                  <button key={tab} onClick={() => setActiveFilter(tab)} style={{
                    padding: '7px 16px',
                    borderRadius: '999px',
                    border: `1px solid ${activeFilter === tab ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                    background: activeFilter === tab ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)',
                    color: activeFilter === tab ? 'var(--primary-blue)' : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: activeFilter === tab ? 600 : 400,
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-fast)',
                  }}>{tab}</button>
                ))}
              </div>
            </div>

            {totalResults === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px 24px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
              }}>
                <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '10px' }}>
                  No results found
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                  Try different keywords or browse our shop directly.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/shop" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '11px 22px',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff', fontWeight: 600,
                    textDecoration: 'none', fontFamily: 'var(--font-body)',
                  }}>
                    Browse Shop <ArrowRight size={14} />
                  </Link>
                  <Link href="/contact" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '11px 22px',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)', fontWeight: 500,
                    textDecoration: 'none', fontFamily: 'var(--font-body)',
                  }}>
                    Contact Us
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* Product results */}
                {showProducts && productResults.length > 0 && (
                  <div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '16px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={15} color="var(--primary-blue)" />
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700 }}>
                          Products
                        </h3>
                        <span style={{
                          padding: '2px 8px',
                          background: 'rgba(0,207,255,0.1)',
                          border: '1px solid rgba(0,207,255,0.2)',
                          borderRadius: '999px',
                          fontSize: '0.7rem', fontWeight: 700,
                          color: 'var(--primary-blue)',
                        }}>{productResults.length}</span>
                      </div>
                      <Link href="/shop" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        color: 'var(--primary-blue)', fontSize: '0.82rem',
                        textDecoration: 'none', fontWeight: 500,
                      }}>
                        View All <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap: '14px',
                    }}>
                      {productResults.map(p => (
                        <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            background: 'var(--card-dark)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '16px',
                            display: 'flex', gap: '14px', alignItems: 'center',
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
                              width: 48, height: 48, flexShrink: 0,
                              borderRadius: 'var(--radius-md)',
                              background: `${p.badgeColor}15`,
                              border: `1px solid ${p.badgeColor}30`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <p.Icon size={22} color={p.badgeColor} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</span>
                                <BadgeCheck size={12} color="var(--primary-blue)" />
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{p.subtitle}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: '0.9rem', fontWeight: 800,
                                  background: 'var(--gradient-primary)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                }}>${p.price.toFixed(2)}</span>
                                <span style={{
                                  fontSize: '0.65rem', fontWeight: 600,
                                  color: p.inStock ? '#34d399' : '#f87171',
                                }}>{p.inStock ? '● In Stock' : '● Out of Stock'}</span>
                              </div>
                            </div>
                            <ArrowRight size={14} color="var(--text-muted)" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog results */}
                {showBlog && blogResults.length > 0 && (
                  <div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '16px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={15} color="var(--purple)" />
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700 }}>
                          Blog Articles
                        </h3>
                        <span style={{
                          padding: '2px 8px',
                          background: 'rgba(124,58,237,0.1)',
                          border: '1px solid rgba(124,58,237,0.2)',
                          borderRadius: '999px',
                          fontSize: '0.7rem', fontWeight: 700,
                          color: 'var(--purple)',
                        }}>{blogResults.length}</span>
                      </div>
                      <Link href="/blog" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        color: 'var(--purple)', fontSize: '0.82rem',
                        textDecoration: 'none', fontWeight: 500,
                      }}>
                        View All <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {blogResults.map(post => (
                        <Link key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            background: 'var(--card-dark)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '16px 18px',
                            display: 'flex', gap: '14px', alignItems: 'center',
                            transition: 'all var(--transition-base)',
                          }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                              e.currentTarget.style.background = 'var(--card-elevated)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = 'var(--glass-border)';
                              e.currentTarget.style.background = 'var(--card-dark)';
                            }}
                          >
                            <div style={{
                              width: 42, height: 42, flexShrink: 0,
                              borderRadius: 'var(--radius-md)',
                              background: `${post.iconColor}15`,
                              border: `1px solid ${post.iconColor}30`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <post.Icon size={18} color={post.iconColor} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                fontWeight: 600, fontSize: '0.9rem',
                                color: 'var(--text-light)', marginBottom: '3px',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>{post.title}</p>
                              <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                <span>{post.category}</span>
                                <span>·</span>
                                <span>{post.readTime} read</span>
                              </div>
                            </div>
                            <ArrowRight size={14} color="var(--text-muted)" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Search, Clock, ArrowRight,
  FlaskConical, Brain, HeartPulse, Zap,
  Microscope, Dna, Tag, TrendingUp,
  User, Calendar, X,
} from 'lucide-react';

/* ── Blog data ───────────────────────────────────────────── */
const allPosts = [
  {
    id: 1,
    title: 'BPC-157: A Comprehensive Review of Tissue Repair Research',
    excerpt: 'An in-depth look at the current body of research surrounding BPC-157 and its studied effects on musculoskeletal tissue healing, gastrointestinal health, and neuroprotection.',
    category: 'Research Review',
    Icon: FlaskConical,
    iconColor: 'var(--primary-blue)',
    author: 'Dr. Sarah Chen',
    date: 'May 18, 2026',
    readTime: '8 min read',
    featured: true,
    tags: ['BPC-157', 'Tissue Repair', 'Peptides'],
  },
  {
    id: 2,
    title: 'Understanding GLP-1 Receptor Agonists in Metabolic Research',
    excerpt: 'How semaglutide and tirzepatide are shaping the future of metabolic disorder research. We break down the mechanism of action and latest study findings.',
    category: 'Metabolic Research',
    Icon: Zap,
    iconColor: 'var(--pink)',
    author: 'Dr. James Mitchell',
    date: 'May 10, 2026',
    readTime: '6 min read',
    featured: true,
    tags: ['Semaglutide', 'GLP-1', 'Metabolic'],
  },
  {
    id: 3,
    title: 'Cognitive Peptides: Selank and Semax in Neuroscience Studies',
    excerpt: 'Russian-origin peptides Selank and Semax are gaining global research attention for their potential roles in anxiety, cognitive function, and neuroprotection.',
    category: 'Neuroscience',
    Icon: Brain,
    iconColor: 'var(--purple)',
    author: 'Dr. Priya Nair',
    date: 'Apr 28, 2026',
    readTime: '7 min read',
    featured: false,
    tags: ['Selank', 'Semax', 'Cognitive', 'Nootropics'],
  },
  {
    id: 4,
    title: 'TB-500 and Cardiac Tissue: What the Research Shows',
    excerpt: 'Thymosin Beta-4 has been studied extensively in cardiac repair models. Here we summarise key findings and their implications for future research directions.',
    category: 'Cardiac Research',
    Icon: HeartPulse,
    iconColor: '#f87171',
    author: 'Dr. Sarah Chen',
    date: 'Apr 15, 2026',
    readTime: '9 min read',
    featured: false,
    tags: ['TB-500', 'Cardiac', 'Thymosin'],
  },
  {
    id: 5,
    title: 'Growth Hormone Peptides: CJC-1295 vs Ipamorelin Comparison',
    excerpt: 'Researchers often study CJC-1295 and Ipamorelin in combination. This article examines what current literature says about their individual and combined effects.',
    category: 'Hormonal Research',
    Icon: Dna,
    iconColor: '#34d399',
    author: 'James Whitfield',
    date: 'Apr 02, 2026',
    readTime: '5 min read',
    featured: false,
    tags: ['CJC-1295', 'Ipamorelin', 'Growth Hormone'],
  },
  {
    id: 6,
    title: 'Epithalon and Telomere Biology: Anti-Aging Research Update',
    excerpt: 'Epithalon\'s proposed role in telomere elongation has made it a subject of significant anti-aging research. We review the peer-reviewed literature available to date.',
    category: 'Anti-Aging',
    Icon: Microscope,
    iconColor: 'var(--secondary-blue)',
    author: 'Dr. Priya Nair',
    date: 'Mar 20, 2026',
    readTime: '10 min read',
    featured: false,
    tags: ['Epithalon', 'Telomere', 'Anti-Aging'],
  },
  {
    id: 7,
    title: 'Proper Reconstitution and Storage of Lyophilized Peptides',
    excerpt: 'A practical guide for researchers on reconstituting lyophilized peptides, choosing appropriate solvents, and maintaining stability throughout the research process.',
    category: 'Research Guide',
    Icon: FlaskConical,
    iconColor: '#fbbf24',
    author: 'Dr. Darryl Moore',
    date: 'Mar 05, 2026',
    readTime: '4 min read',
    featured: false,
    tags: ['Storage', 'Reconstitution', 'Guide'],
  },
  {
    id: 8,
    title: 'MOTS-c: The Mitochondrial-Derived Peptide Gaining Research Traction',
    excerpt: 'MOTS-c is a relatively newly discovered peptide originating from mitochondrial DNA. Here\'s a summary of the emerging research on its metabolic and longevity implications.',
    category: 'Metabolic Research',
    Icon: Zap,
    iconColor: 'var(--primary-blue)',
    author: 'Dr. Sarah Chen',
    date: 'Feb 18, 2026',
    readTime: '6 min read',
    featured: false,
    tags: ['MOTS-c', 'Mitochondria', 'Longevity'],
  },
];

const allCategories = ['All', ...new Set(allPosts.map(p => p.category))];
const allTags       = [...new Set(allPosts.flatMap(p => p.tags))];

export default function BlogPage() {
  const [search, setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag]   = useState('');

  const filtered = allPosts.filter(post => {
    const matchCat    = activeCategory === 'All' || post.category === activeCategory;
    const matchTag    = !activeTag || post.tags.includes(activeTag);
    const matchSearch = !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchTag && matchSearch;
  });

  const featured = allPosts.filter(p => p.featured);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--primary-blue)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            <BookOpen size={13} /> Research Blog
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900,
            marginBottom: '12px',
          }}>
            Peptide Research{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Insights</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '28px' }}>
            Expert articles, research summaries, and guides from our science team.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto' }}>
            <Search size={15} style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 40px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex',
              }}><X size={14} /></button>
            )}
          </div>
        </div>
      </div>

      <div className="container">

        {/* ── Featured Posts (only show when no filter active) ── */}
        {!search && activeCategory === 'All' && !activeTag && (
          <div style={{ marginBottom: '56px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '24px',
            }}>
              <TrendingUp size={16} color="var(--primary-blue)" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>
                Featured Articles
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {featured.map(post => (
                <FeaturedCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* ── Main layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '32px',
          alignItems: 'start',
        }}>

          {/* ── Post list ── */}
          <div>
            {/* Category pills */}
            <div style={{
              display: 'flex', gap: '8px',
              flexWrap: 'wrap', marginBottom: '28px',
            }}>
              {allCategories.map(cat => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setActiveTag(''); }} style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  border: `1px solid ${activeCategory === cat && !activeTag ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                  background: activeCategory === cat && !activeTag ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)',
                  color: activeCategory === cat && !activeTag ? 'var(--primary-blue)' : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: activeCategory === cat && !activeTag ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'all var(--transition-fast)',
                }}>{cat}</button>
              ))}
            </div>

            {/* Results info */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
              Showing <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{filtered.length}</span> article{filtered.length !== 1 ? 's' : ''}
              {activeTag && <> tagged <span style={{ color: 'var(--primary-blue)' }}>#{activeTag}</span></>}
            </p>

            {filtered.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 24px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
              }}>
                <BookOpen size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.4 }} />
                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>No articles found.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('All'); setActiveTag(''); }}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--primary-blue)', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500,
                  }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filtered.map(post => (
                  <PostCard key={post.id} post={post} onTagClick={(tag) => { setActiveTag(tag); setActiveCategory('All'); }} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div style={{
            position: 'sticky',
            top: 'calc(var(--navbar-height) + 20px)',
            display: 'flex', flexDirection: 'column', gap: '20px',
          }}>

            {/* Tags cloud */}
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Tag size={14} color="var(--primary-blue)" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700 }}>
                  Popular Tags
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {allTags.map(tag => (
                  <button key={tag} onClick={() => { setActiveTag(activeTag === tag ? '' : tag); setActiveCategory('All'); }}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '999px',
                      border: `1px solid ${activeTag === tag ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                      background: activeTag === tag ? 'rgba(0,207,255,0.1)' : 'var(--bg-dark)',
                      color: activeTag === tag ? 'var(--primary-blue)' : 'var(--text-muted)',
                      fontSize: '0.75rem', fontWeight: activeTag === tag ? 600 : 400,
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                      transition: 'all var(--transition-fast)',
                    }}>
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent posts */}
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Clock size={14} color="var(--primary-blue)" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700 }}>
                  Recent Articles
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {allPosts.slice(0, 4).map(post => (
                  <Link key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', gap: '10px',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      transition: 'background var(--transition-fast)',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-dark)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        borderRadius: 'var(--radius-sm)',
                        background: `${post.iconColor}15`,
                        border: `1px solid ${post.iconColor}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <post.Icon size={16} color={post.iconColor} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '0.8rem', fontWeight: 600,
                          color: 'var(--text-light)',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          marginBottom: '3px',
                        }}>{post.title}</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at top, rgba(0,207,255,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem', fontWeight: 800,
                  marginBottom: '6px',
                }}>Research Newsletter</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.6, marginBottom: '14px' }}>
                  Get the latest peptide research summaries delivered to your inbox monthly.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)',
                    fontFamily: 'var(--font-body)', fontSize: '0.82rem', outline: 'none',
                    marginBottom: '8px',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
                <button style={{
                  width: '100%', padding: '10px',
                  background: 'var(--gradient-primary)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  color: '#fff', fontWeight: 600, fontSize: '0.82rem',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Featured Card ───────────────────────────────────────── */
function FeaturedCard({ post }) {
  return (
    <Link href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--card-dark)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        transition: 'all var(--transition-base)',
        height: '100%',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3), var(--glow-blue)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--glass-border)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Image area */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))',
          padding: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '140px',
          borderBottom: '1px solid var(--glass-border)',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            width: '120px', height: '120px', borderRadius: '50%',
            background: `radial-gradient(circle, ${post.iconColor}20 0%, transparent 70%)`,
          }} />
          <div style={{
            width: 64, height: 64,
            borderRadius: 'var(--radius-lg)',
            background: `${post.iconColor}18`,
            border: `1px solid ${post.iconColor}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
          }}>
            <post.Icon size={30} color={post.iconColor} />
          </div>

          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            padding: '4px 10px',
            background: 'rgba(0,207,255,0.15)',
            border: '1px solid rgba(0,207,255,0.3)',
            borderRadius: '999px',
            fontSize: '0.65rem', fontWeight: 700,
            color: 'var(--primary-blue)', letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>Featured</div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'inline-block',
            padding: '3px 10px', marginBottom: '10px',
            background: `${post.iconColor}15`,
            border: `1px solid ${post.iconColor}30`,
            borderRadius: '999px',
            fontSize: '0.68rem', fontWeight: 700,
            color: post.iconColor, letterSpacing: '0.04em',
          }}>{post.category}</div>

          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem', fontWeight: 800,
            lineHeight: 1.3, marginBottom: '10px',
            color: 'var(--text-light)',
          }}>{post.title}</h3>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.82rem', lineHeight: 1.6,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{post.excerpt}</p>

          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem', color: 'var(--text-muted)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={11} /> {post.author}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={11} /> {post.readTime}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Post Card (list view) ───────────────────────────────── */
function PostCard({ post, onTagClick }) {
  return (
    <div style={{
      background: 'var(--card-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px',
      display: 'flex', gap: '18px',
      transition: 'all var(--transition-base)',
      alignItems: 'flex-start',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,207,255,0.25)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icon */}
      <div style={{
        width: 52, height: 52, flexShrink: 0,
        borderRadius: 'var(--radius-md)',
        background: `${post.iconColor}15`,
        border: `1px solid ${post.iconColor}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <post.Icon size={24} color={post.iconColor} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '2px 9px',
            background: `${post.iconColor}12`,
            border: `1px solid ${post.iconColor}28`,
            borderRadius: '999px',
            fontSize: '0.65rem', fontWeight: 700,
            color: post.iconColor, letterSpacing: '0.04em',
          }}>{post.category}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>·</span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            fontSize: '0.72rem', color: 'var(--text-muted)',
          }}>
            <Clock size={10} /> {post.readTime}
          </span>
        </div>

        <Link href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.97rem', fontWeight: 800,
            lineHeight: 1.3, marginBottom: '8px',
            color: 'var(--text-light)',
            transition: 'color var(--transition-fast)',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-light)'}
          >{post.title}</h3>
        </Link>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.84rem', lineHeight: 1.6,
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{post.excerpt}</p>

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
        }}>
          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <User size={11} /> {post.author}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Calendar size={11} /> {post.date}
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {post.tags.slice(0, 2).map(tag => (
              <button key={tag} onClick={() => onTagClick(tag)} style={{
                padding: '2px 8px',
                background: 'var(--bg-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: '999px',
                fontSize: '0.68rem', color: 'var(--text-muted)',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >#{tag}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Read more arrow */}
      <Link href={`/blog/${post.id}`} style={{
        flexShrink: 0, alignSelf: 'center',
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-dark)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-muted)',
        textDecoration: 'none',
        transition: 'all var(--transition-fast)',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; e.currentTarget.style.background = 'rgba(0,207,255,0.07)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-dark)'; }}
      >
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
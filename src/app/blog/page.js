'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen, Search, Clock, ArrowRight,
  FlaskConical, Brain, HeartPulse, Zap,
  Microscope, Dna, Tag, TrendingUp,
  User, Calendar, X,
} from 'lucide-react';
import { getAllPosts, getCategories, getTags } from '@/lib/api/blog';

/* ── Category → Icon + Color mapping ────────────────────── */
const CATEGORY_MAP = {
  'research review':   { Icon: FlaskConical, color: 'var(--primary-blue)' },
  'metabolic research':{ Icon: Zap,          color: 'var(--pink)'         },
  'neuroscience':      { Icon: Brain,        color: 'var(--purple)'       },
  'cardiac research':  { Icon: HeartPulse,   color: '#f87171'             },
  'hormonal research': { Icon: Dna,          color: '#34d399'             },
  'anti-aging':        { Icon: Microscope,   color: 'var(--secondary-blue)'},
  'research guide':    { Icon: FlaskConical, color: '#fbbf24'             },
  'uncategorized':     { Icon: BookOpen,     color: 'var(--primary-blue)' },
};

function getCategoryMeta(categoryName) {
  const key = (categoryName || '').toLowerCase();
  return CATEGORY_MAP[key] || { Icon: FlaskConical, color: 'var(--primary-blue)' };
}

/* ── Skeleton loader ─────────────────────────────────────── */
function PostSkeleton() {
  return (
    <div style={{
      background: 'var(--card-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px',
      display: 'flex', gap: '18px',
    }}>
      <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 12, width: '30%', background: 'var(--bg-elevated)', borderRadius: 4, marginBottom: 10 }} />
        <div style={{ height: 16, width: '80%', background: 'var(--bg-elevated)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 12, width: '60%', background: 'var(--bg-elevated)', borderRadius: 4 }} />
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function BlogPage() {
  const [allPosts, setAllPosts]           = useState([]);
  const [categories, setCategories]       = useState([]);  // [{ id, name }]
  const [allTags, setAllTags]             = useState([]);   // [{ id, name }]
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const [search, setSearch]               = useState('');
  const [searchInput, setSearchInput]     = useState('');  // debounced
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [activeTag, setActiveTag]         = useState('');
  const [activeTagId, setActiveTagId]     = useState('');

  // Initial load — posts + categories + tags
  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);
        setError(null);
        const [posts, cats, tags] = await Promise.all([
          getAllPosts(),
          getCategories(),
          getTags(),
        ]);
        setAllPosts(posts);
        setCategories(cats);
        setAllTags(tags);
      } catch (err) {
        setError('Failed to load articles. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    async function loadFiltered() {
      try {
        setLoading(true);
        setError(null);
        const posts = await getAllPosts({
          search:     search,
          categoryId: activeCategoryId,
          tagId:      activeTagId,
        });
        setAllPosts(posts);
      } catch (err) {
        setError('Failed to load articles.');
      } finally {
        setLoading(false);
      }
    }
    // Only re-fetch if a filter is actually active
    if (search || activeCategoryId || activeTagId) {
      loadFiltered();
    }
  }, [search, activeCategoryId, activeTagId]);

  // Debounce search input 500ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory(cat.name || 'All');
    setActiveCategoryId(cat.id || '');
    setActiveTag('');
    setActiveTagId('');
  }, []);

  const handleTagClick = useCallback((tag) => {
    setActiveTag(tag.name);
    setActiveTagId(tag.id);
    setActiveCategory('All');
    setActiveCategoryId('');
  }, []);

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setActiveCategory('All');
    setActiveCategoryId('');
    setActiveTag('');
    setActiveTagId('');
    // Reload all posts
    getAllPosts().then(setAllPosts).catch(console.error);
  };

  const featured     = allPosts.filter(p => p.featured);
  const showFeatured = !search && activeCategory === 'All' && !activeTag && featured.length > 0;

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
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
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
            {searchInput && (
              <button onClick={clearFilters} style={{
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

        {/* ── Error ── */}
        {error && (
          <div style={{
            textAlign: 'center', padding: '24px',
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: 'var(--radius-lg)',
            color: '#f87171', marginBottom: '32px',
          }}>
            {error}
          </div>
        )}

        {/* ── Featured Posts ── */}
        {showFeatured && (
          <div style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
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
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {/* All pill */}
              <button onClick={() => handleCategoryClick({ name: 'All', id: '' })} style={{
                padding: '7px 16px', borderRadius: '999px',
                border: `1px solid ${activeCategory === 'All' && !activeTag ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                background: activeCategory === 'All' && !activeTag ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)',
                color: activeCategory === 'All' && !activeTag ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: activeCategory === 'All' && !activeTag ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all var(--transition-fast)',
              }}>All</button>

              {categories.map(cat => (
                <button key={cat.id} onClick={() => handleCategoryClick(cat)} style={{
                  padding: '7px 16px', borderRadius: '999px',
                  border: `1px solid ${activeCategory === cat.name ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                  background: activeCategory === cat.name ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)',
                  color: activeCategory === cat.name ? 'var(--primary-blue)' : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: activeCategory === cat.name ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'all var(--transition-fast)',
                }}>{cat.name}</button>
              ))}
            </div>

            {/* Results info */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
              {loading ? 'Loading…' : (
                <>
                  Showing <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{allPosts.length}</span> article{allPosts.length !== 1 ? 's' : ''}
                  {activeTag && <> tagged <span style={{ color: 'var(--primary-blue)' }}>#{activeTag}</span></>}
                </>
              )}
            </p>

            {/* Posts */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1,2,3].map(i => <PostSkeleton key={i} />)}
              </div>
            ) : allPosts.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 24px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
              }}>
                <BookOpen size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.4 }} />
                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>No articles found.</p>
                <button onClick={clearFilters} style={{
                  background: 'none', border: 'none',
                  color: 'var(--primary-blue)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500,
                }}>Clear filters</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allPosts.map(post => (
                  <PostCard key={post.id} post={post} onTagClick={(tag) => handleTagClick(tag)} />
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
                  <button key={tag.id}
                    onClick={() => activeTag === tag.name ? clearFilters() : handleTagClick(tag)}
                    style={{
                      padding: '5px 11px', borderRadius: '999px',
                      border: `1px solid ${activeTag === tag.name ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                      background: activeTag === tag.name ? 'rgba(0,207,255,0.1)' : 'var(--bg-dark)',
                      color: activeTag === tag.name ? 'var(--primary-blue)' : 'var(--text-muted)',
                      fontSize: '0.75rem', fontWeight: activeTag === tag.name ? 600 : 400,
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                      transition: 'all var(--transition-fast)',
                    }}>
                    #{tag.name}
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
                {allPosts.slice(0, 4).map(post => {
                  const { Icon, color } = getCategoryMeta(post.category);
                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', gap: '10px', padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        transition: 'background var(--transition-fast)',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-dark)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{
                          width: 36, height: 36, flexShrink: 0,
                          borderRadius: 'var(--radius-sm)',
                          background: `${color}15`,
                          border: `1px solid ${color}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon size={16} color={color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: '0.8rem', fontWeight: 600,
                            color: 'var(--text-light)', lineHeight: 1.4,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            marginBottom: '3px',
                          }}>{post.title}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 800, marginBottom: '6px' }}>
                  Research Newsletter
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.6, marginBottom: '14px' }}>
                  Get the latest peptide research summaries delivered to your inbox monthly.
                </p>
                <input type="email" placeholder="your@email.com" style={{
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
  const { Icon, color } = getCategoryMeta(post.category);
  const iconColor = post.iconColor !== 'var(--primary-blue)' ? post.iconColor : color;

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
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
        {/* Image / Icon area */}
        <div style={{
          position: 'relative',
          background: post.image
            ? `url(${post.image}) center/cover`
            : 'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))',
          padding: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '140px',
          borderBottom: '1px solid var(--glass-border)',
          overflow: 'hidden',
        }}>
          {!post.image && (
            <>
              <div style={{
                position: 'absolute', width: '120px', height: '120px', borderRadius: '50%',
                background: `radial-gradient(circle, ${iconColor}20 0%, transparent 70%)`,
              }} />
              <div style={{
                width: 64, height: 64, borderRadius: 'var(--radius-lg)',
                background: `${iconColor}18`, border: `1px solid ${iconColor}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
              }}>
                <Icon size={30} color={iconColor} />
              </div>
            </>
          )}
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
            display: 'inline-block', padding: '3px 10px', marginBottom: '10px',
            background: `${iconColor}15`, border: `1px solid ${iconColor}30`,
            borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700,
            color: iconColor, letterSpacing: '0.04em',
          }}>{post.category}</div>

          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800,
            lineHeight: 1.3, marginBottom: '10px', color: 'var(--text-light)',
          }}>{post.title}</h3>

          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6,
            marginBottom: '16px',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{post.excerpt}</p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
  const { Icon, color } = getCategoryMeta(post.category);
  const iconColor = post.iconColor !== 'var(--primary-blue)' ? post.iconColor : color;

  return (
    <div style={{
      background: 'var(--card-dark)', border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)', padding: '22px',
      display: 'flex', gap: '18px',
      transition: 'all var(--transition-base)', alignItems: 'flex-start',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.25)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Icon */}
      <div style={{
        width: 52, height: 52, flexShrink: 0, borderRadius: 'var(--radius-md)',
        background: `${iconColor}15`, border: `1px solid ${iconColor}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={24} color={iconColor} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '2px 9px', background: `${iconColor}12`, border: `1px solid ${iconColor}28`,
            borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700,
            color: iconColor, letterSpacing: '0.04em',
          }}>{post.category}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <Clock size={10} /> {post.readTime}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '0.97rem', fontWeight: 800,
            lineHeight: 1.3, marginBottom: '8px', color: 'var(--text-light)',
            transition: 'color var(--transition-fast)',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-light)'}
          >{post.title}</h3>
        </Link>

        <p style={{
          color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.6,
          marginBottom: '12px',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{post.excerpt}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <User size={11} /> {post.author}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Calendar size={11} /> {post.date}
            </div>
          </div>

          {/* Tags — pass tag object to handler */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {post.tags.slice(0, 2).map(tag => (
              <button key={tag} onClick={() => onTagClick({ id: tag, name: tag })} style={{
                padding: '2px 8px', background: 'var(--bg-dark)',
                border: '1px solid var(--glass-border)', borderRadius: '999px',
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

      {/* Arrow */}
      <Link href={`/blog/${post.slug}`} style={{
        flexShrink: 0, alignSelf: 'center',
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', textDecoration: 'none',
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
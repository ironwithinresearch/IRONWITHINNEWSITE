'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/api/blog';
import {
  BookOpen, Clock, User, Calendar, ArrowLeft,
  Tag, FlaskConical, Brain, HeartPulse, Zap,
  Microscope, Dna, ArrowRight, Loader2,
} from 'lucide-react';

/* ── Category → Icon + Color (same as blog listing) ── */
const CATEGORY_MAP = {
  'research review':    { Icon: FlaskConical, color: 'var(--primary-blue)'    },
  'metabolic research': { Icon: Zap,          color: 'var(--pink)'            },
  'neuroscience':       { Icon: Brain,        color: 'var(--purple)'          },
  'cardiac research':   { Icon: HeartPulse,   color: '#f87171'                },
  'hormonal research':  { Icon: Dna,          color: '#34d399'                },
  'anti-aging':         { Icon: Microscope,   color: 'var(--secondary-blue)'  },
  'research guide':     { Icon: FlaskConical, color: '#fbbf24'                },
  'uncategorized':      { Icon: BookOpen,     color: 'var(--primary-blue)'    },
};

function getCategoryMeta(categoryName) {
  const key = (categoryName || '').toLowerCase();
  return CATEGORY_MAP[key] || { Icon: FlaskConical, color: 'var(--primary-blue)' };
}

export default function BlogPostPage() {
  const { slug }          = useParams();
  const [post, setPost]   = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      try {
        setLoading(true);
        const data = await getPostBySlug(slug);
        if (!data) { setError('Post not found.'); return; }
        setPost(data);

        // load related posts (same category, exclude current)
        const all = await getAllPosts({ perPage: 6 });
        setRelated(
          all.filter(p => p.slug !== slug && p.category === data.category).slice(0, 3)
        );
      } catch (err) {
        setError('Failed to load article.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={36} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Error / 404 ── */
  if (error || !post) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '40px' }}>
      <BookOpen size={48} color="var(--text-muted)" style={{ opacity: 0.4 }} />
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Article Not Found</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{error || 'This article does not exist.'}</p>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
        <ArrowLeft size={14} /> Back to Blog
      </Link>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const { Icon, color } = getCategoryMeta(post.category);
  const iconColor = post.iconColor && post.iconColor !== 'var(--primary-blue)' ? post.iconColor : color;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Hero ── */}
      <div className="page-header" style={{ paddingBottom: '40px' }}>
        <div className="container">

          {/* Back link */}
          <Link href="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-muted)', textDecoration: 'none',
            fontSize: '0.82rem', fontWeight: 500, marginBottom: '20px',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={14} /> Back to Blog
          </Link>

          {/* Category badge */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px',
              background: `${iconColor}15`, border: `1px solid ${iconColor}35`,
              borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
              color: iconColor, letterSpacing: '0.05em',
            }}>
              <Icon size={12} color={iconColor} />
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
            fontWeight: 900, lineHeight: 1.2,
            marginBottom: '16px', maxWidth: '780px',
          }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p style={{
              color: 'var(--text-secondary)', fontSize: '1.05rem',
              lineHeight: 1.7, maxWidth: '680px', marginBottom: '24px',
            }}>
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={12} color="#fff" />
              </div>
              {post.author}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Calendar size={13} /> {post.date}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Clock size={13} /> {post.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured image ── */}
      {post.image && (
        <div className="container" style={{ marginBottom: '0' }}>
          <div style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--glass-border)',
            maxHeight: '460px',
          }}>
            <img
              src={post.image}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* ── Main content layout ── */}
      <div className="container" style={{ paddingTop: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '40px',
          alignItems: 'start',
        }}>

          {/* ── Article body ── */}
          <article>
            <div
              style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '36px',
              }}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{
                marginTop: '24px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
              }}>
                <Tag size={14} color="var(--primary-blue)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Tags:</span>
                {post.tags.map(tag => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} style={{ textDecoration: 'none' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: 'var(--bg-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '999px',
                      fontSize: '0.75rem', color: 'var(--text-muted)',
                      transition: 'all 0.15s',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >#{tag}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Related posts */}
            {related.length > 0 && (
              <div style={{ marginTop: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                  <BookOpen size={15} color="var(--primary-blue)" />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>
                    Related Articles
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {related.map(rel => {
                    const { Icon: RelIcon, color: relColor } = getCategoryMeta(rel.category);
                    return (
                      <Link key={rel.id} href={`/blog/${rel.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          background: 'var(--card-dark)', border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-lg)', padding: '16px 20px',
                          display: 'flex', gap: '14px', alignItems: 'center',
                          transition: 'all 0.2s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.25)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                        >
                          <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 'var(--radius-md)', background: `${relColor}15`, border: `1px solid ${relColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <RelIcon size={18} color={relColor} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '3px', color: 'var(--text-light)' }}>{rel.title}</p>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={10} /> {rel.readTime}
                            </span>
                          </div>
                          <ArrowRight size={15} color="var(--text-muted)" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <aside style={{
            position: 'sticky',
            top: 'calc(var(--navbar-height) + 20px)',
            display: 'flex', flexDirection: 'column', gap: '20px',
          }}>

            {/* Article info card */}
            <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '22px' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>
                Article Info
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Author',    val: post.author,   IconC: User     },
                  { label: 'Published', val: post.date,     IconC: Calendar },
                  { label: 'Read Time', val: post.readTime, IconC: Clock    },
                  { label: 'Category',  val: post.category, IconC: Icon     },
                ].map(({ label, val, IconC }) => (
                  <div key={label} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconC size={13} color="var(--primary-blue)" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500 }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '22px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(0,207,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 800, marginBottom: '6px' }}>Research Newsletter</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.6, marginBottom: '14px' }}>
                  Get the latest peptide research summaries monthly.
                </p>
                <input type="email" placeholder="your@email.com" style={{
                  width: '100%', padding: '10px 12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', outline: 'none', marginBottom: '8px', boxSizing: 'border-box',
                }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
                <button style={{ width: '100%', padding: '10px', background: 'var(--gradient-primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Subscribe
                </button>
              </div>
            </div>

            {/* Back to blog */}
            <Link href="/blog" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '13px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)', color: 'var(--text-secondary)',
                fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <ArrowLeft size={14} /> All Articles
              </div>
            </Link>
          </aside>
        </div>
      </div>

      {/* ── Blog content styles ── */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

        .blog-content {
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 0.97rem;
          line-height: 1.85;
        }
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4 {
          font-family: var(--font-heading);
          color: var(--text-light);
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .blog-content h2 { font-size: 1.4rem; }
        .blog-content h3 { font-size: 1.15rem; }
        .blog-content h4 { font-size: 1rem; }
        .blog-content p  { margin-bottom: 1.2rem; }
        .blog-content a  { color: var(--primary-blue); text-decoration: underline; }
        .blog-content ul,
        .blog-content ol { padding-left: 1.5rem; margin-bottom: 1.2rem; }
        .blog-content li { margin-bottom: 0.4rem; }
        .blog-content blockquote {
          border-left: 3px solid var(--primary-blue);
          padding: 12px 20px;
          margin: 1.5rem 0;
          background: rgba(0,207,255,0.05);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          color: var(--text-light);
          font-style: italic;
        }
        .blog-content pre,
        .blog-content code {
          background: var(--bg-dark);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
        }
        .blog-content pre  { padding: 16px 20px; overflow-x: auto; margin-bottom: 1.2rem; }
        .blog-content code { padding: 2px 7px; }
        .blog-content img  { max-width: 100%; border-radius: var(--radius-lg); margin: 1rem 0; border: 1px solid var(--glass-border); }
        .blog-content table { width: 100%; border-collapse: collapse; margin-bottom: 1.2rem; }
        .blog-content th,
        .blog-content td {
          padding: 10px 14px;
          border: 1px solid var(--glass-border);
          text-align: left;
          font-size: 0.88rem;
        }
        .blog-content th { background: var(--bg-dark); color: var(--text-light); font-weight: 700; }
        .blog-content hr { border: none; border-top: 1px solid var(--glass-border); margin: 2rem 0; }
      `}</style>
    </div>
  );
}
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/images/Logo.png';

const pages = [
  { label: 'About Us',    href: '/about' },
  { label: 'Blog',        href: '/blog' },
  { label: 'FAQ',         href: '/faq' },
  { label: 'Contact Us',  href: '/contact' },
];

const legal = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy',     href: '/privacy' },
  { label: 'Disclaimer',         href: '/disclaimer' },
  { label: 'Shipping Policy',    href: '/shipping' },
  { label: 'Refund / Return',    href: '/refund' },
];

const account = [
  { label: 'My Account', href: '/account' },
  { label: 'Orders',     href: '/orders' },
  { label: 'Wishlist',   href: '/wishlist' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-deeper)',
      borderTop: '1px solid var(--glass-border)',
      paddingTop: '64px',
      marginTop: 'auto',
    }}>
      {/* ── Glow accent ── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-120px', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '200px',
          background: 'radial-gradient(ellipse, rgba(0,207,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      <div className="container">
        {/* ── Main Footer Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '48px',
          paddingBottom: '56px',
        }}>

          {/* ── Brand Column ── */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image
                  src={Logo}
                  alt="Darryl Peptides Logo"
                  width={40}
                  height={40}
                  style={{
                    borderRadius: '10px',
                    boxShadow: 'var(--glow-blue)',
                  }}
                  priority
                />
              
              </div>
            </Link>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              maxWidth: '220px',
              marginBottom: '20px',
            }}>
              Premium quality research peptides. Trusted by researchers worldwide for purity and precision.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: 'T', label: 'Twitter',   href: '#' },
                { icon: 'in', label: 'LinkedIn',  href: '#' },
                { icon: 'f', label: 'Facebook',   href: '#' },
                { icon: 'IG', label: 'Instagram', href: '#' },
              ].map(s => (
                <a key={s.label} href={s.href} title={s.label} style={{
                  width: 34, height: 34,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--primary-blue)';
                    e.currentTarget.style.color = 'var(--primary-blue)';
                    e.currentTarget.style.boxShadow = 'var(--glow-sm)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* ── Pages Column ── */}
          <FooterColumn title="Pages" links={pages} />

          {/* ── Legal Column ── */}
          <FooterColumn title="Legal" links={legal} />

          {/* ── Account Column ── */}
          <div>
            <FooterColumn title="Account" links={account} />

            {/* Newsletter mini */}
            <div style={{ marginTop: '28px' }}>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: '10px',
                fontWeight: 500,
              }}>Stay Updated</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <button style={{
                  padding: '9px 14px',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}>→</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)',
        }} />

        {/* ── Bottom Bar ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '20px 0',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} Darryl Peptides. All Rights Reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Disclaimer', href: '/disclaimer' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Sub-component ──────────────────────────────────────── */
function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: 'var(--primary-blue)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '16px',
      }}>{title}</h4>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href} style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <span style={{ opacity: 0.4, fontSize: '0.7rem' }}>›</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/images/Logo.png';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 'var(--z-sticky)',
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        background: scrolled
          ? 'rgba(2, 6, 23, 0.97)'
          : 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(0,207,255,0.18)'
          : '1px solid rgba(0,207,255,0.07)',
        transition: 'all var(--transition-base)',
        gap: '24px',
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{ flexShrink: 0, textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image
              src={Logo}
              alt="Darryl Peptides Logo"
              width={38}
              height={38}
              style={{
                borderRadius: '10px',
                boxShadow: 'var(--glow-blue)',
              }}
              priority
            />

          </div>
        </Link>

        {/* ── Center Nav Links (desktop) ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            justifyContent: 'center',
          }}
          className="nav-desktop"
        >
          {navLinks.map(link => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              pathname={pathname}
            />
          ))}
        </div>

        {/* ── Right Actions ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}>
          {/* Search */}
          <IconBtn
            onClick={() => setSearchOpen(s => !s)}
            title="Search"
            active={searchOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </IconBtn>

          {/* Cart */}
          <Link href="/cart" style={{ textDecoration: 'none' }}>
            <div style={{ position: 'relative' }}>
              <IconBtn title="Cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </IconBtn>
              <span style={{
                position: 'absolute',
                top: '-4px', right: '-4px',
                width: '18px', height: '18px',
                borderRadius: '50%',
                background: 'var(--gradient-secondary)',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}>3</span>
            </div>
          </Link>

          {/* Login / Profile */}
          <LoginBtn />

          {/* Hamburger (mobile) */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: 'none', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-light)',
              padding: '8px', cursor: 'pointer',
              display: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Search Dropdown ── */}
      {searchOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--navbar-height)',
          left: 0, right: 0,
          zIndex: 99,
          background: 'rgba(9, 14, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '20px 32px',
        }}>
          <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
            <input
              autoFocus
              type="text"
              placeholder="Search peptides, categories, blog…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 48px 14px 18px',
                background: 'var(--card-dark)',
                border: '1px solid var(--primary-blue)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: 'var(--glow-sm)',
              }}
            />
            <Link href={`/search?q=${searchQuery}`} onClick={() => setSearchOpen(false)}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--primary-blue)',
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--navbar-height)',
          left: 0, right: 0,
          zIndex: 98,
          background: 'rgba(2, 6, 23, 0.99)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
        {navLinks.map(link => {
  const isActive =
    link.href === '/'
      ? pathname === '/'
      : pathname.startsWith(link.href);

  return (
    <Link
      key={link.href}
      href={link.href}
      onClick={() => setMenuOpen(false)}
      style={{
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        color: isActive
          ? 'var(--primary-blue)'
          : 'var(--text-light)',
        background: isActive
          ? 'rgba(0,207,255,0.08)'
          : 'transparent',
        border: isActive
          ? '1px solid var(--primary-blue)'
          : '1px solid transparent',
        fontWeight: isActive ? 600 : 500,
        textDecoration: 'none',
      }}
    >
      {link.label}
    </Link>
  );
})}
          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <Link href="/login" style={{
              flex: 1, textAlign: 'center',
              padding: '11px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff', fontWeight: 600,
              textDecoration: 'none',
            }}>Login</Link>
            <Link href="/cart" style={{
              flex: 1, textAlign: 'center',
              padding: '11px',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-light)', fontWeight: 500,
              textDecoration: 'none',
            }}>🛒 Cart (3)</Link>
          </div>
        </div>
      )}

      {/* ── Spacer ── */}
      <div style={{ height: 'var(--navbar-height)' }} />

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function NavLink({ href, label, pathname }) {
  const isActive =
    href === '/'
      ? pathname === '/'
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      style={{
        padding: '7px 14px',
        borderRadius: 'var(--radius-md)',
        color: isActive
          ? 'var(--primary-blue)'
          : 'var(--text-secondary)',
        fontWeight: isActive ? 600 : 500,
        fontSize: '0.9rem',
        textDecoration: 'none',
        transition: 'all var(--transition-fast)',
        letterSpacing: '0.01em',
        background: isActive
          ? 'rgba(0,207,255,0.08)'
          : 'transparent',
        border: isActive
          ? '1px solid var(--primary-blue)'
          : '1px solid transparent',
        boxShadow: isActive
          ? '0 0 20px rgba(0,207,255,0.15)'
          : 'none',
      }}
    >
      {label}
    </Link>
  );
}

function IconBtn({ children, onClick, title, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 38, height: 38,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(0,207,255,0.1)' : 'transparent',
        border: `1px solid ${active ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
        borderRadius: 'var(--radius-md)',
        color: active ? 'var(--primary-blue)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--primary-blue)';
        e.currentTarget.style.borderColor = 'var(--primary-blue)';
        e.currentTarget.style.background = 'rgba(0,207,255,0.07)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = active ? 'var(--primary-blue)' : 'var(--text-secondary)';
        e.currentTarget.style.borderColor = active ? 'var(--primary-blue)' : 'var(--glass-border)';
        e.currentTarget.style.background = active ? 'rgba(0,207,255,0.1)' : 'transparent';
      }}
    >
      {children}
    </button>
  );
}

function LoginBtn() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href="/login" style={{ textDecoration: 'none' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '8px 18px',
          background: 'var(--gradient-primary)',
          border: hovered ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent',
          borderRadius: 'var(--radius-md)',
          color: '#fff',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          boxShadow: hovered ? 'var(--glow-blue)' : 'var(--glow-sm)',
          transition: 'all var(--transition-base)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Login
      </div>
    </Link>
  );
}
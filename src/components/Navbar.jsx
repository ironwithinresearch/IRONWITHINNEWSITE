'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FlaskConical, ShoppingCart, Heart, User,
  Menu, X, Search, Sun, Moon,
} from 'lucide-react';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/categories', label: 'Categories' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/affiliate', label: 'Affiliates' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // ── Theme toggle state ──
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const stored = localStorage.getItem('iwr-theme') || 'dark';
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('iwr-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 'var(--navbar-height, 68px)',
        background: scrolled
          ? 'rgba(5,7,18,0.92)'
          : 'rgba(5,7,18,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'var(--glass-border)' : 'transparent'}`,
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--glow-blue)',
              flexShrink: 0,
            }}>
              <FlaskConical size={17} color="#fff" />
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.95rem',
              letterSpacing: '-0.01em',
              color: 'var(--text-light)',
              display: 'none',
            }}
              className="logo-text"
            >Iron Within Research</span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--primary-blue)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(0,207,255,0.08)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-light)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

            {/* Search */}
            <Link href="/search" style={{
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Search size={17} />
            </Link>

            {/* ── Theme Toggle ── */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                color: theme === 'dark' ? '#fbbf24' : 'var(--primary-blue)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" style={{
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--pink)'; e.currentTarget.style.background = 'rgba(236,72,153,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Heart size={17} />
            </Link>

            {/* Cart */}
            <Link href="/cart" style={{
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              position: 'relative',
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-blue)'; e.currentTarget.style.background = 'rgba(0,207,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <ShoppingCart size={17} />
              {/* Cart badge */}
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                width: 8, height: 8,
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                boxShadow: '0 0 6px rgba(0,207,255,0.6)',
              }} />
            </Link>

            {/* Account */}
            <Link href="/account" style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 14px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.82rem',
              textDecoration: 'none',
              boxShadow: '0 0 16px rgba(0,207,255,0.35)',
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,207,255,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,207,255,0.35)'; }}
              className="desktop-nav"
            >
              <User size={14} /> Account
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="mobile-menu-btn"
              style={{
                width: 36, height: 36,
                display: 'none',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-light)',
                cursor: 'pointer',
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--navbar-height, 68px)', left: 0, right: 0, bottom: 0,
          zIndex: 99,
          background: 'rgba(5,7,18,0.97)',
          backdropFilter: 'blur(24px)',
          padding: '28px 24px',
          display: 'flex', flexDirection: 'column', gap: '6px',
          overflowY: 'auto',
        }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              color: pathname === href ? 'var(--primary-blue)' : 'var(--text-light)',
              background: pathname === href ? 'rgba(0,207,255,0.08)' : 'transparent',
              fontWeight: pathname === href ? 600 : 400,
              fontSize: '1rem',
              textDecoration: 'none',
              borderLeft: `3px solid ${pathname === href ? 'var(--primary-blue)' : 'transparent'}`,
            }}>
              {label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--glass-border)', margin: '12px 0' }} />
          <Link href="/account" style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-light)',
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <User size={16} /> My Account
          </Link>
        </div>
      )}

      {/* ── Responsive styles ── */}
      <style>{`
        :root { --navbar-height: 68px; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .logo-text { display: block !important; }
        }

        /* ── Light theme overrides ── */
        [data-theme="light"] {
          --bg-dark: #f1f5f9;
          --bg-elevated: #e2e8f0;
          --card-dark: #ffffff;
          --card-elevated: #f8fafc;
          --text-light: #0f172a;
          --text-secondary: #334155;
          --text-muted: #64748b;
          --glass-bg: rgba(255,255,255,0.8);
          --glass-border: rgba(15,23,42,0.12);
        }
        [data-theme="light"] body {
          background: var(--bg-dark);
          color: var(--text-light);
        }
        [data-theme="light"] header {
          background: rgba(241,245,249,0.92) !important;
        }
      `}</style>
    </>
  );
}

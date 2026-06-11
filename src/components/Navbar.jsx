'use client';
// src/components/Navbar.jsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FlaskConical, ShoppingCart, Heart, User,
  Menu, X, Search, Sun, Moon, ChevronDown, LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const navLinks = [
   { href: '/',      label: 'Home'       },
  { href: '/shop',      label: 'Shop'       },
  { href: '/categories',label: 'Categories' },
  { href: '/contact',   label: 'Contact'    },
  { href: '/affiliate', label: 'Affiliates' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [theme,       setTheme]       = useState('dark');
  const [accountOpen, setAccountOpen] = useState(false);

  // badge bump animations
  const [cartBump,    setCartBump]    = useState(false);
  const [wishBump,    setWishBump]    = useState(false);

  const { isLoggedIn, user, logout }                   = useAuth();
  const { itemCount }                                   = useCart();
  const { wishlistCount }                               = useWishlist();

  // ── theme ──
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

  // ── scroll ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── close menu on route change ──
  useEffect(() => setMenuOpen(false), [pathname]);

  // ── close account dropdown on outside click ──
  useEffect(() => {
    if (!accountOpen) return;
    const close = () => setAccountOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [accountOpen]);

  // ── bump cart badge when count changes ──
  useEffect(() => {
    if (!itemCount) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 350);
    return () => clearTimeout(t);
  }, [itemCount]);

  // ── bump wishlist badge when count changes ──
  useEffect(() => {
    if (!wishlistCount) return;
    setWishBump(true);
    const t = setTimeout(() => setWishBump(false), 350);
    return () => clearTimeout(t);
  }, [wishlistCount]);

  const displayName = user?.firstName || user?.name || user?.username || 'Account';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 'var(--navbar-height, 68px)',
        background: scrolled ? 'rgba(5,7,18,0.92)' : 'rgba(5,7,18,0.6)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'var(--glass-border)' : 'transparent'}`,
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-blue)', flexShrink: 0 }}>
              <FlaskConical size={17} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em', color: 'var(--text-light)', display: 'none' }} className="logo-text">
              Iron Within Research
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link key={href} href={href} style={{ padding: '7px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--primary-blue)' : 'var(--text-secondary)', background: isActive ? 'rgba(0,207,255,0.08)' : 'transparent', textDecoration: 'none', transition: 'all 0.15s ease', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

            {/* Search */}
            <Link href="/search" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}>
              <Search size={17} />
            </Link>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: theme === 'dark' ? '#fbbf24' : 'var(--primary-blue)', cursor: 'pointer', transition: 'all 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* ── Wishlist with animated count badge ── */}
            <Link href="/wishlist" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', color: wishlistCount > 0 ? 'var(--pink)' : 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.15s ease', position: 'relative', background: wishlistCount > 0 ? 'rgba(236,72,153,0.08)' : 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--pink)'; e.currentTarget.style.background = 'rgba(236,72,153,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = wishlistCount > 0 ? 'var(--pink)' : 'var(--text-secondary)'; e.currentTarget.style.background = wishlistCount > 0 ? 'rgba(236,72,153,0.08)' : 'transparent'; }}>
              <Heart size={17} fill={wishlistCount > 0 ? 'currentColor' : 'none'} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: '1px', right: '1px',
                  minWidth: 17, height: 17,
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #ec4899, #db2777)',
                  color: '#fff', fontSize: '0.58rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 0 8px rgba(236,72,153,0.7)',
                  border: '1.5px solid var(--bg-dark, #05070f)',
                  animation: wishBump ? 'badgeBump 0.35s ease' : 'none',
                  lineHeight: 1,
                }}>
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* ── Cart with animated count badge ── */}
            <Link href="/cart" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', color: itemCount > 0 ? 'var(--primary-blue)' : 'var(--text-secondary)', textDecoration: 'none', position: 'relative', transition: 'all 0.15s ease', background: itemCount > 0 ? 'rgba(0,207,255,0.08)' : 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-blue)'; e.currentTarget.style.background = 'rgba(0,207,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = itemCount > 0 ? 'var(--primary-blue)' : 'var(--text-secondary)'; e.currentTarget.style.background = itemCount > 0 ? 'rgba(0,207,255,0.08)' : 'transparent'; }}>
              <ShoppingCart size={17} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '1px', right: '1px',
                  minWidth: 17, height: 17,
                  borderRadius: '999px',
                  background: 'var(--gradient-primary)',
                  color: '#fff', fontSize: '0.58rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 0 8px rgba(0,207,255,0.7)',
                  border: '1.5px solid var(--bg-dark, #05070f)',
                  animation: cartBump ? 'badgeBump 0.35s ease' : 'none',
                  lineHeight: 1,
                }}>
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isLoggedIn ? (
              <div style={{ position: 'relative' }} className="desktop-nav">
                <button
                  onClick={(e) => { e.stopPropagation(); setAccountOpen(v => !v); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 12px', background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.25)', borderRadius: 'var(--radius-md)', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}>
                  <User size={14} />
                  {displayName}
                  <ChevronDown size={12} style={{ transform: accountOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
                </button>

                {accountOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 180, background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '8px', boxShadow: '0 12px 32px rgba(0,0,0,0.4)', zIndex: 200 }}>
                    {[
                      { href: '/account',  label: 'My Account' },
                      { href: '/orders',   label: 'My Orders'  },
                      { href: '/wishlist', label: 'Wishlist'   },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href} style={{ display: 'block', padding: '9px 12px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,207,255,0.06)'; e.currentTarget.style.color = 'var(--text-light)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                        {label}
                      </Link>
                    ))}
                    <div style={{ height: 1, background: 'var(--glass-border)', margin: '6px 0' }} />
                    <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '7px', width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', background: 'none', border: 'none', color: '#f87171', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 14px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none', boxShadow: '0 0 16px rgba(0,207,255,0.35)', transition: 'all 0.15s ease' }} className="desktop-nav"
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,207,255,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,207,255,0.35)'; }}>
                <User size={14} /> Account
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(v => !v)} className="mobile-menu-btn" style={{ width: 36, height: 36, display: 'none', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-light)', cursor: 'pointer' }}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 'var(--navbar-height, 68px)', left: 0, right: 0, bottom: 0, zIndex: 99, background: 'rgba(5,7,18,0.97)', backdropFilter: 'blur(24px)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', color: pathname === href ? 'var(--primary-blue)' : 'var(--text-light)', background: pathname === href ? 'rgba(0,207,255,0.08)' : 'transparent', fontWeight: pathname === href ? 600 : 400, fontSize: '1rem', textDecoration: 'none', borderLeft: `3px solid ${pathname === href ? 'var(--primary-blue)' : 'transparent'}` }}>
              {label}
            </Link>
          ))}

          {/* Mobile wishlist + cart counts */}
          <div style={{ display: 'flex', gap: '10px', padding: '14px 18px' }}>
            <Link href="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: 'var(--radius-md)', color: 'var(--pink)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
              <Heart size={15} fill={wishlistCount > 0 ? 'currentColor' : 'none'} />
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.25)', borderRadius: 'var(--radius-md)', color: 'var(--primary-blue)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
              <ShoppingCart size={15} />
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
          </div>

          <div style={{ height: 1, background: 'var(--glass-border)', margin: '4px 0' }} />
          {isLoggedIn ? (
            <>
              <Link href="/account" style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> {displayName}
              </Link>
              <Link href="/orders" style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '1rem', textDecoration: 'none' }}>My Orders</Link>
              <button onClick={logout} style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'none', border: 'none', color: '#f87171', fontSize: '1rem', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <Link href="/account" style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> My Account
            </Link>
          )}
        </div>
      )}

      <style>{`
        :root { --navbar-height: 68px; }

        @keyframes badgeBump {
          0%   { transform: scale(1);    }
          40%  { transform: scale(1.45); }
          70%  { transform: scale(0.9);  }
          100% { transform: scale(1);    }
        }

        @media (max-width: 768px) {
          .desktop-nav       { display: none !important; }
          .mobile-menu-btn   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .logo-text { display: block !important; }
        }
        [data-theme="light"] {
          --bg-dark: #f1f5f9; --bg-elevated: #e2e8f0; --card-dark: #ffffff;
          --card-elevated: #f8fafc; --text-light: #0f172a; --text-secondary: #334155;
          --text-muted: #64748b; --glass-bg: rgba(255,255,255,0.8);
          --glass-border: rgba(15,23,42,0.12);
        }
        [data-theme="light"] body   { background: var(--bg-dark); color: var(--text-light); }
        [data-theme="light"] header { background: rgba(241,245,249,0.92) !important; }
      `}</style>
    </>
  );
}

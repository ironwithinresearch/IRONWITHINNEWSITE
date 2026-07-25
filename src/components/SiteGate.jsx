'use client';
// src/components/SiteGate.jsx
//
// Account wall for the whole storefront: an account is required to BROWSE, not just
// to add to cart. Renders a full-screen overlay over any gated route until the visitor
// signs in or registers, then hands them back to the page they wanted (?redirect=).
//
// Client-side by design (auth is a JWT in localStorage, so middleware can't see it).
// A useful side effect: the server HTML is untouched, so crawlers and link previews
// still see real page content and SEO/OG cards keep working.
//
// To turn the wall off entirely, set GATE_BROWSING = false — the add-to-cart gate in
// CartContext is separate and stays as-is.

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { UserPlus, LogIn, ShieldCheck, FlaskConical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isLuxMePath } from '../lib/luxme';

const GATE_BROWSING = true;

// Routes that must stay reachable logged-out or the wall traps people:
// the auth flow itself, legal pages, and the affiliate password page.
const PUBLIC_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/affiliate-access',
  '/terms',
  '/privacy',
  '/disclaimer',
  '/refund',
  '/shipping',
];

export default function SiteGate() {
  const { isLoggedIn, mounted } = useAuth();
  const pathname = usePathname();
  const [luxme, setLuxme] = useState(false);
  const [search, setSearch] = useState('');

  // Read window-only state in an effect (keeps this out of useSearchParams, which would
  // force a Suspense boundary around the whole app and bail static pages out of SSG).
  // Lux Me beauty pages stay exempt — they're deep-linked from luxmebyaxion.com.
  useEffect(() => {
    setLuxme(isLuxMePath());
    setSearch(window.location.search || '');
  }, [pathname]);

  if (!GATE_BROWSING || !mounted || isLoggedIn || luxme) return null;
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) return null;

  const redirect = encodeURIComponent(pathname + search);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'var(--overlay, rgba(5,7,18,0.97))',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(0,207,255,0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 70% 60%, rgba(124,58,237,0.08) 0%, transparent 55%)
        `,
      }} />

      <div style={{
        position: 'relative', maxWidth: 480, width: '100%',
        background: 'var(--card-dark, #0d1117)',
        border: '1px solid var(--glass-border, rgba(0,207,255,0.2))',
        borderRadius: 20, padding: '44px 40px', textAlign: 'center',
        boxShadow: '0 0 60px rgba(0,207,255,0.12), var(--shadow-lg, 0 32px 64px rgba(0,0,0,0.4))',
      }}>
        <div style={{
          width: 64, height: 64, margin: '0 auto 18px', borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,207,255,0.10)', border: '1px solid rgba(0,207,255,0.30)',
        }}>
          <FlaskConical size={30} color="#00CFFF" />
        </div>

        <div style={{
          fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#00CFFF', marginBottom: 10,
        }}>
          21+ researcher access only
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading, inherit)', fontSize: '1.65rem', fontWeight: 900,
          color: 'var(--text-primary, #fff)', margin: '0 0 12px', lineHeight: 1.2,
        }}>
          Create a free account to browse
        </h1>

        <p style={{
          color: 'var(--text-secondary, rgba(255,255,255,0.75))', fontSize: '0.97rem',
          lineHeight: 1.6, margin: '0 0 20px',
        }}>
          Our catalogue, pricing, and Certificates of Analysis are available to registered
          researchers. It takes about 30 seconds — and your account unlocks order tracking,
          rewards points, and member pricing.
        </p>

        {/* Age verification lives here now (and on the register form's 21+ checkbox) —
            the standalone age pop-up has been retired. */}
        <p style={{
          color: 'var(--text-secondary, rgba(255,255,255,0.72))', fontSize: '0.83rem',
          lineHeight: 1.55, margin: '0 0 24px', padding: '12px 14px', borderRadius: 12,
          background: 'rgba(0,207,255,0.06)', border: '1px solid rgba(0,207,255,0.22)',
        }}>
          You&apos;ll confirm you are <strong style={{ color: 'var(--text-primary, #fff)' }}>21
          or older</strong> when you create your account. All products are sold
          <strong style={{ color: 'var(--text-primary, #fff)' }}> for research use only</strong>
          {' '}and are not for human consumption.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href={`/register?redirect=${redirect}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              padding: '15px', borderRadius: 12, fontWeight: 800, fontSize: '1rem',
              color: '#04121a', textDecoration: 'none',
              background: 'linear-gradient(135deg,#00CFFF 0%,#7C3AED 50%,#EC4899 100%)',
            }}
          >
            <UserPlus size={18} /> Create my free account
          </a>
          <a
            href={`/login?redirect=${redirect}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem',
              color: 'var(--text-primary, #fff)', textDecoration: 'none',
              border: '1px solid var(--glass-border, rgba(255,255,255,0.18))',
            }}
          >
            <LogIn size={17} /> I already have an account
          </a>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          marginTop: 22, color: 'var(--text-muted, rgba(255,255,255,0.5))', fontSize: '0.78rem',
        }}>
          <ShieldCheck size={14} /> 21+ · Research use only · Not for human consumption
        </div>
      </div>
    </div>
  );
}

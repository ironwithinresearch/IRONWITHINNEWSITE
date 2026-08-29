'use client';
/* Teacher / military / first-responder verification.
 *
 * 15% off, verified once by VerifyPass and then attached permanently to the customer's
 * ACCOUNT — mu-plugin iw-service-discount.php applies it as a cart discount at every future
 * checkout. Deliberately not a coupon code: a code has to be remembered and typed, can be
 * forwarded to anyone, and every affiliate coupon here is individual_use, so a service code
 * would replace a customer's affiliate code rather than stack with it.
 *
 * THE WIDGET SLOT BELOW IS EMPTY until the embed snippet is pasted in from the VerifyPass
 * dashboard — their host is not published anywhere, so it cannot be written blind. The CSP
 * in next.config.js already allows *.verifypass.com for script, frame and connect; if the
 * widget ever renders as a blank box, the browser console names the blocked origin and it
 * goes in VERIFY_HOSTS there.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isLoggedIn } from '@/lib/auth';

const GROUPS = [
  { icon: '🎖️', label: 'Military', detail: 'Active duty, reserve, veterans and military family' },
  { icon: '🚑', label: 'First responders', detail: 'Police, fire, EMT and paramedics' },
  { icon: '🍎', label: 'Teachers', detail: 'K-12 and college faculty and staff' },
];

export default function HeroesPage() {
  const [signedIn, setSignedIn] = useState(null);

  // Read auth in an effect, never during render — these pages are static, and reading
  // localStorage on the server render is what has caused hydration mismatches here before.
  useEffect(() => { setSignedIn(isLoggedIn()); }, []);

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.72rem', letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--accent, #00A8D6)', fontWeight: 700, marginBottom: '0.75rem',
        }}>
          Iron Within Research
        </div>
        <h1 style={{ fontSize: '2.4rem', lineHeight: 1.15, margin: '0 0 0.9rem', fontWeight: 800 }}>
          15% off, for as long as you shop with us
        </h1>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--text-muted)', margin: 0 }}>
          Our thanks to the people who teach, serve and respond. Verify once and the discount
          attaches to your account — no code to remember, and it stacks with everything else
          we have running.
        </p>
      </div>

      <div style={{
        display: 'grid', gap: '0.9rem', marginBottom: '2.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
      }}>
        {GROUPS.map((g) => (
          <div key={g.label} style={{
            border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
            background: 'var(--glass, rgba(255,255,255,0.03))',
            borderRadius: 12, padding: '1.15rem 1.1rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.9rem', lineHeight: 1, marginBottom: '0.55rem' }}>{g.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{g.label}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{g.detail}</div>
          </div>
        ))}
      </div>

      {/* ── VerifyPass widget mounts here ───────────────────────────────
          Paste the embed snippet from the VerifyPass dashboard into this block.
          It needs the customer's email to match the account the discount lands on,
          which is why signed-out visitors are asked to sign in first. */}
      <section
        id="verifypass-widget"
        style={{
          border: '2px solid var(--accent, #00A8D6)', borderRadius: 14,
          padding: '1.75rem 1.5rem', marginBottom: '2rem', textAlign: 'center',
        }}
      >
        {signedIn === false ? (
          <>
            <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.6rem', fontWeight: 700 }}>
              Sign in first
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.1rem' }}>
              The discount attaches to your account, so we need to know which account to put
              it on. It takes a moment and you only ever do this once.
            </p>
            <Link
              href="/login?redirect=/heroes"
              style={{
                display: 'inline-block', background: 'var(--accent, #00A8D6)', color: '#fff',
                textDecoration: 'none', fontWeight: 700, padding: '0.85rem 1.9rem', borderRadius: 8,
              }}
            >
              Sign in or create an account
            </Link>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.6rem', fontWeight: 700 }}>
              Verify your status
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Verification is handled by VerifyPass. It takes about a minute, and your
              documents go to them — never to us.
            </p>
            {/* embed snippet goes here */}
          </>
        )}
      </section>

      <div style={{
        border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
        borderRadius: 12, padding: '1.25rem 1.35rem',
      }}>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.8rem', fontWeight: 700 }}>How it works</h3>
        <ol style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.8, color: 'var(--text-muted)', fontSize: '0.94rem' }}>
          <li>Sign in, so we know which account to attach it to</li>
          <li>Verify with VerifyPass — takes about a minute</li>
          <li>Your 15% applies automatically at every checkout from then on</li>
        </ol>
        <p style={{
          margin: '1.1rem 0 0', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6,
        }}>
          Stacks with our current offers, including buy-one-get-one and any affiliate code.
          Gift cards excluded. We never see or store your ID — verification is handled
          entirely by VerifyPass.
        </p>
      </div>
    </main>
  );
}

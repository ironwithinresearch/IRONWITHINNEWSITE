'use client';
/* Teacher / military / first-responder verification.
 *
 * LIVE again 2026-08-30. HIDDEN pulls the route (404) and must stay in step with
 * IW_SVC_ENABLED in mu-plugin iw-service-discount.php — one on and one off gives you either a
 * live page that grants nothing, or a discount nobody can sign up for.
 *
 * THE WIDGET SLOT BELOW IS STILL EMPTY until the embed snippet is pasted in from the VerifyPass
 * dashboard (Widgets → Installation). Everything else is wired: their webhook posts to
 * /wp-json/iw/v1/verifypass with the secret on the URL, and the 15% attaches to the account.
 *
 * 15% off, verified once by VerifyPass and then attached permanently to the customer's
 * ACCOUNT — mu-plugin iw-service-discount.php applies it as a cart discount at every future
 * checkout. Deliberately not a coupon code: a code has to be remembered and typed, can be
 * forwarded to anyone, and every affiliate coupon here is individual_use, so a service code
 * would replace a customer's affiliate code rather than stack with it.
 *
 * The verification link is VerifyPass's own hosted flow, opened in a popup. Their dashboard also
 * offers ready-made button markup; it is deliberately NOT used, because it ships unstyled and
 * would land a grey system button in the middle of a themed page. All their snippets do is
 * window.open() this same URL.
 *
 * WHY THE SIGNED-IN EMAIL IS SHOWN SO PROMINENTLY: the discount attaches to whatever address the
 * customer verifies WITH. Verify under a personal address that is not the store account and the
 * webhook still succeeds — it is held as pending and claimed if that address ever signs in — so
 * nothing errors, the customer simply never sees their discount and contacts support. VerifyPass
 * does have a prefill API, but it is not publicly documented and passing an unknown parameter
 * risks breaking their page, so the address is put in front of the customer instead.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLoggedIn, getUser } from '@/lib/auth';

// Set to true to pull the page again. Keep in step with IW_SVC_ENABLED on the backend.
const HIDDEN = false;

// From VerifyPass → Widgets → Installation ("Verification" direct link).
const VERIFY_URL = 'https://verifypass.com/auth/d16cea5a4c';

const GROUPS = [
  { icon: '🎖️', label: 'Military', detail: 'Active duty, reserve, veterans and military family' },
  { icon: '🚑', label: 'First responders', detail: 'Police, fire, EMT and paramedics' },
  { icon: '🍎', label: 'Teachers', detail: 'K-12 and college faculty and staff' },
];

export default function HeroesPage() {
  if (HIDDEN) notFound();

  const [signedIn, setSignedIn] = useState(null);
  const [email, setEmail] = useState('');

  // Read auth in an effect, never during render — these pages are static, and reading
  // localStorage on the server render is what has caused hydration mismatches here before.
  useEffect(() => {
    setSignedIn(isLoggedIn());
    const u = getUser();
    setEmail(u?.email || u?.user_email || '');
  }, []);

  // Popup rather than a new tab: the customer keeps the store page behind them, and closing
  // the popup returns them to where they were. Falls back to a tab if the popup is blocked —
  // never silently does nothing, which would read as a dead button.
  const openVerify = () => {
    const w = 480, h = 760;
    const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2);
    const win = window.open(VERIFY_URL, 'verifypass',
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    if (!win) window.open(VERIFY_URL, '_blank', 'noopener');
  };

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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.1rem' }}>
              Takes about a minute. Verification is handled by VerifyPass — your documents go to
              them and are never seen or stored by us.
            </p>

            {/* The address to verify with, stated before they click rather than after. */}
            {email ? (
              <p style={{
                fontSize: '0.9rem', lineHeight: 1.55, margin: '0 0 1.1rem',
                padding: '0.7rem 0.9rem', borderRadius: 8,
                background: 'var(--glass, rgba(255,255,255,0.04))',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
              }}>
                Please verify using <strong>{email}</strong> — the same address as your account,
                so the discount lands on it.
              </p>
            ) : null}

            <button
              type="button"
              onClick={openVerify}
              style={{
                display: 'inline-block', background: 'var(--accent, #00A8D6)', color: '#fff',
                border: 'none', fontWeight: 700, fontSize: '1rem', padding: '0.9rem 2rem',
                borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Verify my status
            </button>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: '1rem 0 0' }}>
              Once you&rsquo;re verified the 15% applies automatically at checkout. There is no code
              to enter.
            </p>
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

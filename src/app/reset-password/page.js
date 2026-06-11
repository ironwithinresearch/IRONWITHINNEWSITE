'use client';
// src/app/reset-password/page.js
//
// ── HOW THIS WORKS ────────────────────────────────────────────
// 1. User clicks link in email:
//    https://yoursite.com/reset-password?key=RESET_KEY&login=username
//
// 2. This page reads `key` and `login` from the URL params
//
// 3. User enters new password → RESET_USER_PASSWORD mutation runs
//
// 4. On success → redirect to /login with success message
//
// ── IMPORTANT: WordPress must redirect to your Next.js domain ─
// By default WordPress sends links to wp-admin/reset-password.
// You need to tell WordPress to send links to your Next.js domain.
// Add this to your WordPress functions.php:
//
// add_filter('lostpassword_url', function($url, $redirect) {
//   return 'https://your-nextjs-domain.com/reset-password';
// }, 10, 2);
//
// For localhost dev, add:
// add_filter('lostpassword_url', function($url, $redirect) {
//   return 'http://localhost:3000/reset-password';
// }, 10, 2);
// ──────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { RESET_USER_PASSWORD } from '../../lib/queries/auth';
import {
  Lock, Eye, EyeOff, CheckCircle2, ArrowRight,
  AlertCircle, ShieldCheck, KeyRound,
} from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // These come from the email link: /reset-password?key=XXX&login=username
  const key = searchParams.get('key') || '';
  const login = searchParams.get('login') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength
  const strength = getPasswordStrength(password);

  const [resetPassword, { loading }] = useMutation(RESET_USER_PASSWORD, {
    onCompleted: (data) => {
      if (data?.resetUserPassword?.user) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => router.push('/login?reset=success'), 2000);
      } else {
        setError('Password reset failed. Please try again or request a new link.');
      }
    },
    onError: (err) => {
      const msg = err.message || '';
      if (msg.includes('expired') || msg.includes('invalid')) {
        setError('This reset link has expired or is invalid. Please request a new one.');
      } else {
        setError(msg || 'Failed to reset password. Please try again.');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!key || !login) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (strength.score < 2) {
      setError('Password is too weak. Add numbers or symbols.');
      return;
    }

    resetPassword({ variables: { key, login, password } });
  };

  // ── Missing key/login in URL ──
  if (!key || !login) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{
          maxWidth: 440, width: '100%', textAlign: 'center',
          background: 'var(--card-dark)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '20px', padding: '40px',
        }}>
          <AlertCircle size={48} color="#f87171" style={{ margin: '0 auto 16px', opacity: 0.7 }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>
            Invalid Reset Link
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7, fontSize: '0.9rem' }}>
            This reset link is missing required information. Please request a new password reset.
          </p>
          <Link href="/forgot-password" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 28px', background: 'var(--gradient-primary)',
            borderRadius: '10px', color: '#fff', fontWeight: 600,
            textDecoration: 'none', fontFamily: 'var(--font-body)',
          }}>
            Request New Link <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.10) 0%, transparent 55%),
          radial-gradient(ellipse at 70% 60%, rgba(0,207,255,0.08) 0%, transparent 55%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>
        <div style={{
          background: 'var(--card-dark)',
          border: `1px solid ${success ? 'rgba(52,211,153,0.3)' : 'var(--glass-border)'}`,
          borderRadius: '20px', padding: '40px 36px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: success
              ? 'radial-gradient(ellipse at center, rgba(52,211,153,0.06) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 70%)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* ── SUCCESS ── */}
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <CheckCircle2 size={36} color="#34d399" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '10px' }}>
                  Password Updated!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '8px' }}>
                  Your password has been successfully reset.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '24px' }}>
                  Redirecting to sign in…
                </p>
                <div style={{
                  width: 40, height: 4, background: 'var(--gradient-primary)',
                  borderRadius: '2px', margin: '0 auto',
                  animation: 'progress 2s linear forwards',
                }} />
              </div>
            ) : (

              /* ── FORM ── */
              <>
                {/* Icon + heading */}
                <div style={{
                  width: 56, height: 56, borderRadius: '14px',
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <ShieldCheck size={24} color="var(--purple)" />
                </div>

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 900, marginBottom: '8px' }}>
                  Set New Password
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
                  Resetting password for{' '}
                  <strong style={{ color: 'var(--primary-blue)' }}>{login}</strong>
                </p>

                {/* Error */}
                {error && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '12px 14px', marginBottom: '18px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '10px', color: '#f87171', fontSize: '0.875rem',
                  }}>
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* New password */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{
                        position: 'absolute', left: '13px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
                      }} />
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        required
                        style={{
                          width: '100%', padding: '12px 42px 12px 40px',
                          background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                          borderRadius: '10px', color: 'var(--text-light)',
                          fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)} style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                      }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Password strength bar */}
                    {password && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                          {[0, 1, 2, 3].map(i => (
                            <div key={i} style={{
                              flex: 1, height: 3, borderRadius: '2px',
                              background: i < strength.score
                                ? strength.color
                                : 'var(--glass-border)',
                              transition: 'background 0.2s ease',
                            }} />
                          ))}
                        </div>
                        <p style={{ fontSize: '0.72rem', color: strength.color }}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{
                        position: 'absolute', left: '13px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
                      }} />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        required
                        style={{
                          width: '100%', padding: '12px 42px 12px 40px',
                          background: 'var(--bg-dark)',
                          border: `1px solid ${
                            confirmPassword && confirmPassword !== password
                              ? 'rgba(239,68,68,0.5)'
                              : confirmPassword && confirmPassword === password
                              ? 'rgba(52,211,153,0.5)'
                              : 'var(--glass-border)'
                          }`,
                          borderRadius: '10px', color: 'var(--text-light)',
                          fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                        }}
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                      }}>
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {/* Match indicator */}
                    {confirmPassword && (
                      <p style={{
                        fontSize: '0.72rem', marginTop: '5px',
                        color: confirmPassword === password ? '#34d399' : '#f87171',
                      }}>
                        {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || (confirmPassword && confirmPassword !== password)}
                    style={{
                      width: '100%', padding: '13px',
                      background: 'linear-gradient(135deg, #00cfff, #ec4899)',
                      border: 'none', borderRadius: '10px',
                      color: '#fff', fontWeight: 700, fontSize: '1rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-body)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 0 20px rgba(0,207,255,0.35)',
                      opacity: loading ? 0.8 : 1,
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        Updating Password…
                      </>
                    ) : (
                      <><ShieldCheck size={16} /> Update Password</>
                    )}
                  </button>
                </form>

                {/* Expired link help */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Link expired?{' '}
                    <Link href="/forgot-password" style={{ color: 'var(--primary-blue)', fontWeight: 500 }}>
                      Request a new one
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
}

/* ── Password strength helper ── */
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: 'var(--glass-border)' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels = [
    { score: 1, label: 'Weak', color: '#f87171' },
    { score: 2, label: 'Fair', color: '#fbbf24' },
    { score: 3, label: 'Good', color: '#34d399' },
    { score: 4, label: 'Strong', color: '#10b981' },
  ];

  return levels[Math.min(score, 4) - 1] || { score: 0, label: 'Too short', color: '#f87171' };
}

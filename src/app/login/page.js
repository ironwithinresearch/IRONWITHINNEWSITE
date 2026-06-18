'use client';
// src/app/login/page.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FlaskConical, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Strip HTML tags from WordPress error messages like:
// "<strong>Error:</strong> The password you entered ... <a href=...>Lost your password?</a>"
function cleanErrorMessage(msg) {
  if (!msg) return '';
  // Remove all HTML tags
  let clean = msg.replace(/<[^>]+>/g, '');
  // Decode HTML entities
  clean = clean.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  // Remove "Error:" prefix WordPress adds
  clean = clean.replace(/^Error:\s*/i, '').trim();
  return clean;
}

// Map common WordPress JWT error messages to friendly text
function getFriendlyError(raw) {
  const clean = cleanErrorMessage(raw).toLowerCase();

  if (clean.includes('incorrect') || clean.includes('password you entered') || clean.includes('wrong password')) {
    return 'Incorrect password. Please try again.';
  }
  if (clean.includes('no account') || clean.includes('not registered') || clean.includes('invalid username') || clean.includes('no user')) {
    return 'No account found with that email or username.';
  }
  if (clean.includes('empty') || clean.includes('required')) {
    return 'Please enter your email and password.';
  }
  if (clean.includes('too many') || clean.includes('locked') || clean.includes('blocked')) {
    return 'Too many failed attempts. Please wait a few minutes and try again.';
  }
  if (clean.includes('network') || clean.includes('fetch') || clean.includes('failed to fetch')) {
    return 'Connection error. Please check your internet and try again.';
  }

  // Fallback — show cleaned message (no HTML)
  const cleaned = cleanErrorMessage(raw);
  return cleaned || 'Sign in failed. Please check your credentials and try again.';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null;
  const resetSuccess = searchParams?.get('reset') === 'success';
  // Where to go after signing in (e.g. back to /checkout). Read after mount to
  // avoid a static-prerender/hydration mismatch; only allow same-site paths.
  const [redirectTo, setRedirectTo] = useState('/account');
  const [registerHref, setRegisterHref] = useState('/register');
  useEffect(() => {
    const rd = new URLSearchParams(window.location.search).get('redirect') || '';
    if (rd.startsWith('/')) {
      setRedirectTo(rd);
      setRegisterHref(`/register?redirect=${encodeURIComponent(rd)}`);
    }
  }, []);

  const { login, loading } = useAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username.trim()) { setError('Please enter your email or username.'); return; }
    if (!form.password) { setError('Please enter your password.'); return; }

    const result = await login(form.username.trim(), form.password);
    if (result.success) {
      router.push(redirectTo);
    } else {
      setError(getFriendlyError(result.error));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(0,207,255,0.07) 0%, transparent 55%),
          radial-gradient(ellipse at 70% 60%, rgba(124,58,237,0.07) 0%, transparent 55%)
        `,
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '14px',
            background: 'linear-gradient(135deg, #00cfff, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 0 24px rgba(0,207,255,0.4)',
          }}>
            <FlaskConical size={26} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 900, marginBottom: '6px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to your researcher account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          padding: '36px',
        }}>

          {/* Password reset success banner */}
          {resetSuccess && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 14px', marginBottom: '20px',
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: '10px', color: '#34d399', fontSize: '0.875rem',
            }}>
              <CheckCircle2 size={15} />
              Password updated! Sign in with your new password.
            </div>
          )}

          {/* Error — plain text, no HTML */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              padding: '12px 14px', marginBottom: '20px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              color: '#f87171', fontSize: '0.875rem', lineHeight: 1.5,
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email / Username */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block', fontSize: '0.82rem', fontWeight: 500,
                color: 'var(--text-secondary)', marginBottom: '7px',
              }}>
                Email or Username
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
                }} />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  autoComplete="username"
                  style={{
                    width: '100%', padding: '11px 14px 11px 40px',
                    background: 'var(--bg-dark)',
                    border: `1px solid ${error && !form.username ? 'rgba(239,68,68,0.5)' : 'var(--glass-border)'}`,
                    borderRadius: '10px',
                    color: 'var(--text-light)',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{
                  fontSize: '0.78rem', color: 'var(--primary-blue)', textDecoration: 'none',
                }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
                }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '11px 40px 11px 40px',
                    background: 'var(--bg-dark)',
                    border: 'var(--glass-border) 1px solid',
                    borderRadius: '10px',
                    color: 'var(--text-light)',
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
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, #00cfff, #ec4899)',
              border: 'none', borderRadius: '10px',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 0 20px rgba(0,207,255,0.35)',
              opacity: loading ? 0.8 : 1,
            }}>
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Signing In…
                </>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '22px',
            fontSize: '0.875rem', color: 'var(--text-muted)',
          }}>
            Don't have an account?{' '}
            <Link href={registerHref} style={{ color: 'var(--primary-blue)', fontWeight: 500 }}>
              Create one
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical, Eye, EyeOff, Mail, Lock,
  ArrowRight, ShieldCheck, User, LogIn,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError('Invalid email or password. Try again.');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 30%, rgba(0,207,255,0.10) 0%, transparent 50%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem', fontWeight: 900,
            marginBottom: '6px',
          }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to your researcher account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          backdropFilter: 'blur(16px)',
        }}>
          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 14px', marginBottom: '20px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <ShieldCheck size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.82rem', fontWeight: 500,
                color: 'var(--text-secondary)', marginBottom: '7px',
              }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: '13px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none',
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@research.com"
                  required
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color var(--transition-fast)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{
                  fontSize: '0.78rem', color: 'var(--primary-blue)',
                  textDecoration: 'none',
                }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: '13px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none',
                }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '12px 40px 12px 40px',
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color var(--transition-fast)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)',
            }}>
              <div
                onClick={() => setRemember(v => !v)}
                style={{
                  width: 18, height: 18,
                  borderRadius: '4px',
                  background: remember ? 'var(--gradient-primary)' : 'transparent',
                  border: `2px solid ${remember ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {remember && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              Remember me for 30 days
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'var(--gradient-primary)',
              border: 'none', borderRadius: 'var(--radius-md)',
              color: '#fff', fontWeight: 700, fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: 'var(--glow-blue)',
              opacity: loading ? 0.8 : 1,
              transition: 'all var(--transition-base)',
              marginTop: '4px',
            }}>
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                    animation: 'spin 0.8s linear infinite',
                  }} /> Signing in…
                </>
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,var(--glass-border))' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--glass-border),transparent)' }} />
          </div>

          {/* Register link */}
          <Link href="/register" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontWeight: 500, fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'all var(--transition-fast)',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary-blue)';
              e.currentTarget.style.color = 'var(--primary-blue)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <User size={15} /> Create a new account
          </Link>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6,
        }}>
          By signing in you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
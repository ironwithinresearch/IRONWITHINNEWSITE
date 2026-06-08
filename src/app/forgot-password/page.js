'use client';
// src/app/forgot-password/page.js

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { SEND_PASSWORD_RESET } from '@/lib/queries/auth';
import {
  FlaskConical, Mail, ArrowRight,
  CheckCircle2, ShieldCheck, ArrowLeft, KeyRound,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const [sendReset, { loading }] = useMutation(SEND_PASSWORD_RESET, {
    onCompleted: (data) => {
      // WooCommerce always returns success:true even for unknown emails (security)
      setSent(true);
    },
    onError: (err) => {
      setError(err.message || 'Failed to send reset email. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    sendReset({ variables: { username: email } });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(0,207,255,0.10) 0%, transparent 55%),
          radial-gradient(ellipse at 70% 70%, rgba(124,58,237,0.10) 0%, transparent 55%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 36px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: sent
              ? 'radial-gradient(ellipse at center, rgba(52,211,153,0.05) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at top, rgba(0,207,255,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
            transition: 'background 0.4s ease',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {!sent ? (
              <>
                <div style={{
                  width: 60, height: 60, borderRadius: '16px',
                  background: 'rgba(0,207,255,0.1)',
                  border: '1px solid rgba(0,207,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 0 20px',
                }}>
                  <KeyRound size={26} color="var(--primary-blue)" />
                </div>

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>
                  Forgot Password?
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '28px' }}>
                  Enter your registered email and we'll send you a secure reset link.
                </p>

                {error && (
                  <div style={{ padding: '12px 14px', marginBottom: '18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@research.com"
                        required
                        style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.15s ease', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                      />
                    </div>
                  </div>

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
                    transition: 'all 0.2s ease',
                  }}>
                    {loading ? (
                      <>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                        Sending…
                      </>
                    ) : (
                      <>Send Reset Link <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>

                <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(0,207,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    The reset link will expire in <strong style={{ color: 'var(--text-secondary)' }}>30 minutes</strong>. Check your spam folder if you don't see it.
                  </p>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle2 size={36} color="#34d399" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '10px' }}>Check Your Email</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '6px' }}>
                  If an account exists for:
                </p>
                <p style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '28px' }}>{email}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  You'll receive a password reset link shortly. Click the link in the email to create a new password.
                </p>
                <button onClick={() => { setSent(false); setEmail(''); }} style={{
                  width: '100%', padding: '11px',
                  background: 'none', border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                  marginBottom: '12px', transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  Resend Email
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

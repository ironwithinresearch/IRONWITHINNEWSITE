'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical, Mail, ArrowRight,
  CheckCircle2, ShieldCheck, ArrowLeft, KeyRound,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(0,207,255,0.10) 0%, transparent 55%),
          radial-gradient(ellipse at 70% 70%, rgba(124,58,237,0.10) 0%, transparent 55%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

   
        {/* Card */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 36px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow bg */}
          <div style={{
            position: 'absolute', inset: 0,
            background: sent
              ? 'radial-gradient(ellipse at center, rgba(52,211,153,0.05) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at top, rgba(0,207,255,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
            transition: 'background var(--transition-slow)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {!sent ? (
              <>
                {/* Icon */}
                <div style={{
                  width: 60, height: 60, borderRadius: '16px',
                  background: 'rgba(0,207,255,0.1)',
                  border: '1px solid rgba(0,207,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 0 20px',
                }}>
                  <KeyRound size={26} color="var(--primary-blue)" />
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px',
                }}>Forgot Password?</h1>
                <p style={{
                  color: 'var(--text-secondary)', fontSize: '0.9rem',
                  lineHeight: 1.7, marginBottom: '28px',
                }}>
                  No worries. Enter your registered email and we'll send you a secure reset link.
                </p>

                {/* Error */}
                {error && (
                  <div style={{
                    padding: '12px 14px', marginBottom: '18px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: '#f87171', fontSize: '0.85rem',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <ShieldCheck size={14} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                          fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                          transition: 'border-color var(--transition-fast)',
                        }}
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
                    transition: 'all var(--transition-base)',
                  }}>
                    {loading ? (
                      <>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        Sending…
                      </>
                    ) : (
                      <>Send Reset Link <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>

                {/* Info box */}
                <div style={{
                  marginTop: '20px',
                  padding: '14px',
                  background: 'rgba(0,207,255,0.04)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    The reset link will expire in <strong style={{ color: 'var(--text-secondary)' }}>30 minutes</strong>. Check your spam folder if you don't see the email within a few minutes.
                  </p>
                </div>
              </>
            ) : (
              /* ── Sent success state ── */
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(52,211,153,0.15)',
                  border: '2px solid rgba(52,211,153,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <CheckCircle2 size={36} color="#34d399" />
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem', fontWeight: 900, marginBottom: '10px',
                }}>Check Your Email</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '6px' }}>
                  We've sent a password reset link to:
                </p>
                <p style={{
                  color: 'var(--primary-blue)', fontWeight: 600,
                  fontSize: '0.95rem', marginBottom: '28px',
                }}>{email}</p>

                <div style={{
                  padding: '16px', marginBottom: '24px',
                  background: 'rgba(52,211,153,0.06)',
                  border: '1px solid rgba(52,211,153,0.2)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                }}>
                  {[
                    'Open the email from Darryl Peptides',
                    'Click the secure reset link',
                    'Create your new password',
                    'Sign in with your new credentials',
                  ].map((step, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '7px 0',
                      borderBottom: i < 3 ? '1px solid rgba(52,211,153,0.1)' : 'none',
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'rgba(52,211,153,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 700, color: '#34d399',
                        flexShrink: 0,
                      }}>{i + 1}</div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{step}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  style={{
                    width: '100%', padding: '11px',
                    background: 'none',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                    marginBottom: '12px',
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
                  Resend Email
                </button>
              </div>
            )}

            {/* Back to login */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'var(--text-muted)', fontSize: '0.85rem',
                textDecoration: 'none', fontWeight: 500,
                transition: 'color var(--transition-fast)',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
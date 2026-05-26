'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical, Eye, EyeOff, Lock,
  CheckCircle2, ShieldCheck, ArrowLeft, KeyRound,
} from 'lucide-react';

const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  return score;
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#fbbf24', '#60a5fa', '#34d399'];

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  const pwStrength = passwordStrength(password);

  const requirements = [
    { label: 'At least 8 characters',       met: password.length >= 8 },
    { label: 'One uppercase letter',         met: /[A-Z]/.test(password) },
    { label: 'One number',                   met: /[0-9]/.test(password) },
    { label: 'One special character',        met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (pwStrength < 2) {
      setError('Please choose a stronger password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1600);
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      }}>
        <div style={{
          maxWidth: 440, width: '100%', textAlign: 'center',
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '56px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(52,211,153,0.15)',
              border: '2px solid rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle2 size={36} color="#34d399" />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.7rem', fontWeight: 900, marginBottom: '10px',
            }}>Password Reset!</h1>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '0.9rem',
              lineHeight: 1.7, marginBottom: '32px',
            }}>
              Your password has been successfully updated. You can now sign in with your new credentials.
            </p>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 32px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff', fontWeight: 700,
              textDecoration: 'none', fontFamily: 'var(--font-body)',
              boxShadow: 'var(--glow-blue)',
            }}>
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          radial-gradient(ellipse at 25% 45%, rgba(0,207,255,0.10) 0%, transparent 55%),
          radial-gradient(ellipse at 75% 60%, rgba(236,72,153,0.08) 0%, transparent 55%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>

      
        {/* Card */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 36px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at top, rgba(0,207,255,0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{
              width: 56, height: 56, borderRadius: '14px',
              background: 'rgba(0,207,255,0.1)',
              border: '1px solid rgba(0,207,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <KeyRound size={24} color="var(--primary-blue)" />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px',
            }}>Set New Password</h1>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '0.88rem',
              lineHeight: 1.7, marginBottom: '28px',
            }}>
              Create a strong password for your researcher account. It must meet the requirements below.
            </p>

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

              {/* New password */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.82rem', fontWeight: 500,
                  color: 'var(--text-secondary)', marginBottom: '7px',
                }}>
                  New Password <span style={{ color: 'var(--pink)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{
                    position: 'absolute', left: '13px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', pointerEvents: 'none',
                  }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    style={{
                      width: '100%', padding: '12px 40px',
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
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Strength meter */}
                {password && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '6px',
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Password strength
                      </span>
                      <span style={{ fontSize: '0.72rem', color: strengthColor[pwStrength], fontWeight: 600 }}>
                        {strengthLabel[pwStrength]}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 4, borderRadius: '2px',
                          background: i <= pwStrength
                            ? strengthColor[pwStrength]
                            : 'var(--glass-border)',
                          transition: 'background var(--transition-fast)',
                        }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements checklist */}
              <div style={{
                padding: '14px 16px',
                background: 'rgba(0,207,255,0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <p style={{
                  fontSize: '0.75rem', fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '10px',
                }}>Requirements</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {requirements.map(req => (
                    <div key={req.label} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        background: req.met ? 'rgba(52,211,153,0.15)' : 'var(--glass-border)',
                        border: `1.5px solid ${req.met ? '#34d399' : 'var(--glass-border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all var(--transition-fast)',
                      }}>
                        {req.met && (
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5 3.5-4" stroke="#34d399"
                              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{
                        fontSize: '0.8rem',
                        color: req.met ? '#34d399' : 'var(--text-muted)',
                        transition: 'color var(--transition-fast)',
                      }}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.82rem', fontWeight: 500,
                  color: 'var(--text-secondary)', marginBottom: '7px',
                }}>
                  Confirm New Password <span style={{ color: 'var(--pink)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{
                    position: 'absolute', left: '13px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', pointerEvents: 'none',
                  }} />
                  <input
                    type={showConf ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter your new password"
                    required
                    style={{
                      width: '100%', padding: '12px 40px',
                      background: 'var(--bg-dark)',
                      border: `1px solid ${
                        confirm && confirm !== password
                          ? 'rgba(239,68,68,0.5)'
                          : 'var(--glass-border)'
                      }`,
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-light)',
                      fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                      transition: 'border-color var(--transition-fast)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                    onBlur={e => {
                      e.target.style.borderColor =
                        confirm && confirm !== password
                          ? 'rgba(239,68,68,0.5)'
                          : 'var(--glass-border)';
                    }}
                  />
                  <button type="button" onClick={() => setShowConf(v => !v)} style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}>
                    {showConf ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {confirm && confirm === password && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px', marginTop: '7px',
                  }}>
                    <CheckCircle2 size={12} color="#34d399" />
                    <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Passwords match</span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px',
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
                    }} />
                    Updating Password…
                  </>
                ) : (
                  <><KeyRound size={16} /> Reset Password</>
                )}
              </button>
            </form>

            {/* Back to login */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
'use client';
// src/app/forgot-password/page.js
//
// ── INLINE PASSWORD RESET — no email required ────────────────
// Step 1: User enters their email → we validate the account exists
//         by attempting a dry-run check via the WP users REST API.
//         If account not found → show "No account found" error.
//         If found → move to Step 2.
//
// Step 2: User enters new password + confirm password → we call
//         the RESET_USER_PASSWORD mutation using the admin key
//         OR we use the updateCustomer mutation (requires auth).
//
// Since WPGraphQL's resetUserPassword requires a key from email,
// we use the updateCustomer mutation with admin credentials to
// change the password server-side via a Next.js API route.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FlaskConical, Mail, Lock, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle2, ArrowLeft, KeyRound,
  ShieldCheck, User,
} from 'lucide-react';

const STEP_EMAIL = 'email';
const STEP_PASSWORD = 'password';
const STEP_SUCCESS = 'success';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const levels = [
    { score: 1, label: 'Weak — add numbers or symbols', color: '#f87171' },
    { score: 2, label: 'Fair — getting stronger', color: '#fbbf24' },
    { score: 3, label: 'Good password', color: '#34d399' },
    { score: 4, label: 'Strong password', color: '#10b981' },
  ];
  return levels[Math.min(score, 4) - 1] || { score: 0, label: 'Too short', color: '#f87171' };
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(STEP_EMAIL);

  // Step 1 state
  const [email, setEmail] = useState('');
  const [checkingUser, setCheckingUser] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Step 2 state
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [updating, setUpdating] = useState(false);

  const strength = getPasswordStrength(newPassword);

  // Prefill email from the "set your password" welcome link (?email=…).
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('email');
      if (p) setEmail(p);
    } catch (e) { /* noop */ }
  }, []);

  // ── STEP 1: Request a 6-digit reset code ─────────────────────
  // Always advance to step 2 — the backend is anti-enumeration and only
  // emails a code if an account exists, so we never reveal whether it does.
  const handleEmailSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setEmailError('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setEmailError('Please enter your email address.'); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) { setEmailError('Please enter a valid email address.'); return; }

    setCheckingUser(true);

    try {
      await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      setStep(STEP_PASSWORD);
    } catch (err) {
      setEmailError('Connection error. Please check your internet and try again.');
    } finally {
      setCheckingUser(false);
    }
  };

  // ── STEP 2: Update password via Next.js API route ────────────
  // This calls /api/auth/reset-password which uses WooCommerce
  // admin credentials (server-side only) to update the user's password.
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    const cleanCode = code.replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setPasswordError('Enter the 6-digit code from your email.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (strength.score < 2) {
      setPasswordError('Password is too weak. Add numbers or symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: cleanCode, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(STEP_SUCCESS);
        setTimeout(() => router.push('/login?reset=success'), 2500);
      } else {
        setPasswordError(data.error || 'Failed to update password. Please try again.');
      }
    } catch (err) {
      setPasswordError('Connection error. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

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
          radial-gradient(ellipse at 30% 40%, rgba(0,207,255,0.09) 0%, transparent 55%),
          radial-gradient(ellipse at 70% 70%, rgba(124,58,237,0.09) 0%, transparent 55%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {[STEP_EMAIL, STEP_PASSWORD, STEP_SUCCESS].map((s, i) => {
            const stepIndex = [STEP_EMAIL, STEP_PASSWORD, STEP_SUCCESS].indexOf(step);
            const isActive = s === step;
            const isDone = i < stepIndex;
            return (
              <div key={s} style={{
                height: 4, width: isActive ? 32 : 12,
                borderRadius: '2px',
                background: isDone || isActive ? 'var(--gradient-primary, linear-gradient(135deg, #00cfff, #ec4899))' : 'var(--glass-border)',
                background: isDone ? '#34d399' : isActive ? 'linear-gradient(135deg, #00cfff, #ec4899)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
              }} />
            );
          })}
        </div>

        <div style={{
          background: 'var(--card-dark)',
          border: `1px solid ${step === STEP_SUCCESS ? 'rgba(52,211,153,0.3)' : 'var(--glass-border)'}`,
          borderRadius: '20px', padding: '40px 36px',
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.3s ease',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: step === STEP_SUCCESS
              ? 'radial-gradient(ellipse at center, rgba(52,211,153,0.06) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at top, rgba(0,207,255,0.04) 0%, transparent 70%)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* ══ STEP 1: EMAIL ════════════════════════════════ */}
            {step === STEP_EMAIL && (
              <>
                <div style={{
                  width: 52, height: 52, borderRadius: '14px',
                  background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <KeyRound size={22} color="var(--primary-blue)" />
                </div>

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 900, marginBottom: '8px' }}>
                  Reset Password
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
                  Enter your email and we'll send you a 6-digit reset code. New here, or
                  ordered as a guest? This is how you set your password too.
                </p>

                {emailError && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '12px 14px', marginBottom: '18px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '10px', color: '#f87171', fontSize: '0.875rem', lineHeight: 1.5,
                  }}>
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{emailError}</span>
                  </div>
                )}

                <form onSubmit={handleEmailSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{
                        position: 'absolute', left: '13px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
                      }} />
                      <input
                        type="email" value={email}
                        onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="you@example.com" required
                        autoComplete="email"
                        style={{
                          width: '100%', padding: '12px 14px 12px 40px',
                          background: 'var(--bg-dark)',
                          border: `1px solid ${emailError ? 'rgba(239,68,68,0.5)' : 'var(--glass-border)'}`,
                          borderRadius: '10px', color: 'var(--text-light)',
                          fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                        onBlur={e => e.target.style.borderColor = emailError ? 'rgba(239,68,68,0.5)' : 'var(--glass-border)'}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={checkingUser} style={{
                    width: '100%', padding: '13px',
                    background: 'linear-gradient(135deg, #00cfff, #ec4899)',
                    border: 'none', borderRadius: '10px',
                    color: '#fff', fontWeight: 700, fontSize: '1rem',
                    cursor: checkingUser ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 0 20px rgba(0,207,255,0.3)',
                    opacity: checkingUser ? 0.8 : 1,
                  }}>
                    {checkingUser ? (
                      <>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                        Sending Code…
                      </>
                    ) : (
                      <>Send Reset Code <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ══ STEP 2: NEW PASSWORD ═════════════════════════ */}
            {step === STEP_PASSWORD && (
              <>
                {/* Code sent banner */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', marginBottom: '24px',
                  background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)',
                  borderRadius: '10px',
                }}>
                  <Mail size={14} color="#34d399" />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>Code sent — </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>check {email} (and spam)</span>
                  </div>
                </div>

                <div style={{
                  width: 52, height: 52, borderRadius: '14px',
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <ShieldCheck size={22} color="var(--purple, #7c3aed)" />
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>
                  Set New Password
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Enter the 6-digit code we emailed you, then choose a new password.
                </p>

                {passwordError && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '12px 14px', marginBottom: '18px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '10px', color: '#f87171', fontSize: '0.875rem', lineHeight: 1.5,
                  }}>
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>

                  {/* Verification code */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                      6-Digit Code
                    </label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      <input
                        type="text" inputMode="numeric" maxLength={6}
                        value={code}
                        onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setPasswordError(''); }}
                        placeholder="123456" required autoComplete="one-time-code"
                        style={{
                          width: '100%', padding: '12px 14px 12px 40px',
                          background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                          borderRadius: '10px', color: 'var(--text-light)',
                          fontFamily: 'var(--font-body)', fontSize: '1.1rem', letterSpacing: '5px', outline: 'none',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                      />
                    </div>
                    <button type="button" onClick={handleEmailSubmit} disabled={checkingUser} style={{
                      marginTop: '8px', background: 'none', border: 'none',
                      color: 'var(--primary-blue)', fontSize: '0.78rem',
                      cursor: checkingUser ? 'not-allowed' : 'pointer', padding: 0, fontFamily: 'var(--font-body)',
                    }}>
                      {checkingUser ? 'Sending…' : "Didn't get it? Resend code"}
                    </button>
                  </div>

                  {/* New password */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setPasswordError(''); }}
                        placeholder="Min 8 characters"
                        required
                        autoComplete="new-password"
                        style={{
                          width: '100%', padding: '12px 42px 12px 40px',
                          background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                          borderRadius: '10px', color: 'var(--text-light)',
                          fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                      />
                      <button type="button" onClick={() => setShowNew(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {newPassword && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                          {[0, 1, 2, 3].map(i => (
                            <div key={i} style={{
                              flex: 1, height: 3, borderRadius: '2px',
                              background: i < strength.score ? strength.color : 'rgba(255,255,255,0.08)',
                              transition: 'background 0.2s ease',
                            }} />
                          ))}
                        </div>
                        <p style={{ fontSize: '0.72rem', color: strength.color }}>{strength.label}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                        placeholder="Repeat password"
                        required
                        autoComplete="new-password"
                        style={{
                          width: '100%', padding: '12px 42px 12px 40px',
                          background: 'var(--bg-dark)',
                          border: `1px solid ${
                            confirmPassword && confirmPassword !== newPassword
                              ? 'rgba(239,68,68,0.5)'
                              : confirmPassword && confirmPassword === newPassword
                              ? 'rgba(52,211,153,0.5)'
                              : 'var(--glass-border)'
                          }`,
                          borderRadius: '10px', color: 'var(--text-light)',
                          fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                        }}
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {confirmPassword && (
                      <p style={{ fontSize: '0.72rem', marginTop: '5px', color: confirmPassword === newPassword ? '#34d399' : '#f87171' }}>
                        {confirmPassword === newPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => { setStep(STEP_EMAIL); setPasswordError(''); }} style={{
                      width: 44, height: 46, flexShrink: 0,
                      background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                      borderRadius: '10px', color: 'var(--text-secondary)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ArrowLeft size={16} />
                    </button>

                    <button
                      type="submit"
                      disabled={updating || (!!confirmPassword && confirmPassword !== newPassword)}
                      style={{
                        flex: 1, padding: '13px',
                        background: 'linear-gradient(135deg, #00cfff, #ec4899)',
                        border: 'none', borderRadius: '10px',
                        color: '#fff', fontWeight: 700, fontSize: '1rem',
                        cursor: updating ? 'not-allowed' : 'pointer',
                        fontFamily: 'var(--font-body)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxShadow: '0 0 20px rgba(0,207,255,0.3)',
                        opacity: updating ? 0.8 : 1,
                      }}
                    >
                      {updating ? (
                        <>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                          Updating…
                        </>
                      ) : (
                        <><ShieldCheck size={16} /> Update Password</>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ══ STEP 3: SUCCESS ══════════════════════════════ */}
            {step === STEP_SUCCESS && (
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
                  Your password has been successfully changed.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '24px' }}>
                  Redirecting to sign in…
                </p>
                <div style={{
                  height: 4, background: 'rgba(255,255,255,0.08)',
                  borderRadius: '2px', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', background: 'linear-gradient(135deg, #00cfff, #ec4899)',
                    borderRadius: '2px', animation: 'progress 2.5s linear forwards',
                  }} />
                </div>
              </div>
            )}

            {/* Back to login */}
            {step !== STEP_SUCCESS && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link href="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  color: 'var(--text-muted)', fontSize: '0.85rem',
                  textDecoration: 'none', fontWeight: 500,
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
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
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical, Eye, EyeOff, Mail, Lock,
  User, ArrowRight, ShieldCheck, CheckCircle2,
  Phone, Building2, LogIn,
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

export default function RegisterPage() {
  const [step, setStep]           = useState(1); // 1 = account, 2 = research info
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [agreed, setAgreed]       = useState(false);
  const [error, setError]         = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirm: '',
    phone: '', organization: '', role: '',
    purpose: '',
  });

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const pwStrength = passwordStrength(form.password);

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (pwStrength < 2) {
      setError('Please choose a stronger password.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setError('');
    if (!agreed) { setError('You must agree to the terms to continue.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      }}>
        <div style={{
          maxWidth: 480, width: '100%', textAlign: 'center',
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '60px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(52,211,153,0.15)',
              border: '2px solid rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle2 size={40} color="#34d399" />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem', fontWeight: 900, marginBottom: '12px',
            }}>Account Created!</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '8px' }}>
              Welcome to Darryl Peptides. Your researcher account has been created successfully.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '32px' }}>
              A verification email has been sent to <strong style={{ color: 'var(--primary-blue)' }}>{form.email}</strong>
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '12px 28px',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                color: '#fff', fontWeight: 600,
                textDecoration: 'none', fontFamily: 'var(--font-body)',
              }}>
                <LogIn size={15} /> Sign In Now
              </Link>
              <Link href="/shop" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '12px 28px',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)', fontWeight: 500,
                textDecoration: 'none', fontFamily: 'var(--font-body)',
              }}>
                Browse Shop
              </Link>
            </div>
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
          radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(0,207,255,0.08) 0%, transparent 50%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem', fontWeight: 900, marginBottom: '6px',
          }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join our researcher community
          </p>
        </div>

        {/* Step indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0', marginBottom: '28px',
        }}>
          {['Account Details', 'Research Info'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                background: i + 1 === step ? 'rgba(0,207,255,0.08)' : 'transparent',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: i + 1 < step
                    ? 'rgba(52,211,153,0.2)'
                    : i + 1 === step ? 'var(--gradient-primary)' : 'var(--card-dark)',
                  border: `2px solid ${i + 1 < step ? '#34d399' : i + 1 === step ? 'transparent' : 'var(--glass-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700,
                  color: i + 1 < step ? '#34d399' : '#fff',
                  flexShrink: 0,
                }}>
                  {i + 1 < step ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: i + 1 === step ? 600 : 400,
                  color: i + 1 === step ? 'var(--primary-blue)'
                    : i + 1 < step ? '#34d399' : 'var(--text-muted)',
                }}>{label}</span>
              </div>
              {i === 0 && (
                <div style={{
                  width: 32, height: 1,
                  background: step > 1 ? '#34d399' : 'var(--glass-border)',
                  transition: 'background var(--transition-base)',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
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

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <RegField label="First Name" icon={<User size={14} />}
                  value={form.firstName} onChange={set('firstName')}
                  placeholder="John" required />
                <RegField label="Last Name" icon={<User size={14} />}
                  value={form.lastName} onChange={set('lastName')}
                  placeholder="Doe" required />
              </div>

              <RegField label="Email Address" type="email" icon={<Mail size={14} />}
                value={form.email} onChange={set('email')}
                placeholder="you@research.com" required />

              {/* Password */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.82rem', fontWeight: 500,
                  color: 'var(--text-secondary)', marginBottom: '7px',
                }}>Password <span style={{ color: 'var(--pink)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{
                    position: 'absolute', left: '13px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', pointerEvents: 'none',
                  }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password')(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    style={{
                      width: '100%', padding: '11px 40px',
                      background: 'var(--bg-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
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
                    color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {/* Strength meter */}
                {form.password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: '2px',
                          background: i <= pwStrength ? strengthColor[pwStrength] : 'var(--glass-border)',
                          transition: 'background var(--transition-fast)',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: strengthColor[pwStrength] }}>
                      {strengthLabel[pwStrength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.82rem', fontWeight: 500,
                  color: 'var(--text-secondary)', marginBottom: '7px',
                }}>Confirm Password <span style={{ color: 'var(--pink)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{
                    position: 'absolute', left: '13px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', pointerEvents: 'none',
                  }} />
                  <input
                    type={showConf ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={e => set('confirm')(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    style={{
                      width: '100%', padding: '11px 40px',
                      background: 'var(--bg-dark)',
                      border: `1px solid ${form.confirm && form.confirm !== form.password ? 'rgba(239,68,68,0.5)' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-light)',
                      fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                    onBlur={e => {
                      e.target.style.borderColor = form.confirm && form.confirm !== form.password
                        ? 'rgba(239,68,68,0.5)' : 'var(--glass-border)';
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
                {form.confirm && form.confirm === form.password && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                    <CheckCircle2 size={12} color="#34d399" />
                    <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Passwords match</span>
                  </div>
                )}
              </div>

              <button type="submit" style={{
                width: '100%', padding: '13px',
                background: 'var(--gradient-primary)',
                border: 'none', borderRadius: 'var(--radius-md)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: 'var(--glow-blue)', marginTop: '4px',
              }}>
                Continue <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <RegField label="Phone Number" type="tel" icon={<Phone size={14} />}
                value={form.phone} onChange={set('phone')}
                placeholder="+1 (555) 000-0000" />

              <RegField label="Organization / Institution" icon={<Building2 size={14} />}
                value={form.organization} onChange={set('organization')}
                placeholder="e.g. University of Science" />

              {/* Role select */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.82rem', fontWeight: 500,
                  color: 'var(--text-secondary)', marginBottom: '7px',
                }}>Your Role</label>
                <select
                  value={form.role}
                  onChange={e => set('role')(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: form.role ? 'var(--text-light)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                    cursor: 'pointer',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                >
                  <option value="">Select your role…</option>
                  <option value="researcher">Research Scientist</option>
                  <option value="phd">PhD Candidate</option>
                  <option value="professor">Professor / Lecturer</option>
                  <option value="lab_tech">Laboratory Technician</option>
                  <option value="medical">Medical Professional</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Research purpose */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.82rem', fontWeight: 500,
                  color: 'var(--text-secondary)', marginBottom: '7px',
                }}>Research Purpose</label>
                <textarea
                  value={form.purpose}
                  onChange={e => set('purpose')(e.target.value)}
                  placeholder="Briefly describe your intended research use…"
                  rows={3}
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color var(--transition-fast)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              {/* Agree checkbox */}
              <label style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                <div
                  onClick={() => setAgreed(v => !v)}
                  style={{
                    width: 18, height: 18, marginTop: '1px',
                    borderRadius: '4px', flexShrink: 0,
                    background: agreed ? 'var(--gradient-primary)' : 'transparent',
                    border: `2px solid ${agreed ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all var(--transition-fast)',
                  }}
                >
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span>
                  I confirm these peptides are for <strong>research purposes only</strong>. I agree to the{' '}
                  <Link href="/terms" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>Terms & Conditions</Link>,{' '}
                  <Link href="/privacy" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>Privacy Policy</Link>, and{' '}
                  <Link href="/disclaimer" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>Disclaimer</Link>.
                </span>
              </label>

              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button type="button" onClick={() => setStep(1)} style={{
                  flex: 1, padding: '12px',
                  background: 'none',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}>← Back</button>
                <button type="submit" disabled={loading} style={{
                  flex: 2, padding: '12px',
                  background: 'var(--gradient-primary)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: 'var(--glow-blue)',
                  opacity: loading ? 0.8 : 1,
                }}>
                  {loading ? (
                    <>
                      <div style={{
                        width: 15, height: 15, borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      Creating Account…
                    </>
                  ) : (
                    <><CheckCircle2 size={15} /> Create Account</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Divider + login link */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--primary-blue)', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

/* ── Reusable field ──────────────────────────────────────── */
function RegField({ label, type = 'text', icon, value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '0.82rem', fontWeight: 500,
        color: 'var(--text-secondary)', marginBottom: '7px',
      }}>
        {label}
        {required && <span style={{ color: 'var(--pink)', marginLeft: '3px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: '13px', top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)', pointerEvents: 'none',
            display: 'flex',
          }}>{icon}</div>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: icon ? '11px 14px 11px 38px' : '11px 14px',
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
  );
}
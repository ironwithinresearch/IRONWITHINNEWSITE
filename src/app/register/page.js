'use client';
// src/app/register/page.js

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FlaskConical, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle2,
} from 'lucide-react';
import { useMutation } from '@apollo/client';
import { REGISTER_CUSTOMER } from '../../lib/queries/auth';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ── FIX: No authToken/refreshToken in response — just customer fields.
  // After registration succeeds, we call the JWT login endpoint directly.
  const [registerCustomer, { loading }] = useMutation(REGISTER_CUSTOMER, {
    onCompleted: async (data) => {
      const customer = data?.registerCustomer?.customer;
      if (customer) {
        setSuccess(true);
        // Auto-login via JWT after successful registration
        try {
          const result = await login(form.email, form.password);
          if (result.success) {
            setTimeout(() => router.push('/account'), 1000);
          } else {
            // Registration worked but auto-login failed — send to login page
            setTimeout(() => router.push('/login'), 1500);
          }
        } catch {
          setTimeout(() => router.push('/login'), 1500);
        }
      }
    },
    onError: (err) => {
      // Parse common WooCommerce registration errors
      const msg = err.message || '';
      if (msg.includes('already registered') || msg.includes('email_exists')) {
        setError('An account with this email already exists.');
      } else if (msg.includes('username_exists')) {
        setError('Username already taken. Please try again.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    // Generate unique username from email
    const base = form.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const username = base + Math.floor(Math.random() * 9000 + 1000);

    registerCustomer({
      variables: {
        username,
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      },
    });
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 25% 35%, rgba(124,58,237,0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 75% 65%, rgba(0,207,255,0.07) 0%, transparent 55%)
        `,
      }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '14px',
            background: 'linear-gradient(135deg, #00cfff, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 0 24px rgba(0,207,255,0.4)',
          }}>
            <FlaskConical size={26} color="#fff" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.7rem', fontWeight: 900, marginBottom: '6px',
          }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join thousands of researchers worldwide
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          padding: '36px',
        }}>

          {/* Success state */}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '14px', marginBottom: '20px',
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: '10px', color: '#34d399', fontSize: '0.875rem',
            }}>
              <CheckCircle2 size={16} />
              Account created! Signing you in…
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              padding: '12px 14px', marginBottom: '20px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', color: '#f87171', fontSize: '0.875rem',
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input type="text" value={form.firstName} onChange={set('firstName')}
                  placeholder="John" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input type="text" value={form.lastName} onChange={set('lastName')}
                  placeholder="Doe" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={set('email')}
                placeholder="you@example.com" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={set('password')}
                  placeholder="Min 8 characters" required
                  style={{ ...inputStyle, paddingRight: '42px' }}
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

            {/* Confirm password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password" value={form.confirmPassword} onChange={set('confirmPassword')}
                placeholder="••••••••" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, #00cfff, #ec4899)',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                cursor: loading || success ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 0 20px rgba(0,207,255,0.35)',
                opacity: loading || success ? 0.8 : 1,
                transition: 'all 0.2s ease',
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
                  Creating Account…
                </>
              ) : success ? (
                <><CheckCircle2 size={16} /> Done!</>
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '22px',
            fontSize: '0.875rem', color: 'var(--text-muted)',
          }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary-blue)', fontWeight: 500 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: '6px',
};

const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: 'var(--bg-dark)',
  border: '1px solid var(--glass-border)',
  borderRadius: '10px',
  color: 'var(--text-light)',
  fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.15s ease',
};

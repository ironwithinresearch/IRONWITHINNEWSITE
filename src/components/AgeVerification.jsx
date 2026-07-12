'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { isLuxMePath } from '../lib/luxme';

export default function AgeVerification() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem('iwr-age-verified');
    // Skip the gate on Lux Me beauty pages (don't set verified, so navigating
    // to a research-compound page later in the session still gates).
    if (!verified && !isLuxMePath()) setVisible(true);
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem('iwr-age-verified', 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    // Redirect away from the site
    window.location.href = 'https://www.google.com';
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(5,7,18,0.97)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Glow orbs */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(0,207,255,0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 70% 60%, rgba(124,58,237,0.08) 0%, transparent 55%)
        `,
      }} />

      <div style={{
        position: 'relative',
        maxWidth: 480,
        width: '100%',
        background: 'var(--card-dark, #0d1117)',
        border: '1px solid rgba(0,207,255,0.2)',
        borderRadius: '20px',
        padding: '48px 40px',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(0,207,255,0.12), 0 32px 64px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}>
        {/* Inner glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at top, rgba(0,207,255,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{
            width: 64, height: 64,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00cfff, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 24px rgba(0,207,255,0.45)',
          }}>
            <FlaskConical size={30} color="#fff" />
          </div>

          {/* Brand */}
          <p style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'rgba(0,207,255,0.8)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Iron Within Research</p>

          {/* Age badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '6px 16px',
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: '999px',
            marginBottom: '20px',
          }}>
            <ShieldAlert size={13} color="#fbbf24" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.06em' }}>
              AGE VERIFICATION REQUIRED
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading, "Orbitron", sans-serif)',
            fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '16px',
            color: '#fff',
          }}>
            Are You 21 or Older?
          </h1>

          <p style={{
            color: 'rgba(148,163,184,1)',
            fontSize: '0.92rem',
            lineHeight: 1.7,
            marginBottom: '8px',
          }}>
            This website sells research compounds intended for qualified researchers only.
          </p>
          <p style={{
            color: 'rgba(100,116,139,1)',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            marginBottom: '36px',
          }}>
            By entering, you confirm you are at least 21 years of age and agree to our Terms of Service and Disclaimer. Products are <strong style={{ color: 'rgba(148,163,184,1)' }}>for research use only</strong> and not for human consumption.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button
              onClick={handleConfirm}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #00cfff, #ec4899)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 0 24px rgba(0,207,255,0.4)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(0,207,255,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,207,255,0.4)'; }}
            >
              <CheckCircle2 size={18} />
              Yes, I Am 21 or Older — Enter Site
            </button>

            <button
              onClick={handleDecline}
              style={{
                width: '100%',
                padding: '13px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'rgba(100,116,139,1)',
                fontWeight: 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(100,116,139,1)'; }}
            >
              No, I Am Under 21 — Exit
            </button>
          </div>

          <p style={{
            marginTop: '20px',
            fontSize: '0.72rem',
            color: 'rgba(71,85,105,1)',
            lineHeight: 1.6,
          }}>
            By clicking "Enter Site" you confirm you meet the minimum age requirement and acknowledge the research-only nature of all products sold on this website.
          </p>
        </div>
      </div>
    </div>
  );
}

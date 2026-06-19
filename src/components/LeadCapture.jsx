'use client';

import { useState, useEffect } from 'react';

/* Email lead-capture popup. Appears after a short delay or on exit-intent,
   offers 10% off the first order for an email, and shows the code on success.
   Remembers dismissal (14 days) / completion (forever) in localStorage. */

const KEY = 'iw_lead';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LeadCapture() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (saved === 'done') return;                       // already signed up
    if (saved && Date.now() - Number(saved) < 14 * 864e5) return; // dismissed < 14d ago

    let shown = false;
    const show = () => { if (!shown) { shown = true; setOpen(true); cleanup(); } };
    const onLeave = (e) => { if (e.clientY <= 0) show(); };
    const timer = setTimeout(show, 14000);
    document.addEventListener('mouseleave', onLeave);
    function cleanup() { clearTimeout(timer); document.removeEventListener('mouseleave', onLeave); }
    return cleanup;
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { if (status !== 'done') localStorage.setItem(KEY, String(Date.now())); } catch { /* ignore */ }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!EMAIL_RE.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    setStatus('sending');
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), website, source: 'popup' }),
      });
      const d = await r.json();
      if (d.success) {
        setCode(d.code || 'WELCOME10');
        setStatus('done');
        try { localStorage.setItem(KEY, 'done'); } catch { /* ignore */ }
      } else {
        setError(d.error || 'Something went wrong.'); setStatus('error');
      }
    } catch {
      setError('Something went wrong. Please try again.'); setStatus('error');
    }
  };

  if (!open) return null;

  const input = {
    width: '100%', padding: '13px 15px', borderRadius: '10px', background: 'var(--bg-dark)',
    border: '1px solid var(--glass-border)', color: 'var(--text-light)', fontFamily: 'var(--font-body)',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div onClick={dismiss}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(2,5,10,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 420, background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 18, padding: '34px 30px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <button onClick={dismiss} aria-label="Close"
          style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, lineHeight: 1, cursor: 'pointer' }}>×</button>

        {status === 'done' ? (
          <>
            <div style={{ fontSize: 34, marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>You&apos;re in!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 16px' }}>Here&apos;s your 10% off — we&apos;ve also emailed it to you.</p>
            <div style={{ background: 'rgba(0,207,255,0.08)', border: '1px dashed var(--primary-blue)', borderRadius: 10, padding: '16px', marginBottom: 18 }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--primary-blue)' }}>Your code</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)', letterSpacing: '0.06em', marginTop: 4 }}>{code}</div>
            </div>
            <a href="/shop" onClick={dismiss} style={{ display: 'inline-block', padding: '12px 26px', background: 'var(--gradient-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>Start Shopping</a>
          </>
        ) : (
          <>
            <div style={{ fontSize: 30, marginBottom: 6 }}>🔬</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Get 10% off your first order</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 20px' }}>
              Join the list for research-grade peptides — 99%+ purity, a COA on every vial. We&apos;ll send your code now.
            </p>
            <form onSubmit={submit}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={input} autoFocus />
              {/* honeypot */}
              <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} aria-hidden="true" />
              {error && <p style={{ color: '#f87171', fontSize: '0.8rem', margin: '8px 0 0' }}>{error}</p>}
              <button type="submit" disabled={status === 'sending'}
                style={{ width: '100%', marginTop: 12, padding: 14, background: 'var(--gradient-primary)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: status === 'sending' ? 'wait' : 'pointer', fontFamily: 'var(--font-body)', boxShadow: 'var(--glow-blue)' }}>
                {status === 'sending' ? 'Sending…' : 'Send My 10% Code'}
              </button>
            </form>
            <button onClick={dismiss} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>No thanks</button>
          </>
        )}
      </div>
    </div>
  );
}

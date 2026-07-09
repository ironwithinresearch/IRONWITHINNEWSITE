'use client';
// src/app/affiliate-access/page.js
// Public unlock screen for the gated /affiliate section. Posts the shared password
// to /api/affiliate-access, which sets the gate cookie, then returns the visitor to
// wherever they were headed (?next=). Styled to match the site's neon/dark theme.

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function AffiliateAccess() {
  const [pw, setPw] = useState('');
  const [next, setNext] = useState('/affiliate');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const n = new URLSearchParams(window.location.search).get('next');
      if (n && n.startsWith('/affiliate')) setNext(n);
    } catch { /* noop */ }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/affiliate-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        window.location.href = data.next || '/affiliate';
        return;
      }
      setErr(data.error || 'Incorrect password. Please try again.');
    } catch {
      setErr('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background:
          'radial-gradient(ellipse at 60% 40%, rgba(124,58,237,0.18) 0%, rgba(0,207,255,0.10) 40%, transparent 70%), var(--bg-dark, #020617)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--card-dark, #0F172A)',
          border: '1px solid var(--glass-border, rgba(0,207,255,0.12))',
          borderRadius: 20,
          padding: '38px 32px',
          boxShadow: '0 30px 80px -30px rgba(0,0,0,0.7)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <Image src="/logo-mark.png" alt="Iron Within Research" width={64} height={64} priority
            style={{ filter: 'drop-shadow(0 0 14px rgba(0,207,255,0.45))' }} />
        </div>

        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12,
            padding: '5px 12px', borderRadius: 999,
            border: '1px solid var(--glass-border, rgba(0,207,255,0.12))',
            color: '#00CFFF', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600,
          }}
        >
          <Lock size={13} /> Affiliates Only
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px', color: 'var(--text-light, #EAFBFF)', letterSpacing: '-0.01em' }}>
          Affiliate Access
        </h1>
        <p style={{ margin: '0 0 26px', color: 'var(--text-secondary, #94a3b8)', fontSize: 15, lineHeight: 1.5 }}>
          Enter the password we shared with you to open the Iron Within affiliate area.
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Affiliate password"
            autoFocus
            autoComplete="off"
            aria-label="Affiliate password"
            style={{
              width: '100%', padding: '14px 16px', fontSize: 16,
              background: 'var(--bg-deeper, #010410)',
              border: `1px solid ${err ? '#EC4899' : 'var(--glass-border, rgba(0,207,255,0.12))'}`,
              borderRadius: 12, color: 'var(--text-light, #EAFBFF)', outline: 'none',
            }}
          />
          {err ? (
            <div style={{ color: '#EC4899', fontSize: 14, textAlign: 'left', margin: '-4px 2px 0' }}>{err}</div>
          ) : null}
          <button
            type="submit"
            disabled={loading || !pw}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '14px 18px', fontSize: 16, fontWeight: 700,
              border: 'none', borderRadius: 12, cursor: loading || !pw ? 'default' : 'pointer',
              color: '#001018', opacity: loading || !pw ? 0.6 : 1,
              background: 'linear-gradient(135deg, #00CFFF 0%, #7C3AED 50%, #EC4899 100%)',
              boxShadow: '0 0 20px rgba(0,207,255,0.35)', transition: 'opacity .15s',
            }}
          >
            {loading ? <Loader2 size={18} className="iw-spin" /> : <ArrowRight size={18} />}
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>

        <p style={{ margin: '22px 0 0', color: 'var(--text-muted, #4b5a72)', fontSize: 13 }}>
          Not an affiliate yet?{' '}
          <a href="mailto:support@ironwithin.io" style={{ color: '#00CFFF', textDecoration: 'none' }}>
            Ask us to join
          </a>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: '@keyframes iw-spin{to{transform:rotate(360deg)}}.iw-spin{animation:iw-spin 0.8s linear infinite}' }} />
    </main>
  );
}

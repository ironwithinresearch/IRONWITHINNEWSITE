'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchReferral } from '@/lib/referral';
import { Gift, Copy, Check, Share2, Users } from 'lucide-react';

export default function ReferPage() {
  const { isLoggedIn } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isLoggedIn) fetchReferral().then((r) => { setData(r); setLoading(false); });
    else setLoading(false);
  }, [isLoggedIn]);

  const copy = () => { if (data?.link) { navigator.clipboard?.writeText(data.link); setCopied(true); setTimeout(() => setCopied(false), 1800); } };
  const share = async () => {
    if (navigator.share && data?.link) { try { await navigator.share({ title: 'Iron Within Research', text: 'Get $25 off your first order at Iron Within Research:', url: data.link }); } catch {} }
    else copy();
  };

  const card = { background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '22px' };
  const sectionH = { fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: 16 };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '60px 24px 90px' }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ display: 'inline-block', padding: '5px 16px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.3)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary-blue)', marginBottom: 16 }}>Refer &amp; Earn</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, color: '#fff', margin: '0 0 12px' }}>Give $25, Get $25</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto' }}>
            Share your link. Your friend gets <strong style={{ color: '#fff' }}>$25 off</strong> their first order, and you earn <strong style={{ color: '#fff' }}>$25 in rewards</strong> when they buy.
          </p>
        </div>

        {!isLoggedIn ? (
          <div style={{ ...card, textAlign: 'center', padding: '36px 28px', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>Sign in to get your link</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px' }}>Your unique referral link lives in your account — free to create.</p>
            <Link href="/account" style={{ padding: '13px 30px', background: 'var(--gradient-primary)', borderRadius: 10, color: '#fff', fontWeight: 800, textDecoration: 'none', boxShadow: 'var(--glow-blue)' }}>Sign in / Create account</Link>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading your link…</div>
        ) : data ? (
          <div style={{ ...card, marginBottom: 40 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Your referral link</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <input readOnly value={data.link} onClick={(e) => e.target.select()} style={{ flex: '1 1 260px', padding: '12px 14px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-light)', fontSize: '0.9rem' }} />
              <button onClick={copy} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 18px', background: 'var(--gradient-primary)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={share} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 18px', background: 'var(--card-elevated)', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-light)', fontWeight: 700, cursor: 'pointer' }}>
                <Share2 size={16} /> Share
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 22, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} color="var(--primary-blue)" /><span style={{ color: 'var(--text-secondary)' }}><strong style={{ color: '#fff', fontSize: '1.1rem' }}>{data.referrals || 0}</strong> friends referred</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Gift size={18} color="#34d399" /><span style={{ color: 'var(--text-secondary)' }}><strong style={{ color: '#34d399', fontSize: '1.1rem' }}>{(data.points_earned || 0).toLocaleString()}</strong> points earned</span></div>
            </div>
          </div>
        ) : (
          <div style={{ ...card, textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40 }}>Couldn&apos;t load your link — try again in a moment.</div>
        )}

        <h2 style={sectionH}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { n: '1', t: 'Share your link', d: 'Send your unique link to fellow researchers.' },
            { n: '2', t: 'They save $25', d: 'Your friend gets $25 off their first order of $75+.' },
            { n: '3', t: 'You earn $25', d: 'You get 2,500 reward points ($25) once they order.' },
          ].map((s) => (
            <div key={s.n} style={card}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '0 0 6px' }}>{s.t}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

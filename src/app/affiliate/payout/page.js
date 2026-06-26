'use client';
// src/app/affiliate/payout/page.js — affiliates choose to be paid in 2× store credit.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getPayoutPref, setPayoutPref } from '@/lib/affiliatePayout';
import { Wallet, Banknote, Loader2, Check, ArrowRight, Lock } from 'lucide-react';

export default function AffiliatePayoutPage() {
  const { isLoggedIn, mounted } = useAuth();
  const [state, setState] = useState({ loading: true, data: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) { setState({ loading: false, data: { error: 'auth' } }); return; }
    getPayoutPref().then((d) => setState({ loading: false, data: d }));
  }, [mounted, isLoggedIn]);

  const choose = async (payInCredit) => {
    if (saving) return;
    setSaving(true);
    const prev = state.data?.payInCredit;
    setState((s) => ({ ...s, data: { ...s.data, payInCredit } })); // optimistic
    const res = await setPayoutPref(payInCredit);
    if (res?.error || res?.payInCredit === undefined) {
      setState((s) => ({ ...s, data: { ...s.data, payInCredit: prev } })); // revert
    }
    setSaving(false);
  };

  const card = { background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: '32px 28px' };
  const wrap = (kids) => (
    <div style={{ minHeight: '70vh', padding: '48px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>{kids}</div>
    </div>
  );

  if (!mounted || state.loading) {
    return wrap(<div style={{ textAlign: 'center', paddingTop: 60 }}><Loader2 size={26} className="spin" color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} /></div>);
  }

  const d = state.data || {};

  // Not logged in
  if (d.error === 'auth' || !isLoggedIn) {
    return wrap(
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}><Lock size={24} color="var(--primary-blue)" /></div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 10px' }}>Affiliate payout settings</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px' }}>Sign in with the email on your affiliate account to choose how you're paid.</p>
        <Link href="/login?redirect=/affiliate/payout" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'var(--gradient-primary)', borderRadius: 12, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Sign in <ArrowRight size={16} /></Link>
      </div>
    );
  }

  // Logged in but not a recognized affiliate
  if (!d.isAffiliate) {
    return wrap(
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontSize: 30, marginBottom: 10 }}>🤝</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, margin: '0 0 10px' }}>We couldn't match you to an affiliate account</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 8px' }}>
          You're signed in as <strong style={{ color: 'var(--text-light)' }}>{d.email}</strong>, but that email isn't on a recognized affiliate account.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 24px' }}>
          Make sure you're signed in with the same email as your affiliate account, or email <a href="mailto:support@ironwithin.io" style={{ color: 'var(--primary-blue)' }}>support@ironwithin.io</a>.
        </p>
        <Link href="/affiliate" style={{ color: 'var(--primary-blue)', fontWeight: 600, textDecoration: 'none' }}>Learn about the affiliate program →</Link>
      </div>
    );
  }

  // Recognized affiliate — show the choice
  const inCredit = !!d.payInCredit;
  const opt = (active, accent) => ({
    flex: 1, textAlign: 'left', cursor: saving ? 'wait' : 'pointer', padding: '18px 18px', borderRadius: 14,
    background: active ? `${accent}14` : 'var(--bg-dark)', border: `1.5px solid ${active ? accent : 'var(--glass-border)'}`,
    transition: 'all 0.15s ease', fontFamily: 'var(--font-body)',
  });

  return wrap(
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 900, margin: '0 0 6px' }}>How do you want to get paid?</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Hey {d.affiliateName?.split(' ')[0] || 'there'} — choose your payout. You can change this anytime.
        </p>
      </div>

      {/* 2x banner */}
      <div style={{ background: 'linear-gradient(100deg, rgba(52,211,153,0.12), rgba(0,207,255,0.10))', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 16, padding: '16px 18px', marginBottom: 20, textAlign: 'center' }}>
        <span style={{ fontSize: '0.95rem', color: 'var(--text-light)' }}>
          💰 Take your commission as <strong style={{ color: '#34d399' }}>store credit and it's worth 2×</strong>. A <strong>$100</strong> commission becomes <strong style={{ color: '#34d399' }}>$200</strong> to spend.
        </span>
      </div>

      <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => choose(true)} style={opt(inCredit, '#34d399')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Wallet size={22} color="#34d399" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: 'var(--text-light)', fontSize: '1rem' }}>Store credit — 2× value <span style={{ fontSize: '0.7rem', background: 'rgba(52,211,153,0.2)', color: '#34d399', padding: '2px 8px', borderRadius: 20, marginLeft: 6, fontWeight: 800 }}>BEST DEAL</span></div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 2 }}>Double your earnings to spend at Iron Within. Auto-applies at checkout, no code.</div>
            </div>
            {inCredit && <Check size={20} color="#34d399" />}
          </div>
        </button>

        <button onClick={() => choose(false)} style={opt(!inCredit, 'var(--primary-blue)')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Banknote size={22} color="var(--text-muted)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: 'var(--text-light)', fontSize: '1rem' }}>Cash payout</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 2 }}>Get paid in cash at the regular rate, as usual.</div>
            </div>
            {!inCredit && <Check size={20} color="var(--primary-blue)" />}
          </div>
        </button>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '6px 0 0', lineHeight: 1.5 }}>
          {saving ? 'Saving…' : inCredit
            ? '✅ You\'re set to be paid in 2× store credit. It\'s added to your account at each payout.'
            : 'You\'re set to be paid in cash. Switch to store credit anytime to double it.'}
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Affiliate: <strong style={{ color: 'var(--text-secondary)' }}>{d.affiliateName}</strong>{d.refCode ? <> · code <strong style={{ color: 'var(--text-secondary)' }}>{d.refCode}</strong></> : null}
      </p>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

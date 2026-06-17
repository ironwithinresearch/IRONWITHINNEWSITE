'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gift, Mail, Check, Loader2, ShieldCheck, Clock, Wallet } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Fixed tiers — variation IDs of the "Gift Card" product (id 627) on the backend.
const TIERS = [
  { amount: 100, variationId: 628 },
  { amount: 250, variationId: 629 },
  { amount: 500, variationId: 630 },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GiftCardsPage() {
  const { addToCart } = useCart();

  const [amount, setAmount] = useState(100);
  const [form, setForm] = useState({ recipientName: '', recipientEmail: '', message: '' });
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Balance checker
  const [balCode, setBalCode] = useState('');
  const [balState, setBalState] = useState(null); // {loading,result}

  const tier = TIERS.find((t) => t.amount === amount) || TIERS[0];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAdd = async () => {
    setError('');
    if (!form.recipientEmail || !EMAIL_RE.test(form.recipientEmail.trim())) {
      setError("Please enter the recipient's email address.");
      return;
    }
    setAdding(true);
    const res = await addToCart(627, 1, tier.variationId, {
      iw_gc_recipient_email: form.recipientEmail.trim(),
      iw_gc_recipient_name: form.recipientName.trim(),
      iw_gc_message: form.message.trim(),
    });
    setAdding(false);
    if (res?.success) {
      setAdded(true);
    } else {
      setError(res?.error || 'Could not add the gift card to your cart. Please try again.');
    }
  };

  const checkBalance = async (e) => {
    e.preventDefault();
    const code = balCode.trim();
    if (!code) return;
    setBalState({ loading: true });
    try {
      const r = await fetch(`/api/giftcard-balance?code=${encodeURIComponent(code)}`);
      const data = await r.json();
      setBalState({ loading: false, result: data });
    } catch {
      setBalState({ loading: false, result: { valid: false, message: 'Could not check balance right now.' } });
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-dark)',
    border: '1px solid var(--glass-border)', color: 'var(--text-light)', fontFamily: 'var(--font-body)',
    fontSize: '0.92rem', outline: 'none',
  };
  const labelStyle = { display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 };

  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(0,207,255,0.08)', border: '1px solid var(--glass-border)', color: 'var(--primary-blue)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 16 }}>
          <Gift size={15} /> Digital Gift Cards
        </span>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 12px' }}>
          Give the gift of Iron Within
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.55 }}>
          Delivered by email with a personal message. Redeemed at checkout, any unused balance stays on the card. They never expire.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 24 }} className="gc-grid">
        {/* Buy panel */}
        <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 28 }}>
          {added ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,207,255,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Check size={28} color="var(--primary-blue)" />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-light)', margin: '0 0 8px' }}>Added to your cart</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 22px' }}>
                A <strong style={{ color: 'var(--text-light)' }}>${amount}</strong> gift card for{' '}
                <strong style={{ color: 'var(--text-light)' }}>{form.recipientEmail}</strong>. We'll email it to them once your order is paid.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/cart" style={{ padding: '12px 22px', background: 'var(--gradient-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}>
                  Go to Cart
                </Link>
                <button onClick={() => { setAdded(false); setForm({ recipientName: '', recipientEmail: '', message: '' }); }}
                  style={{ padding: '12px 22px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.92rem', fontFamily: 'var(--font-body)' }}>
                  Send another
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Amount */}
              <label style={labelStyle}>Choose an amount</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 22 }}>
                {TIERS.map((t) => {
                  const active = t.amount === amount;
                  return (
                    <button key={t.amount} type="button" onClick={() => setAmount(t.amount)}
                      style={{
                        padding: '18px 0', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font-body)',
                        fontSize: '1.25rem', fontWeight: 800,
                        background: active ? 'rgba(0,207,255,0.10)' : 'var(--bg-dark)',
                        border: `1.5px solid ${active ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                        color: active ? 'var(--primary-blue)' : 'var(--text-light)',
                      }}>
                      ${t.amount}
                    </button>
                  );
                })}
              </div>

              {/* Recipient */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Recipient's name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input style={inputStyle} value={form.recipientName} onChange={set('recipientName')} placeholder="e.g. Alex" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Recipient's email</label>
                <input style={inputStyle} type="email" value={form.recipientEmail} onChange={set('recipientEmail')} placeholder="name@example.com" />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Personal message <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea style={{ ...inputStyle, minHeight: 84, resize: 'vertical' }} value={form.message} onChange={set('message')} maxLength={500} placeholder="Add a note to your gift…" />
              </div>

              {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', margin: '0 0 14px' }}>{error}</p>}

              <button onClick={handleAdd} disabled={adding}
                style={{ width: '100%', padding: 15, background: 'var(--gradient-primary)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: adding ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: 'var(--glow-blue)', opacity: adding ? 0.8 : 1 }}>
                {adding ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Adding…</> : <><Gift size={16} /> Add ${amount} Gift Card to Cart</>}
              </button>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12, marginBottom: 0 }}>
                The code is emailed to the recipient once your order is paid.
              </p>
            </>
          )}
        </div>

        {/* How it works + balance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-light)', margin: '0 0 16px' }}>How it works</h3>
            {[
              { Icon: Mail, t: 'Delivered by email', d: 'Your recipient gets the code (and your message) by email.' },
              { Icon: Wallet, t: 'Balance carries over', d: 'Spend part of it and the rest stays on the card for next time.' },
              { Icon: Clock, t: 'Never expires', d: 'Use it whenever — there’s no expiration date.' },
              { Icon: ShieldCheck, t: 'Easy redemption', d: 'Enter the code in the coupon box at checkout.' },
            ].map(({ Icon, t, d }) => (
              <div key={t} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: 'rgba(0,207,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} color="var(--primary-blue)" />
                </span>
                <span>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-light)' }}>{t}</span>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{d}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Balance checker */}
          <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-light)', margin: '0 0 12px' }}>Check a gift card balance</h3>
            <form onSubmit={checkBalance} style={{ display: 'flex', gap: 8 }}>
              <input style={inputStyle} value={balCode} onChange={(e) => setBalCode(e.target.value)} placeholder="IWGC-XXXX-XXXX-XXXX" />
              <button type="submit" disabled={balState?.loading}
                style={{ padding: '0 18px', background: 'var(--bg-dark)', border: '1px solid var(--primary-blue)', borderRadius: 10, color: 'var(--primary-blue)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                {balState?.loading ? '…' : 'Check'}
              </button>
            </form>
            {balState?.result && (
              <p style={{ marginTop: 12, marginBottom: 0, fontSize: '0.88rem', color: balState.result.valid ? 'var(--text-light)' : 'var(--text-muted)' }}>
                {balState.result.valid
                  ? (balState.result.depleted
                      ? 'This gift card has been fully used.'
                      : <>Remaining balance: <strong style={{ color: 'var(--primary-blue)' }}>${Number(balState.result.balance).toFixed(2)}</strong></>)
                  : (balState.result.message || 'Code not found.')}
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`@media (min-width: 860px){ .gc-grid { grid-template-columns: 1.15fr 0.85fr !important; align-items: start; } }`}</style>
    </main>
  );
}

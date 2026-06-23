'use client';
// src/app/continuity/page.js
//
// Prepaid "Research Plans" offer page. Plans are simple products in the
// "Continuity Plans" category, each carrying _iw_plan_months meta. Buying one is a
// single charge (no stored card / no recurring billing); the iw-continuity.php
// mu-plugin then schedules the monthly shipments + reminders.

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import { useCart } from '@/context/CartContext';
import {
  CalendarClock, Truck, Sparkles, Lock, PackageCheck, ShieldCheck,
  Check, ArrowRight, Loader2,
} from 'lucide-react';

const GET_PLANS = gql`
  query ContinuityPlans {
    products(first: 30, where: { category: "Continuity Plans" }) {
      nodes {
        databaseId
        name
        slug
        image { sourceUrl }
        ... on SimpleProduct { price regularPrice }
      }
    }
  }
`;

const BASES = [
  { key: 'rt-3', label: 'RT-3 10mg', tag: 'Metabolic & body-composition research', dose: 'Ships 1 vial (10mg) per month' },
  { key: 'cjc-ipa', label: 'CJC / IPA (10+10)', tag: 'GH-axis research blend', dose: 'Ships 3 vials (10mg + 10mg) per month' },
  { key: 'mots-c', label: 'MOTS-C 40mg', tag: 'Mitochondrial & metabolic research', dose: 'Ships 1 vial (40mg) per month' },
];

const toNum = (s) => parseFloat(String(s || '').replace(/[^0-9.]/g, '')) || 0;
const fmt = (n) => '$' + n.toFixed(2);

export default function ContinuityPage() {
  const { data, loading } = useQuery(GET_PLANS);
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(null);
  const [added, setAdded] = useState(null);

  const nodes = data?.products?.nodes || [];
  const planFor = (key, months) =>
    nodes.find((n) => n.slug.startsWith(key + '-') && n.slug.includes(`${months}-month`));

  const handleAdd = async (plan) => {
    if (!plan) return;
    setAdding(plan.databaseId);
    try {
      await addToCart(plan.databaseId, 1);
      setAdded(plan.databaseId);
      setTimeout(() => setAdded(null), 2500);
    } catch (e) { /* noop */ } finally {
      setAdding(null);
    }
  };

  const stack = [
    { Icon: Sparkles, t: 'Up to 1 month free', d: '6-month plans include a free month — ~17% off.' },
    { Icon: Truck, t: 'Free U.S. shipping', d: 'Every shipment, the whole plan.' },
    { Icon: Lock, t: 'Locked-in price', d: 'Your price never changes for the term.' },
    { Icon: PackageCheck, t: 'Fresh every month', d: 'We ship one vial at a time — never stockpiled.' },
    { Icon: Sparkles, t: 'Up to 600 bonus points', d: 'Stacked IWR Rewards on top of your plan.' },
    { Icon: ShieldCheck, t: 'One charge, no card stored', d: 'Prepaid — no recurring billing, ever.' },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 15px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.3)', borderRadius: 999, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--primary-blue)', marginBottom: 16 }}>
          <CalendarClock size={14} /> Research Plans
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.1 }}>
          Never run out mid-study. Lock in your supply.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.6, maxWidth: 620, margin: '0 auto' }}>
          Prepay 3 or 6 months, pay once, and we ship a fresh vial every month. Get a month free,
          free shipping, and bonus points — <strong style={{ color: 'var(--text-light)' }}>no recurring charges and no card kept on file.</strong>
        </p>
      </div>

      {/* Value stack */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 52 }}>
        {stack.map(({ Icon, t, d }) => (
          <div key={t} style={{ display: 'flex', gap: 12, padding: '16px 18px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 14 }}>
            <Icon size={20} color="var(--primary-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{t}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.45 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 8 }}>
        Choose your plan
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>
        99%+ purity, COA on every vial. For research use only.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <Loader2 size={26} className="spin" style={{ animation: 'spin 0.9s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
          {BASES.map((base) => {
            const p3 = planFor(base.key, 3);
            const p6 = planFor(base.key, 6);
            const img = (p6 || p3)?.image?.sourceUrl;
            return (
              <div key={base.key} style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 20px 0' }}>
                  {img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={img} alt={base.label} width={64} height={64} style={{ width: 64, height: 64, objectFit: 'contain', flexShrink: 0 }} />
                  )}
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0 }}>{base.label}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '3px 0 0' }}>{base.tag}</p>
                    <p style={{ color: 'var(--primary-blue)', fontSize: '0.76rem', fontWeight: 600, margin: '4px 0 0' }}>{base.dose}</p>
                  </div>
                </div>

                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  {[{ plan: p3, months: 3, badge: 'Save 10%', best: false }, { plan: p6, months: 6, badge: '1 Month FREE', best: true }].map(({ plan, months, badge, best }) => {
                    if (!plan) return null;
                    const price = toNum(plan.price);
                    const perMo = price / months;
                    const isAdding = adding === plan.databaseId;
                    const isAdded = added === plan.databaseId;
                    return (
                      <div key={months} style={{ border: `1px solid ${best ? 'rgba(0,207,255,0.45)' : 'var(--glass-border)'}`, background: best ? 'rgba(0,207,255,0.05)' : 'transparent', borderRadius: 12, padding: '14px 15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.98rem' }}>{months} Months</span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: best ? '#34d399' : 'var(--primary-blue)', background: best ? 'rgba(52,211,153,0.12)' : 'rgba(0,207,255,0.1)', padding: '3px 9px', borderRadius: 999 }}>{badge}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{fmt(price)}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>· {fmt(perMo)}/mo</span>
                        </div>
                        <button onClick={() => handleAdd(plan)} disabled={isAdding} style={{
                          width: '100%', padding: '11px', borderRadius: 9, border: 'none', cursor: isAdding ? 'wait' : 'pointer',
                          fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                          color: '#fff', background: best ? 'linear-gradient(135deg,#00cfff,#ec4899)' : 'var(--card-elevated)',
                          border: best ? 'none' : '1px solid var(--glass-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        }}>
                          {isAdding ? <Loader2 size={15} style={{ animation: 'spin 0.9s linear infinite' }} /> : isAdded ? <><Check size={15} /> Added</> : <>Start this plan <ArrowRight size={14} /></>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View cart nudge */}
      {added && (
        <div style={{ textAlign: 'center', marginTop: 26 }}>
          <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 26px', background: 'var(--card-elevated)', border: '1px solid rgba(0,207,255,0.4)', borderRadius: 10, color: 'var(--text-light)', fontWeight: 700, textDecoration: 'none' }}>
            View cart & check out <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* How it works */}
      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 28 }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {[
            { n: '1', t: 'Pick a plan & pay once', d: 'One charge for the whole term. No card is saved.' },
            { n: '2', t: 'First vial ships now', d: 'Your research supply starts immediately.' },
            { n: '3', t: 'Fresh vial every month', d: 'We ship the next one ~every 30 days and email you each time.' },
          ].map((s) => (
            <div key={s.n} style={{ padding: '22px 20px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#00cfff,#ec4899)', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>{s.n}</div>
              <div style={{ fontWeight: 800, color: '#fff', marginBottom: 5 }}>{s.t}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 56, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          { q: 'Is this a subscription?', a: 'No. You pay once for the whole plan — there are no recurring charges and we never store your card. It\'s a prepaid supply we ship out monthly.' },
          { q: 'Can I change the dose?', a: 'Yes — just reply to your confirmation email and we\'ll adjust your monthly vial.' },
          { q: 'What if I want to stop?', a: 'There\'s nothing to cancel since it\'s prepaid. When your plan ends, you simply choose whether to renew.' },
          { q: 'Is shipping included?', a: 'Yes — every shipment in the plan ships free within the U.S.' },
        ].map((f) => (
          <details key={f.q} style={{ borderBottom: '1px solid var(--glass-border)', padding: '16px 4px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: '#fff', fontSize: '0.95rem', listStyle: 'none' }}>{f.q}</summary>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: '10px 0 0' }}>{f.a}</p>
          </details>
        ))}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } } details > summary::-webkit-details-marker { display:none; }`}</style>
    </div>
  );
}

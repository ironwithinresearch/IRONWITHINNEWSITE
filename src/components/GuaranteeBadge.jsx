'use client';

import { ShieldCheck, FlaskConical, FileCheck2, Truck, Lock } from 'lucide-react';

/* Loud risk-reversal + proof badges (Hormozi). Self-contained card; drop it on
   product pages, the cart, and the homepage. */

const PROOF = [
  { Icon: FlaskConical, label: '99%+ Purity', sub: '3rd-party lab-tested' },
  { Icon: FileCheck2, label: 'COA on every order', sub: 'verified results' },
  { Icon: Truck, label: 'Fast discreet shipping', sub: 'ships in 24–48h' },
  { Icon: Lock, label: 'Secure checkout', sub: 'SSL encrypted' },
];

export default function GuaranteeBadge({ style = {} }) {
  return (
    <div style={{ background: 'var(--card-dark)', border: '1px solid rgba(0,207,255,0.28)', borderRadius: '16px', padding: '20px 22px', boxShadow: '0 0 0 1px rgba(0,207,255,0.04), 0 10px 30px rgba(0,0,0,0.25)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '12px', background: 'rgba(0,207,255,0.12)', border: '1px solid rgba(0,207,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={24} color="var(--primary-blue)" />
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-light)', margin: '2px 0 6px' }}>
            The Iron Within Purity Guarantee
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Every product is independently <strong style={{ color: 'var(--text-light)' }}>third-party lab-tested to 99%+ purity</strong> and ships with a verified Certificate of Analysis. If your order ever isn&apos;t as described, we&apos;ll make it right — <strong style={{ color: 'var(--text-light)' }}>replacement or refund</strong>.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--glass-border)' }}>
        {PROOF.map(({ Icon, label, sub }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon size={20} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>{label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

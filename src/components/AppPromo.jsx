'use client';

import { Smartphone } from 'lucide-react';

const APPLE_URL = 'https://apps.apple.com/us/app/peptide-paradigm/id6761913077';
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.ironsearch.peptide';

/* Homepage band promoting the Peptide Paradigm reference app. Keeps research
   reference material off the store (compliance) by pointing to the app. */
export default function AppPromo() {
  return (
    <section style={{ padding: '40px 24px 64px' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, var(--card-dark), var(--card-elevated))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 22, padding: '32px 34px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ flex: '1 1 360px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 14 }}>
              <Smartphone size={13} /> Free Reference Guide
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '0 0 10px', lineHeight: 1.15 }}>
              Your free peptide reference guide
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 20px', maxWidth: 540 }}>
              Look up any compound — mechanisms, references, and the latest research, organized and searchable. The <strong style={{ color: 'var(--text-light)' }}>Peptide Paradigm</strong> app is the reference layer that pairs with your bench work. Free on iPhone &amp; Android.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={APPLE_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 26px', background: 'linear-gradient(90deg,#7c3aed,#c026d3)', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 0 26px rgba(124,58,237,0.4)' }}>
                <Smartphone size={16} /> App Store
              </a>
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 26px', background: 'var(--card-elevated)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 12, color: 'var(--text-light)', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none' }}>
                <Smartphone size={16} color="#a78bfa" /> Google Play
              </a>
            </div>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pp-app-icon.png" alt="Peptide Paradigm app" width={132} height={132} style={{ width: 132, height: 132, borderRadius: 28, display: 'block', boxShadow: '0 0 34px rgba(124,58,237,0.4)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

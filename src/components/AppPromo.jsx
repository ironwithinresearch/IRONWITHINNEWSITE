'use client';

import { BookOpen, ArrowRight, Smartphone } from 'lucide-react';

const APP_URL = 'https://peptide-paradigm.vercel.app';

/* Homepage band promoting the Peptide Paradigm research app. Keeps research
   reference material off the store (compliance) by pointing to the app. */
export default function AppPromo() {
  return (
    <section style={{ padding: '40px 24px 64px' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, var(--card-dark), var(--card-elevated))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 22, padding: '32px 34px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ flex: '1 1 360px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 14 }}>
              <Smartphone size={13} /> Research App
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '0 0 10px', lineHeight: 1.15 }}>
              Your research companion — the Peptide Paradigm app
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 20px', maxWidth: 540 }}>
              Look up compounds, mechanisms of action, and the latest research in one place — built for researchers, free to start. The reference layer that pairs with your bench work.
            </p>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 32px', background: 'linear-gradient(90deg,#7c3aed,#c026d3)', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 0 26px rgba(124,58,237,0.45)' }}>
              Get the App <ArrowRight size={17} />
            </a>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ width: 120, height: 120, borderRadius: 28, background: 'radial-gradient(circle at 30% 30%, rgba(124,58,237,0.35), rgba(0,207,255,0.15))', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={52} color="#a78bfa" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

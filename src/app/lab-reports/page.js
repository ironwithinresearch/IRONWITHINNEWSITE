'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FlaskConical, FileText, Download, Search, ShieldCheck,
  BadgeCheck, ArrowRight, X,
} from 'lucide-react';
import { coaList } from '@/data/coas';

/* ── Lab Reports / COAs ──────────────────────────────────────
   Every research compound we carry is independently tested.
   COA PDFs are self-hosted in /public/coas and listed from
   src/data/coas.js (keyed by product slug). */

export default function LabReportsPage() {
  const [query, setQuery] = useState('');

  const reports = useMemo(() => {
    const list = [...coaList].sort((a, b) =>
      (a.productName || '').localeCompare(b.productName || '')
    );
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        (r.productName || '').toLowerCase().includes(q) ||
        (r.slug || '').toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div style={{ background: 'var(--bg-dark)', color: 'var(--text-light)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '72px 24px 40px', textAlign: 'center', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center top, rgba(0,207,255,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 999,
              background: 'rgba(0,207,255,0.12)', color: 'var(--primary-blue)',
              fontSize: '0.8rem', fontWeight: 600, marginBottom: 20,
              border: '1px solid var(--glass-border)',
            }}
          >
            <ShieldCheck size={15} /> 3rd-Party Independent Testing
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.05, margin: '0 0 16px', fontFamily: 'var(--font-heading)' }}>
            Lab Reports &amp; <span className="text-gradient">Certificates of Analysis</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Every compound we supply is independently tested for identity and purity.
            Browse and download the Certificate of Analysis (COA) for each product&apos;s batch.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 460, margin: '0 auto' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by compound name…"
              aria-label="Search lab reports"
              style={{
                width: '100%', padding: '13px 44px 13px 46px',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)',
                background: 'rgba(15,23,42,0.8)', color: 'var(--text-light)',
                fontSize: '0.95rem', outline: 'none', fontFamily: 'var(--font-body)',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 14 }}>
            {reports.length} {reports.length === 1 ? 'report' : 'reports'} available
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '8px 24px 80px' }}>
        <div
          style={{
            maxWidth: 1180, margin: '0 auto',
            display: 'grid', gap: 18,
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {reports.map((r) => (
            <div
              key={r.slug}
              style={{
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg, 16px)', padding: 22,
                display: 'flex', flexDirection: 'column', gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'rgba(0,207,255,0.12)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} />
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                      {r.productName}
                    </h3>
                    {r.batchDate ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Batch tested {r.batchDate}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span title="Purity verified" style={{ color: '#34d399', display: 'flex', flexShrink: 0 }}>
                  <BadgeCheck size={18} />
                </span>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                <a
                  href={r.coaFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-primary)', color: '#001018',
                    fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
                  }}
                >
                  <FileText size={15} /> View COA
                </a>
                <a
                  href={r.coaFile}
                  download
                  aria-label={`Download ${r.productName} COA`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '10px 14px', borderRadius: 'var(--radius-md)',
                    background: 'transparent', border: '1px solid var(--primary-blue)',
                    color: 'var(--primary-blue)', textDecoration: 'none',
                  }}
                >
                  <Download size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <FlaskConical size={40} style={{ opacity: 0.4, marginBottom: 12 }} />
            <p>No reports match “{query}”.</p>
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '0 24px 90px' }}>
        <div
          style={{
            maxWidth: 880, margin: '0 auto', textAlign: 'center',
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg, 16px)', padding: '40px 28px',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 10px' }}>
            Every order ships with its COA
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 22px', lineHeight: 1.6 }}>
            The Certificate of Analysis for your batch is attached to each product page and
            included with your confirmation email.
          </p>
          <Link
            href="/shop"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)', color: '#001018',
              fontWeight: 700, textDecoration: 'none',
            }}
          >
            Browse the catalog <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, Download, ShieldCheck, BadgeCheck, ArrowRight, QrCode } from 'lucide-react';
import { getCoaByFile, getBatches, coaSlugByFile } from '@/data/coas';

/* ── Vial-label QR destination ───────────────────────────────
   Vial labels are printed with a QR pointing at whichever single batch PDF
   was current at print time: https://ironwithin.io/coas/<file>.pdf
   Those labels are already in customers' hands and can never be reprinted,
   so this route owns /coas/* and answers with EVERY batch COA for that
   product — not just the one batch that happened to be current.

   The PDFs themselves now live in /public/coa-pdf/ so they stay directly
   viewable; this path is reserved for the scan-a-vial experience.
   Add a new batch to src/data/coas.js and it shows up here automatically. */

export const revalidate = 600;
export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(coaSlugByFile).map((file) => ({ file }));
}

export function generateMetadata({ params }) {
  const coa = getCoaByFile(decodeURIComponent(params.file));
  if (!coa) return { title: 'Certificates of Analysis | Titanium Within Research' };
  return {
    title: `${coa.productName} — Certificates of Analysis | Titanium Within Research`,
    description: `Every independently tested batch COA for ${coa.productName}, including purity and endotoxin results.`,
    robots: { index: false, follow: true },
  };
}

export default function CoaByFilePage({ params }) {
  const file = decodeURIComponent(params.file);
  const coa = getCoaByFile(file);

  // Unknown filename (a retired PDF, or a typo) — send them to the full index
  // rather than a dead end.
  if (!coa) redirect('/lab-reports');

  const batches = getBatches(coa.slug);
  const scanned = batches.findIndex((b) => b.coaFile.split('/').pop() === file);

  return (
    <div style={{ background: 'var(--bg-dark)', color: 'var(--text-light)', minHeight: '100vh' }}>
      <section style={{ position: 'relative', padding: '64px 24px 32px', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center top, rgba(168,85,247,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 780, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 999,
              background: 'rgba(168,85,247,0.12)', color: 'var(--primary-blue)',
              fontSize: '0.8rem', fontWeight: 600, marginBottom: 18,
              border: '1px solid var(--glass-border)',
            }}
          >
            <QrCode size={15} /> Scanned from a vial label
          </span>

          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.9rem)', fontWeight: 800, lineHeight: 1.05, margin: '0 0 14px', fontFamily: 'var(--font-heading)' }}>
            {coa.productName} <span className="text-gradient">Certificates of Analysis</span>
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 8px' }}>
            {batches.length > 1
              ? `Every batch of ${coa.productName} we've tested — ${batches.length} in total, newest first. Each report is independent third-party testing for identity, purity and endotoxin.`
              : `The independent third-party test report for ${coa.productName} — identity, purity and endotoxin.`}
          </p>
        </div>
      </section>

      <section style={{ padding: '8px 24px 40px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {batches.map((b, i) => {
            const isScanned = i === scanned;
            return (
              <div
                key={b.coaFile}
                style={{
                  background: 'var(--glass-bg)',
                  border: `1px solid ${isScanned ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-lg, 16px)', padding: 20,
                  display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                }}
              >
                <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(168,85,247,0.12)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={20} />
                </span>

                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                      {b.batchDate}
                    </h2>
                    {i === 0 && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 999, background: 'rgba(52,211,153,0.14)', color: '#34d399' }}>
                        LATEST
                      </span>
                    )}
                    {isScanned && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 999, background: 'rgba(168,85,247,0.14)', color: 'var(--primary-blue)' }}>
                        YOUR VIAL
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                    <BadgeCheck size={13} style={{ color: '#34d399' }} /> Independently tested
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                  <a
                    href={b.coaFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      padding: '10px 16px', borderRadius: 'var(--radius-md)',
                      background: 'var(--gradient-primary)', color: '#001018',
                      fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
                    }}
                  >
                    <FileText size={15} /> View COA
                  </a>
                  <a
                    href={b.coaFile}
                    download
                    aria-label={`Download ${coa.productName} COA ${b.batchDate}`}
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
            );
          })}
        </div>
      </section>

      <section style={{ padding: '0 24px 90px' }}>
        <div
          style={{
            maxWidth: 780, margin: '0 auto', textAlign: 'center',
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg, 16px)', padding: '32px 26px',
          }}
        >
          <span style={{ display: 'inline-flex', color: 'var(--primary-blue)', marginBottom: 10 }}>
            <ShieldCheck size={26} />
          </span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 10px' }}>
            Batch-over-batch testing, published
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 22px', lineHeight: 1.6, fontSize: '0.95rem' }}>
            We keep every historical report online — not just the current one — so you can
            verify our consistency over time.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`/product/${coa.slug}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 22px', borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)', color: '#001018',
                fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
              }}
            >
              View product <ArrowRight size={16} />
            </Link>
            <Link
              href="/lab-reports"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 22px', borderRadius: 'var(--radius-md)',
                background: 'transparent', border: '1px solid var(--primary-blue)',
                color: 'var(--primary-blue)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
              }}
            >
              All lab reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

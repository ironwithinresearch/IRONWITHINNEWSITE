'use client';
// src/app/affiliate/resources/page.js
// Affiliate Swipe Pack — done-for-you, compliance-safe content so affiliates post in minutes.

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Sparkles, ShieldAlert, ShieldCheck, ArrowRight, Download, Film } from 'lucide-react';

const CAPTIONS = [
  "Doing peptide research? Iron Within Research is the only source I trust — 99%+ purity with a Certificate of Analysis on every single vial. Use code [YOURCODE] → ironwithin.io",
  "If you care about clean inputs, your source matters. Iron Within third-party lab-tests every batch to 99%+ purity and includes the COA. Code [YOURCODE] for a discount. 🔬",
  "Restocked my research supplies from @ironwithinresearch again. Fast, discreet shipping and a COA in every order. [YOURCODE] saves you on your first one.",
  "New flagship: the Grand Slam research bundle — three of the most-requested compounds in one box, COA on each vial. Grab it with code [YOURCODE].",
  "Tip for anyone sourcing research peptides: always demand a Certificate of Analysis. Iron Within includes one on every vial. That's why I send people there. [YOURCODE]",
  "Running a longer study? Iron Within now has prepaid 3 & 6-month Research Plans — lock your supply, get a month free. Use [YOURCODE].",
];

const HOOKS = [
  "\"The #1 thing people get wrong when sourcing research peptides…\"",
  "\"How I vet a peptide supplier (most fail step 2)\"",
  "\"Why I only buy from labs that publish a COA\"",
  "\"Stop buying research peptides until you read this\"",
];

const DISCLOSURE = "#ad #affiliate — I earn a commission on purchases made with my code. For research use only. Not for human consumption.";

const GRAPHICS = [
  { src: '/affiliate-assets/g1.png', label: 'Story — Trust' },
  { src: '/affiliate-assets/g2.png', label: 'Story — COA' },
  { src: '/affiliate-assets/g7.png', label: 'Story — Research Plans' },
  { src: '/affiliate-assets/g8.png', label: 'Story — Why us' },
  { src: '/affiliate-assets/g9.png', label: 'Story — Grand Slam' },
  { src: '/affiliate-assets/g3.png', label: 'Discount — Save' },
  { src: '/affiliate-assets/g4.png', label: 'Discount — Stack' },
  { src: '/affiliate-assets/g5.png', label: 'Square — Trust' },
  { src: '/affiliate-assets/g6.png', label: 'Square — Save' },
];

const SCRIPTS = [
  {
    title: '"How I vet a supplier" (15–20s)',
    body: 'HOOK (on camera): "How I vet a research peptide supplier — most fail step 2."\nSHOT: hold up a vial, then show a COA on your phone.\nVO/TEXT: "Step 1: third-party lab tested. Step 2: a Certificate of Analysis on every vial — 99%+ purity. Iron Within does both."\nCTA: "Code in my caption. Research use only."',
  },
  {
    title: '"Restock unboxing" (15–25s)',
    body: 'HOOK: "Restocking my research supplies."\nSHOT: quick unboxing — vials lined up, flash the COA card.\nTEXT overlay: "99%+ purity · COA in every order · ships in 24h."\nCTA: "My code\'s in the caption for a discount."',
  },
  {
    title: '"The one thing to check" (20–30s)',
    body: 'HOOK: "Stop buying research peptides without this one thing."\nSHOT: hold a vial, point to the COA.\nVO/TEXT: "A Certificate of Analysis. It proves what\'s actually in the vial. No COA, no buy — Iron Within includes one on every order, 99%+ purity, third-party tested."\nCTA: "Use my code (caption). For research use only — not for human consumption."',
  },
];

function Snippet({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (e) { /* noop */ }
  };
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '14px 16px' }}>
      <p style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0, whiteSpace: 'pre-line' }}>{text}</p>
      <button onClick={copy} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--glass-border)', background: copied ? 'rgba(52,211,153,0.15)' : 'var(--card-elevated)', color: copied ? '#34d399' : 'var(--text-light)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
        {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
      </button>
    </div>
  );
}

export default function AffiliateResourcesPage() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 15px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.3)', borderRadius: 999, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--primary-blue)', marginBottom: 16 }}>
          <Sparkles size={14} /> Affiliate Swipe Pack
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0 0 12px' }}>Post in 5 minutes</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
          Copy any caption, swap <strong style={{ color: 'var(--text-light)' }}>[YOURCODE]</strong> for your affiliate code (find it in your <a href="https://ironwithin.goaffpro.com/login" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>dashboard</a>), add the disclosure, and post.
        </p>
      </div>

      {/* Captions */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>Ready-to-post captions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {CAPTIONS.map((c, i) => <Snippet key={i} text={c} />)}
      </div>

      {/* Hooks */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Video / Reel hooks</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 14px' }}>Open with one of these, then show the product + your code.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {HOOKS.map((h, i) => <Snippet key={i} text={h} />)}
      </div>

      {/* Graphics */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Ready-to-post graphics</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 14px', lineHeight: 1.5 }}>Vertical 1080×1920 story / Reel covers + discount callouts. Tap to download, post, and put your code in the caption. (The <strong style={{ color: 'var(--text-light)' }}>[YOURCODE]</strong> spot = drop your real code in the caption — want it burned into the image? Reply and I'll send a custom one.)</p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
        {GRAPHICS.map((g) => (
          <a key={g.src} href={g.src} download style={{ textDecoration: 'none', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.src} alt={g.label} style={{ width: 132, borderRadius: 10, display: 'block', border: '1px solid var(--glass-border)' }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: '0.76rem', color: 'var(--primary-blue)', fontWeight: 700 }}><Download size={13} /> Download</span>
          </a>
        ))}
      </div>

      {/* Reel scripts */}
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}><Film size={18} color="var(--primary-blue)" /> Reel / TikTok scripts</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 14px' }}>Shot-by-shot, 15–30s. Copy, film, post.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
        {SCRIPTS.map((s, i) => (
          <div key={i}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem', marginBottom: 8 }}>{s.title}</div>
            <Snippet text={s.body} />
          </div>
        ))}
      </div>

      {/* Disclosure */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Required disclosure</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 14px' }}>Add this to every post — it keeps you (and us) compliant.</p>
      <div style={{ marginBottom: 40 }}><Snippet text={DISCLOSURE} /></div>

      {/* Talking points */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>Proof points you can use</h2>
      <ul style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.9, margin: '0 0 40px', paddingLeft: 20 }}>
        <li><strong style={{ color: 'var(--text-light)' }}>99%+ purity</strong>, independently third-party lab-tested</li>
        <li><strong style={{ color: 'var(--text-light)' }}>Certificate of Analysis</strong> on every vial</li>
        <li>Ships in <strong style={{ color: 'var(--text-light)' }}>24–48 hours</strong>, discreet packaging</li>
        <li>Flagship <strong style={{ color: 'var(--text-light)' }}>Grand Slam</strong> & <strong style={{ color: 'var(--text-light)' }}>Long Shot</strong> bundles + prepaid <Link href="/continuity" style={{ color: 'var(--primary-blue)' }}>Research Plans</Link></li>
        <li>Product images: grab them straight from any <Link href="/shop" style={{ color: 'var(--primary-blue)' }}>product page</Link></li>
      </ul>

      {/* Compliance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: '#34d399', marginBottom: 10 }}><ShieldCheck size={17} /> DO talk about</div>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
            <li>Purity, lab testing, the COA</li>
            <li>Shipping speed, price, your code</li>
            <li>"Research," "research-grade," the brand</li>
          </ul>
        </div>
        <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: '#f87171', marginBottom: 10 }}><ShieldAlert size={17} /> NEVER say</div>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
            <li>Health/weight-loss/medical claims</li>
            <li>Dosing or how to use it</li>
            <li>"For human use" / personal-use stories</li>
          </ul>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: 40 }}>
        These products are sold strictly for laboratory research. Health or human-use claims violate platform + FTC rules and put your account and ours at risk — stick to the proof points above.
      </p>

      <div style={{ textAlign: 'center' }}>
        <Link href="/affiliate" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 26px', background: 'var(--gradient-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
          Not an affiliate yet? Apply <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

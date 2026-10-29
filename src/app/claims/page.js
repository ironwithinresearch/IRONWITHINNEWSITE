'use client';
// src/app/claims/page.js
//
// Order-issue claim form. Collects what happened, checks it against the order on the backend
// (iw-claims.php) and files it for a human to decide. Nothing here promises an outcome: the
// policy is no refunds, replacement or store credit at our discretion, transit loss/damage via
// Route when the order had it. Photos are shrunk in the browser before upload so four of them
// stay under the 4.5 MB limit on the /api/claims route.

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const ISSUE_TYPES = [
  ['', 'Choose one…'],
  ['missing', 'Missing item'],
  ['damaged', 'Arrived damaged'],
  ['vial', 'Vial damaged or cloudy'],
  ['wrong', 'Wrong item'],
  ['transit', 'Package lost or damaged in transit'],
  ['other', 'Other'],
];
const PHOTO_REQUIRED = ['damaged', 'vial'];
const MAX_PHOTOS = 4;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // the /api/claims route body limit is 4.5 MB

const NO_MATCH = "We couldn't match that order number and email. Please check both against your order confirmation email.";

/** Downscale to ≤1600px JPEG in the browser. Falls back to the original file when it is small enough. */
async function shrinkPhoto(file) {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(bmp.width * scale));
    c.height = Math.max(1, Math.round(bmp.height * scale));
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.82));
    if (blob) return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {}
  return file.size <= 3 * 1024 * 1024 ? file : null;
}

function ClaimsForm() {
  const params = useSearchParams();

  const [order, setOrder] = useState('');
  const [email, setEmail] = useState('');
  const [items, setItems] = useState(null); // null = not looked up yet; [] = looked up
  const [picked, setPicked] = useState({}); // item_id -> qty (0 = not picked)
  const [issueType, setIssueType] = useState('');
  const [lot, setLot] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]); // [{file, url}]
  const [ack, setAck] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [lookupStatus, setLookupStatus] = useState('idle'); // idle | loading | error
  const [lookupError, setLookupError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const o = params?.get('order');
    if (o && /^\d+$/.test(o)) setOrder(o);
  }, [params]);

  // Revoke preview URLs when photos change / unmount.
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos]);

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const lookup = useCallback(async () => {
    setLookupError('');
    setItems(null);
    setPicked({});
    if (!/^\d+$/.test(order.trim())) { setLookupError('Please enter your order number (digits only).'); return; }
    if (!validEmail(email)) { setLookupError('Please enter the email address used on the order.'); return; }
    setLookupStatus('loading');
    try {
      const res = await fetch('/api/claims/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: order.trim(), email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setItems(data.items || []);
        setLookupStatus('idle');
      } else {
        setLookupStatus('error');
        setLookupError(data.error || NO_MATCH);
      }
    } catch {
      setLookupStatus('error');
      setLookupError('Something went wrong. Please try again or email support@ironwithin.io.');
    }
  }, [order, email]);

  const addPhotos = async (fileList) => {
    setError('');
    const incoming = Array.from(fileList || []).slice(0, MAX_PHOTOS - photos.length);
    const next = [];
    for (const f of incoming) {
      const shrunk = await shrinkPhoto(f);
      if (!shrunk) { setError('One photo could not be read. Please use a JPG, PNG or HEIC photo under 3 MB.'); continue; }
      next.push({ file: shrunk, url: URL.createObjectURL(shrunk) });
    }
    setPhotos((p) => [...p, ...next].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (i) => setPhotos((p) => { URL.revokeObjectURL(p[i].url); return p.filter((_, j) => j !== i); });

  const submit = async () => {
    setError('');
    const pickedItems = Object.entries(picked).filter(([, q]) => q > 0).map(([id, q]) => ({ item_id: Number(id), qty: q }));
    if (!items) { setError('Please find your order first so you can pick the affected items.'); return; }
    if (pickedItems.length === 0) { setError('Please tick at least one affected item.'); return; }
    if (!issueType) { setError('Please choose what happened.'); return; }
    if (description.trim().length < 10) { setError('Please describe what happened (a sentence or two).'); return; }
    if (PHOTO_REQUIRED.includes(issueType) && photos.length === 0) { setError('Please attach at least one photo showing the vial, its label and the problem.'); return; }
    if (!ack) { setError('Please confirm the research-use-only acknowledgement.'); return; }
    const total = photos.reduce((s, p) => s + p.file.size, 0);
    if (total > MAX_TOTAL_BYTES) { setError('Your photos are too large together. Please remove one and try again.'); return; }

    setStatus('sending');
    try {
      const fd = new FormData();
      fd.append('order', order.trim());
      fd.append('email', email.trim());
      fd.append('items', JSON.stringify(pickedItems));
      fd.append('issue_type', issueType);
      fd.append('lot', lot.trim());
      fd.append('description', description.trim());
      fd.append('ruo_ack', '1');
      fd.append('website', website);
      photos.forEach((p, i) => fd.append(`photo${i + 1}`, p.file, p.file.name));
      const res = await fetch('/api/claims', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setResult(data);
        setStatus('sent');
      } else {
        setStatus('error');
        setError(data.error || 'Your claim could not be sent. Please email support@ironwithin.io.');
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again or email support@ironwithin.io.');
    }
  };

  const sending = status === 'sending';
  const photoRequired = PHOTO_REQUIRED.includes(issueType);

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '1rem', outline: 'none',
  };
  const labelStyle = { display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontWeight: 600 };
  const hintStyle = { color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', lineHeight: 1.5 };
  const secondaryBtn = {
    padding: '12px 20px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
    color: 'var(--text-light)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', minHeight: 44,
  };

  return (
    <div style={{ minHeight: '100vh', padding: '80px 16px', background: 'var(--background-dark)' }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: 900, marginBottom: '16px',
          background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Report an Order Issue</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '16px', lineHeight: 1.8 }}>
          Tell us what happened and we&apos;ll review it. Replacement or store credit is at our discretion under our policy; refunds are not offered. We reply by email.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px', lineHeight: 1.7 }}>
          Lost or damaged in transit? If your order included Route Package Protection, we&apos;ll check that and point you to Route&apos;s claim process.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '40px', lineHeight: 1.6 }}>
          All products are for research use only. Not for human or veterinary use. See our <Link href="/refund" style={{ color: 'var(--primary-blue)' }}>refund policy</Link> and <Link href="/ruo-policy" style={{ color: 'var(--primary-blue)' }}>research use only policy</Link>.
        </p>

        {status === 'sent' && result ? (
          <div style={{ padding: '24px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 'var(--radius-lg)', color: 'var(--text-light)' }}>
            <p style={{ fontWeight: 700, marginBottom: '6px', color: '#34d399' }}>Claim #{result.claim_id} received</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              We received claim #{result.claim_id} for order #{result.order}. We&apos;ll review it and reply by email. A confirmation is on its way to {email.trim()}.
            </p>
            {result.route_protected && ['transit', 'damaged'].includes(issueType) && (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '12px' }}>
                Your order included Route Package Protection. Loss or damage in transit is handled through Route:{' '}
                <a href="https://claims.route.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>claims.route.com</a> (have your order number ready).
              </p>
            )}
            <Link href="/orders" style={{ ...secondaryBtn, display: 'inline-block', marginTop: '16px', textDecoration: 'none' }}>Back to my orders</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Step 1 — find the order */}
            <div>
              <label htmlFor="claim-order" style={labelStyle}>Order number</label>
              <input id="claim-order" type="text" inputMode="numeric" placeholder="e.g. 7430" value={order}
                onChange={(e) => { setOrder(e.target.value); setItems(null); }} style={inputStyle} autoComplete="off" />
            </div>
            <div>
              <label htmlFor="claim-email" style={labelStyle}>Email on the order</label>
              <input id="claim-email" type="email" placeholder="your@email.com" value={email}
                onChange={(e) => { setEmail(e.target.value); setItems(null); }} style={inputStyle} autoComplete="email" />
            </div>
            <div>
              <button type="button" onClick={lookup} disabled={lookupStatus === 'loading'} style={{ ...secondaryBtn, opacity: lookupStatus === 'loading' ? 0.7 : 1 }}>
                {lookupStatus === 'loading' ? 'Finding your order…' : items ? 'Find again' : 'Find my order'}
              </button>
              {lookupError && <p style={{ color: '#f87171', fontSize: '0.9rem', margin: '10px 0 0' }}>{lookupError}</p>}
            </div>

            {/* Step 2 — items */}
            {items && (
              <fieldset style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px', margin: 0 }}>
                <legend style={{ ...labelStyle, padding: '0 6px', marginBottom: 0 }}>Which item(s) are affected?</legend>
                {items.length === 0 && <p style={hintStyle}>This order has no line items we can list. Email support@ironwithin.io instead.</p>}
                {items.map((it) => {
                  const q = picked[it.item_id] || 0;
                  return (
                    <div key={it.item_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 220px', minHeight: 40, cursor: 'pointer', color: 'var(--text-light)' }}>
                        <input type="checkbox" checked={q > 0} onChange={(e) => setPicked((p) => ({ ...p, [it.item_id]: e.target.checked ? 1 : 0 }))}
                          style={{ width: 20, height: 20, accentColor: 'var(--primary-blue)' }} />
                        <span>{it.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>(ordered {it.qty})</span></span>
                      </label>
                      {q > 0 && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          Qty affected
                          <select value={q} onChange={(e) => setPicked((p) => ({ ...p, [it.item_id]: Number(e.target.value) }))}
                            style={{ ...inputStyle, width: 'auto', padding: '8px 12px', minHeight: 40 }}>
                            {Array.from({ length: Math.max(1, it.qty) }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </label>
                      )}
                    </div>
                  );
                })}
              </fieldset>
            )}

            {/* Step 3 — what happened */}
            <div>
              <label htmlFor="claim-type" style={labelStyle}>What happened?</label>
              <select id="claim-type" value={issueType} onChange={(e) => setIssueType(e.target.value)} style={{ ...inputStyle, minHeight: 48 }}>
                {ISSUE_TYPES.map(([v, l]) => <option key={v} value={v} disabled={v === ''}>{l}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="claim-lot" style={labelStyle}>Batch / lot number <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input id="claim-lot" type="text" placeholder="e.g. IWR-1010-5AM" value={lot} onChange={(e) => setLot(e.target.value)} style={inputStyle} autoComplete="off" />
              <p style={hintStyle}>Printed on the vial label after &ldquo;Lot&rdquo;. It lets us check the batch records.</p>
            </div>

            <div>
              <label htmlFor="claim-desc" style={labelStyle}>Describe what happened</label>
              <textarea id="claim-desc" rows={5} placeholder="What arrived, what was wrong, and when you noticed it." value={description}
                onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Photos */}
            <div>
              <label htmlFor="claim-photos" style={labelStyle}>
                Photos {photoRequired ? <span style={{ color: '#fbbf24' }}>(required)</span> : <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(up to {MAX_PHOTOS})</span>}
              </label>
              <input id="claim-photos" type="file" accept="image/*" multiple disabled={photos.length >= MAX_PHOTOS}
                onChange={(e) => { addPhotos(e.target.files); e.target.value = ''; }}
                style={{ ...inputStyle, padding: '10px 12px' }} />
              <p style={hintStyle}>
                For a damaged or cloudy vial, photos must show the vial, its label and the problem. Photos are stored privately with your claim.
              </p>
              {photos.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {photos.map((p, i) => (
                    <div key={p.url} style={{ position: 'relative', width: 88, height: 88 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={`Photo ${i + 1}`} style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }} />
                      <button type="button" onClick={() => removePhoto(i)} aria-label={`Remove photo ${i + 1}`}
                        style={{ position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#f87171', color: '#fff', fontWeight: 700, cursor: 'pointer', lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Honeypot — hidden from humans */}
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)}
              aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />

            {/* RUO acknowledgement */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-light)', lineHeight: 1.5, cursor: 'pointer' }}>
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, accentColor: 'var(--primary-blue)' }} />
              <span>For research use only. Not for human or veterinary use.</span>
            </label>

            {error && <p style={{ color: '#f87171', fontSize: '0.9rem', margin: 0 }} role="alert">{error}</p>}

            <button type="button" onClick={submit} disabled={sending} style={{
              padding: '14px 32px', background: 'var(--gradient-primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff',
              fontWeight: 700, fontSize: '1rem', cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)',
              boxShadow: 'var(--glow-blue)', opacity: sending ? 0.7 : 1, minHeight: 48,
            }}>
              {sending ? 'Sending…' : 'Submit claim'}
            </button>
            <p style={{ ...hintStyle, marginTop: 0 }}>
              Your claim is stored with your order and sent to our support team. You&apos;ll get a confirmation email, then a reply once it has been reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClaimsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--background-dark)' }} />}>
      <ClaimsForm />
    </Suspense>
  );
}

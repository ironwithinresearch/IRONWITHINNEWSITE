'use client';
// src/app/register/page.js
//
// Researcher sign-up. Posts to /api/register → backend iw-research-access.php, which
// re-validates every field, stores the profile + the three acknowledgements (exact wording,
// timestamp, IP) as user meta, creates the account as PENDING and emails a confirmation
// link. A new account can browse straight away but cannot order until the email is
// confirmed AND our team approves it — the page says so plainly after sign-up.
//
// Required: legal name, work email, phone, address, research category, research purpose,
// organization name, industry / business classification, and every confirmation box.
// Org name + industry became required after the 20 Oct 2026 processor rescan (Brian approved).
// Optional: organization website, institution ID / EIN / credentials.

import { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import {
  FlaskConical, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle2, MailCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { setAgeCookie } from '../../lib/gate';
import { COUNTRIES } from '../../lib/countries';

// Exact wording — the backend stores its own copy of these strings with the timestamp.
// Each statement has its own box (processor rescan 20 Oct 2026).
const ACKS = [
  { key: 'age_21', node: <>I confirm I am <strong style={{ color: 'var(--text-light)' }}>21 years of age or older</strong>.</> },
  { key: 'terms', node: <>I have read and agree to the <Link href="/terms" style={{ color: 'var(--primary-blue)' }}>Terms of Service</Link> and <Link href="/disclaimer" style={{ color: 'var(--primary-blue)' }}>Disclaimer</Link>.</> },
  { key: 'privacy', node: <>I have read and accept the <Link href="/privacy" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</Link>.</> },
  { key: 'research_org', node: <>I represent a legitimate research organization and will use these products for lawful laboratory research only.</> },
  { key: 'not_human_use', node: <>I understand these products are not for human or veterinary use, diagnosis, treatment or consumption.</> },
];

// Both lists must match iw_ra_research_categories() / iw_ra_org_types() in iw-research-access.php.
const RESEARCH_CATEGORIES = [
  '', 'In-vitro / cell culture research', 'Metabolic research', 'Tissue repair & regeneration research',
  'Neuroscience research', 'Dermatology / cosmetic science research', 'Aging & longevity research',
  'Analytical chemistry / reference standards', 'Other laboratory research',
];

const ORG_TYPES = [
  '', 'University / academic lab', 'Private research laboratory', 'Biotech / pharmaceutical company',
  'Contract research organization (CRO)', 'Independent researcher', 'Other',
];

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', city: '', state: '', postcode: '', country: 'US',
  researchCategory: '', researchPurpose: '', orgName: '', orgType: '', orgWebsite: '', orgCredentials: '',
  password: '', confirmPassword: '', company_website_hp: '',
};

export default function RegisterPage() {
  const { login } = useAuth();
  // Where to go after signing up. Read after mount to avoid a static-prerender/hydration
  // mismatch; only same-site paths are honoured.
  const [redirectTo, setRedirectTo] = useState('/shop');
  const [loginHref, setLoginHref] = useState('/login');
  useEffect(() => {
    const rd = new URLSearchParams(window.location.search).get('redirect') || '';
    if (rd.startsWith('/') && !rd.startsWith('//')) {
      setRedirectTo(rd);
      setLoginHref(`/login?redirect=${encodeURIComponent(rd)}`);
    }
  }, []);

  const [form, setForm] = useState(EMPTY);
  const [acks, setAcks] = useState(() => Object.fromEntries(ACKS.map((a) => [a.key, false])));
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null); // { email, signedIn }

  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setError(''); };
  const allAcked = ACKS.every((a) => acks[a.key]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (!allAcked) { setError('Please tick every confirmation box to create an account.'); return; }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // age_21_terms is the pre-20-Oct key; sent only so sign-ups keep working while the
        // backend that knows the split boxes is deployed. Safe to drop afterwards.
        body: JSON.stringify({ ...payload, acks: { ...acks, age_21_terms: acks.age_21 && acks.terms } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }
      // The visitor confirmed 21+ on this form — let the server-side age gate know.
      setAgeCookie();
      let signedIn = false;
      try {
        const r = await login(form.email, form.password);
        signedIn = !!r?.success;
      } catch {}
      setDone({ email: form.email, signedIn });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('We could not reach the server. Please check your connection and try again.');
    }
    setLoading(false);
  };

  if (done) {
    return (
      <Shell>
        <div style={{ textAlign: 'center' }}>
          <MailCheck size={40} color="var(--primary-blue)" style={{ marginBottom: 12 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 10px' }}>
            Account created — confirm your email
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 14px' }}>
            We sent a confirmation link to <strong style={{ color: 'var(--text-light)' }}>{done.email}</strong>.
            Click it to confirm your address.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 22px', fontSize: '0.92rem' }}>
            Your account is <strong style={{ color: 'var(--text-light)' }}>pending approval</strong>: our team
            reviews every new researcher account before the first order, and we will email you as soon
            as it is approved. You can browse the catalog in the meantime.
          </p>
          {done.signedIn ? (
            <Link href={redirectTo} style={primaryBtn}>Continue <ArrowRight size={15} /></Link>
          ) : (
            <Link href={loginHref} style={primaryBtn}>Sign in <ArrowRight size={15} /></Link>
          )}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, margin: '0 0 6px' }}>
          Create a researcher account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.55 }}>
          For qualified researchers aged 21+. New accounts are reviewed before the first order.
        </p>
      </div>

      {error && (
        <div role="alert" style={{
          display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 14px', marginBottom: 18,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10, color: '#dc2626', fontSize: '0.875rem',
        }}>
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate={false}>
        {/* Honeypot — invisible to people, filled by bots. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
          <label>Company website<input tabIndex={-1} autoComplete="off" value={form.company_website_hp} onChange={set('company_website_hp')} /></label>
        </div>

        <Section title="Your details">
          <Row>
            <Input label="Legal first name" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} required />
            <Input label="Legal last name" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} required />
          </Row>
          <Input label="Work email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} required
            hint="Use your institutional or business email where you have one." />
          <Input label="Phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} required />
        </Section>

        <Section title="Address">
          <Input label="Street address" autoComplete="address-line1" value={form.address1} onChange={set('address1')} required />
          <Input label="Apartment, suite, unit (optional)" autoComplete="address-line2" value={form.address2} onChange={set('address2')} />
          <Row>
            <Input label="City" autoComplete="address-level2" value={form.city} onChange={set('city')} required />
            <Input label="State / province" autoComplete="address-level1" value={form.state} onChange={set('state')} required={form.country === 'US'} />
          </Row>
          <Row>
            <Input label="ZIP / postal code" autoComplete="postal-code" value={form.postcode} onChange={set('postcode')} required />
            <Select label="Country" autoComplete="country" value={form.country} onChange={set('country')} required
              options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))} />
          </Row>
        </Section>

        <Section title="Research">
          <Select label="Intended research category" value={form.researchCategory} onChange={set('researchCategory')} required
            options={RESEARCH_CATEGORIES.map((t) => ({ value: t, label: t || 'Select…' }))} />
          <TextArea label="Research purpose" value={form.researchPurpose} onChange={set('researchPurpose')} required
            hint="A sentence or two on the laboratory research these compounds are for." />
          <Input label="Business / organization name" autoComplete="organization" value={form.orgName} onChange={set('orgName')} required
            hint="Independent researchers can enter their own name or lab name." />
          <Select label="Industry / business classification" value={form.orgType} onChange={set('orgType')} required
            options={ORG_TYPES.map((t) => ({ value: t, label: t || 'Select…' }))} />
          <Input label="Organization website (optional)" type="url" inputMode="url" autoComplete="url" value={form.orgWebsite} onChange={set('orgWebsite')} placeholder="https://" />
          <Input label="Institution ID, EIN or credentials (optional)" value={form.orgCredentials} onChange={set('orgCredentials')} autoComplete="off" />
        </Section>

        <Section title="Password">
          <PasswordInput label="Password" value={form.password} onChange={set('password')} show={showPass} onToggle={() => setShowPass((v) => !v)} />
          <Input label="Confirm password" type={showPass ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} required minLength={8} />
        </Section>

        <fieldset style={{ border: 0, padding: 0, margin: '6px 0 20px' }}>
          <legend style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: 10 }}>
            Required confirmations
          </legend>
          {ACKS.map((a) => (
            <label key={a.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.55 }}>
              <input
                type="checkbox" required checked={acks[a.key]}
                onChange={(e) => { setAcks((s) => ({ ...s, [a.key]: e.target.checked })); setError(''); }}
                style={{ marginTop: 2, width: 20, height: 20, accentColor: 'var(--primary-blue)', flexShrink: 0, cursor: 'pointer' }}
              />
              <span>{a.node}</span>
            </label>
          ))}
        </fieldset>

        <button type="submit" disabled={loading} style={{
          width: '100%', minHeight: 48, padding: '13px', border: 'none', borderRadius: 10,
          background: 'linear-gradient(135deg, var(--primary-blue, #00cfff), var(--pink, #ec4899))',
          color: '#fff', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-body)',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {loading ? 'Creating account…' : <>Create account <ArrowRight size={15} /></>}
        </button>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5, margin: '12px 0 0', textAlign: 'center' }}>
          We store these details and confirmations with your account. See our <Link href="/privacy" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</Link> and <Link href="/ruo-policy" style={{ color: 'var(--primary-blue)' }}>Research Use Only Policy</Link>.
        </p>
      </form>

      <div style={{ textAlign: 'center', marginTop: 22, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link href={loginHref} style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Sign in</Link>
      </div>
    </Shell>
  );
}

/* ── layout pieces ───────────────────────────────────────── */

function Shell({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '32px 16px 48px' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto',
            background: 'linear-gradient(135deg, var(--primary-blue, #00cfff), var(--pink, #ec4899))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FlaskConical size={24} color="#fff" />
          </div>
        </div>
        <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 'clamp(20px, 5vw, 36px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary-blue)', margin: '0 0 10px' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </section>
  );
}

function Row({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>{children}</div>;
}

function Label({ id, label, required }) {
  return (
    <label htmlFor={id} style={labelStyle}>
      {label}{required && <span aria-hidden="true" style={{ color: '#dc2626' }}> *</span>}
    </label>
  );
}

function Hint({ id, children }) {
  return <p id={id} style={{ margin: '5px 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{children}</p>;
}

function Input({ label, hint, required, ...props }) {
  const id = useId();
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <input id={id} required={required} aria-describedby={hint ? `${id}-h` : undefined} {...props} type={props.type || 'text'} style={inputStyle} />
      {hint && <Hint id={`${id}-h`}>{hint}</Hint>}
    </div>
  );
}

function TextArea({ label, hint, required, ...props }) {
  const id = useId();
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <textarea id={id} required={required} rows={3} minLength={10} maxLength={2000} aria-describedby={hint ? `${id}-h` : undefined} {...props} style={{ ...inputStyle, resize: 'vertical', minHeight: 88 }} />
      {hint && <Hint id={`${id}-h`}>{hint}</Hint>}
    </div>
  );
}

function Select({ label, options, required, ...props }) {
  const id = useId();
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <select id={id} required={required} {...props} style={{ ...inputStyle, cursor: 'pointer' }}>
        {options.map((o) => <option key={o.value || 'none'} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, onToggle }) {
  const id = useId();
  return (
    <div>
      <Label id={id} label={label} required />
      <div style={{ position: 'relative' }}>
        <input id={id} type={show ? 'text' : 'password'} autoComplete="new-password" value={value} onChange={onChange}
          required minLength={8} placeholder="At least 8 characters" style={{ ...inputStyle, paddingRight: 48 }} />
        <button type="button" onClick={onToggle} aria-label={show ? 'Hide password' : 'Show password'} style={{
          position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44,
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

const primaryBtn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48,
  padding: '12px 28px', borderRadius: 10, fontWeight: 700, color: '#fff', textDecoration: 'none',
  background: 'linear-gradient(135deg, var(--primary-blue, #00cfff), var(--pink, #ec4899))',
};

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: 6,
};

const inputStyle = {
  width: '100%', minHeight: 44, padding: '11px 14px', boxSizing: 'border-box',
  background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 10,
  color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '1rem',
};

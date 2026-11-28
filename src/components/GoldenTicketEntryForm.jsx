'use client';
/* Free (no purchase) Golden Ticket entry — one entry per person per day. Posts to /api/christmas/enter
   (iw-xmas.php validates, dedupes per email per day, rate-limits per IP). The backend's message is
   shown verbatim so the visitor always knows whether the entry was stored. Used on /golden-ticket and
   /christmas so the free route sits right beside the buy route everywhere the ticket is offered. */
import { useState } from 'react';
import Link from 'next/link';

export const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'],
  ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'],
  ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'],
  ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'],
  ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'],
  ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

const label = { display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: 6 };
const input = { width: '100%', minHeight: 44, padding: '10px 12px', fontSize: '1rem', color: 'var(--text-light)', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 10 };
const check = { display: 'flex', gap: 10, alignItems: 'flex-start', minHeight: 40, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 };

export default function GoldenTicketEntryForm({ open, closedText, idPrefix = 'gt' }) {
  const [f, setF] = useState({ name: '', email: '', state: '', age21: false, us_resident: false, website: '' });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/christmas/enter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const data = await res.json().catch(() => null);
      setResult(data && data.message ? data : { ok: false, status: 'error', message: 'Your entry was not stored. Please try again, or email support@ironwithin.io.' });
    } catch {
      setResult({ ok: false, status: 'error', message: 'Your entry was not stored because we could not reach the server. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  if (!open) return <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{closedText}</p>;
  const good = result && (result.status === 'entered' || result.status === 'already_entered');
  const id = (k) => `${idPrefix}-${k}`;

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
      <div>
        <label htmlFor={id('name')} style={label}>Full name</label>
        <input id={id('name')} name="name" autoComplete="name" required minLength={2} maxLength={120} value={f.name} onChange={set('name')} style={input} />
      </div>
      <div>
        <label htmlFor={id('email')} style={label}>Email</label>
        <input id={id('email')} name="email" type="email" autoComplete="email" required maxLength={190} value={f.email} onChange={set('email')} style={input} />
      </div>
      <div>
        <label htmlFor={id('state')} style={label}>State</label>
        <select id={id('state')} name="state" required value={f.state} onChange={set('state')} style={input}>
          <option value="">Choose your state</option>
          {US_STATES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
        </select>
      </div>
      {/* Honeypot: hidden from people and screen readers; bots fill it. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={id('website')}>Website</label>
        <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>
      <label htmlFor={id('age')} style={check}>
        <input id={id('age')} type="checkbox" required checked={f.age21} onChange={set('age21')} style={{ width: 22, height: 22, flex: 'none', marginTop: 1, accentColor: 'var(--primary-blue)' }} />
        I am 21 or older.
      </label>
      <label htmlFor={id('us')} style={check}>
        <input id={id('us')} type="checkbox" required checked={f.us_resident} onChange={set('us_resident')} style={{ width: 22, height: 22, flex: 'none', marginTop: 1, accentColor: 'var(--primary-blue)' }} />
        <span>I am a legal resident of one of the 50 United States or the District of Columbia, and I have read the <Link href="/golden-ticket/rules" style={{ color: 'var(--primary-blue)' }}>Official Rules</Link>.</span>
      </label>
      <button type="submit" disabled={busy} style={{ minHeight: 48, padding: '12px 18px', borderRadius: 10, border: 'none', cursor: busy ? 'wait' : 'pointer', background: 'var(--gradient-primary)', color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-body)' }}>
        {busy ? 'Sending...' : "Enter today's drawing free"}
      </button>
      <div role="status" aria-live="polite" style={{ minHeight: 1 }}>
        {result && (
          <p style={{ margin: 0, padding: '12px 14px', borderRadius: 10, fontSize: '0.92rem', lineHeight: 1.55, background: good ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)', border: `1px solid ${good ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.45)'}`, color: good ? '#a7f3d0' : '#fecaca' }}>
            {result.message}
          </p>
        )}
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
        No sign-in or purchase needed. One free entry per person per day. We use what you enter only to run this promotion; it is not added to any marketing list.
      </p>
    </form>
  );
}

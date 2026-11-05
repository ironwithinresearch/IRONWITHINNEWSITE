'use client';
// src/components/app/AppRestockButton.jsx
// App-mode replacement for the product page's email "notify me" form. One tap: turns on
// push for this device when it can (the permission prompt must come straight from the
// tap, so it runs BEFORE any network call), then saves the watch on the customer's
// account. Without push the backend emails the account address instead.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2 } from 'lucide-react';
import { api, pushState, enablePush, pushSupported } from '@/lib/push';

export default function AppRestockButton({ targetId }) {
  const [state, setState] = useState('idle');   // idle | busy | done | error
  const [pushOn, setPushOn] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { setState('idle'); setErr(''); }, [targetId]);

  const go = async () => {
    if (state === 'busy') return;
    setState('busy'); setErr('');
    let on = (await pushState()) === 'on';
    if (!on && pushSupported() && Notification.permission === 'default') {
      on = (await enablePush()).ok;
    }
    const r = await api('watch', { id: targetId });
    if (!r.ok) { setErr(r.data.error || 'Could not save that — please try again.'); setState('error'); return; }
    setPushOn(on);
    setState('done');
  };

  const box = { marginTop: '12px', padding: '14px 16px', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: '12px' };
  const text = { fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 };

  if (state === 'done') {
    return (
      <div style={{ ...box, display: 'flex', gap: 10, alignItems: 'flex-start' }} role="status">
        <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
        <div style={text}>
          <strong style={{ color: '#059669' }}>You&rsquo;re on the list.</strong>{' '}
          {pushOn
            ? 'We will send a notification to this device when it is back.'
            : <>We will email your account address when it is back. To get it as a notification instead, turn them on in <Link href="/alerts" style={{ color: 'var(--primary-blue)' }}>Alerts</Link>.</>}
        </div>
      </div>
    );
  }
  return (
    <div style={box}>
      <div style={{ ...text, marginBottom: 10 }}>
        <strong style={{ color: '#059669' }}>Sold out.</strong> Get an alert when it is back in stock.
      </div>
      <button type="button" className="iwa-btn" style={{ width: '100%', background: '#34d399', color: '#04201a' }} onClick={go} disabled={state === 'busy'}>
        <Bell size={17} aria-hidden="true" /> {state === 'busy' ? 'Saving…' : 'Notify me when it’s back'}
      </button>
      {err && <div className="iwa-err" role="alert">{err}</div>}
    </div>
  );
}

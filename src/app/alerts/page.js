'use client';
// src/app/alerts/page.js — the app's Alerts tab (app.ironwithin.io; www redirects to /shop).
// Turn back-in-stock notifications on/off for this device, send a test, and manage the
// list of sold-out items the customer is watching (app watches + website email alerts).

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, BellOff, Trash2, Smartphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, pushState, enablePush, disablePush, isIOS } from '@/lib/push';
import { isStandalone, RUO_LINE } from '@/lib/appMode';

export default function AlertsPage() {
  const { isLoggedIn, mounted } = useAuth();
  const [state, setState] = useState('loading');   // loading | unsupported | denied | on | off
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [watches, setWatches] = useState(null);
  const [listErr, setListErr] = useState('');
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(true);

  const load = useCallback(async () => {
    setListErr('');
    const r = await api('watches');
    if (r.ok) setWatches(r.data.watches || []);
    else { setWatches([]); setListErr(r.data.error || 'Could not load your alerts.'); }
  }, []);

  useEffect(() => {
    setIos(isIOS());
    setInstalled(isStandalone());
    pushState().then(setState);
  }, []);
  useEffect(() => { if (mounted && isLoggedIn) load(); }, [mounted, isLoggedIn, load]);

  const turnOn = async () => {
    setBusy(true); setMsg({ type: '', text: '' });
    const r = await enablePush();
    setBusy(false);
    setState(await pushState());
    setMsg(r.ok ? { type: 'ok', text: 'Notifications are on for this device.' } : { type: 'err', text: r.error });
  };
  const turnOff = async () => {
    setBusy(true); setMsg({ type: '', text: '' });
    const r = await disablePush();
    setBusy(false);
    setState(await pushState());
    setMsg(r.ok ? { type: 'ok', text: 'Notifications are off for this device. We will email your alerts instead.' } : { type: 'err', text: r.error });
  };
  const test = async () => {
    setBusy(true); setMsg({ type: '', text: '' });
    const r = await api('test-self', {});
    setBusy(false);
    setMsg(r.ok && r.data.ok
      ? { type: 'ok', text: 'Test sent. It should appear in a few seconds.' }
      : { type: 'err', text: r.data.error || 'The test did not reach this device. Try turning notifications off and on again.' });
  };
  const remove = async (id) => {
    const r = await api('unwatch', { id });
    if (r.ok) setWatches((w) => (w || []).filter((x) => x.id !== id));
    else setListErr(r.data.error || 'Could not remove that alert.');
  };
  const installHelp = () => window.dispatchEvent(new Event('iwa:install-help'));

  const needsInstall = ios && !installed;

  return (
    <div className="iwa-page">
      <h1>Back-in-stock alerts</h1>
      <p className="lead">When something you want is sold out, tap <strong>Notify me when it&rsquo;s back</strong> on its page. We will send you an alert when it is back in stock.</p>

      <section className="iwa-card" aria-labelledby="alerts-device">
        <h2 id="alerts-device">Notifications on this device</h2>
        {needsInstall ? (
          <>
            <p>On iPhone, notifications work once the app is on your Home Screen (iOS 16.4 or later). Until then we will email your alerts.</p>
            <button type="button" className="iwa-btn" onClick={installHelp}><Smartphone size={18} aria-hidden="true" /> How to add it to your Home Screen</button>
          </>
        ) : state === 'loading' ? (
          <p>Checking…</p>
        ) : state === 'unsupported' ? (
          <p>This browser cannot receive notifications. We will email your alerts to your account email instead.</p>
        ) : state === 'denied' ? (
          <p>Notifications are blocked for this app. To turn them on, allow notifications for Iron Within Research in your phone or browser settings, then come back here. Until then we will email your alerts.</p>
        ) : (
          <>
            <div className="iwa-switch">
              <span style={{ color: 'var(--text-light)', fontWeight: 700, fontSize: '0.92rem' }}>
                {state === 'on' ? 'On — alerts come to this device' : 'Off — alerts come by email'}
              </span>
              {state === 'on' ? (
                <button type="button" className="iwa-btn ghost" onClick={turnOff} disabled={busy}><BellOff size={17} aria-hidden="true" /> Turn off</button>
              ) : (
                <button type="button" className="iwa-btn" onClick={turnOn} disabled={busy}><Bell size={17} aria-hidden="true" /> Turn on</button>
              )}
            </div>
            {state === 'on' && (
              <button type="button" className="iwa-btn ghost" style={{ marginTop: 8 }} onClick={test} disabled={busy}>Send me a test notification</button>
            )}
          </>
        )}
        {!installed && !ios && (
          <p style={{ marginTop: 12, marginBottom: 0 }}>
            <button type="button" className="iwa-btn ghost" onClick={installHelp}><Smartphone size={17} aria-hidden="true" /> Install the app</button>
          </p>
        )}
        {msg.text && <p className={msg.type === 'ok' ? 'iwa-ok' : 'iwa-err'} role="status">{msg.text}</p>}
      </section>

      <section className="iwa-card" aria-labelledby="alerts-list">
        <h2 id="alerts-list">You are watching</h2>
        {watches === null ? (
          <p>Loading…</p>
        ) : watches.length === 0 ? (
          <p>Nothing yet. Open any sold-out product and tap <strong>Notify me when it&rsquo;s back</strong>.</p>
        ) : (
          watches.map((w) => (
            <div className="iwa-row" key={w.id}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/product/${w.slug}`}>{w.name}{w.size ? ` — ${w.size}` : ''}</Link>
                <div className="iwa-meta">
                  {w.inStock ? 'Back in stock now' : 'Sold out — we will let you know'}
                  {w.via === 'email' ? ' · email alert' : ''}
                </div>
              </div>
              {w.inStock ? (
                <Link href={`/product/${w.slug}`} className="iwa-btn" style={{ minHeight: 40, fontSize: '0.82rem' }}>View</Link>
              ) : (
                <button type="button" className="iwa-x" onClick={() => remove(w.id)} aria-label={`Stop watching ${w.name}${w.size ? ` ${w.size}` : ''}`}>
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          ))
        )}
        {listErr && <p className="iwa-err" role="status">{listErr}</p>}
      </section>

      <p className="iwa-note">{RUO_LINE}</p>
    </div>
  );
}

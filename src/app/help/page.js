'use client';
// src/app/help/page.js — the app's Help tab (app.ironwithin.io; www redirects to /contact).
//
// Support chat = self-hosted Chatwoot (support.ironwithin.io, inbox "Iron Within App").
// The widget loads only on this page. When the customer is signed in, they are identified
// with setUser + an identifier_hash computed server-side (/api/chatwoot/identity), so the
// team sees who they are talking to and the chat history follows the account.

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Package, AlertTriangle, HelpCircle, Truck, RotateCcw, FlaskConical, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getToken } from '@/lib/auth';
import { RUO_LINE } from '@/lib/appMode';

const CW_URL = process.env.NEXT_PUBLIC_CHATWOOT_URL || 'https://support.ironwithin.io';
const CW_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || '';

const LINKS = [
  { href: '/orders', label: 'Track an order', Icon: Package },
  { href: '/claims', label: 'Report a problem with an order', Icon: AlertTriangle },
  { href: '/faq', label: 'Frequently asked questions', Icon: HelpCircle },
  { href: '/shipping', label: 'Shipping information', Icon: Truck },
  { href: '/refund', label: 'Refund & store credit policy', Icon: RotateCcw },
  { href: '/lab-reports', label: 'Lab reports and COAs', Icon: FlaskConical },
];

async function identify() {
  const t = getToken();
  if (!t || !window.$chatwoot) return;
  try {
    const res = await fetch('/api/chatwoot/identity', { headers: { Authorization: `Bearer ${t}` }, cache: 'no-store' });
    if (!res.ok) return;
    const id = await res.json();
    window.$chatwoot.setUser(id.identifier, { email: id.email, name: id.name, identifier_hash: id.identifier_hash });
    window.$chatwoot.setCustomAttributes({ customer_id: id.customerId, source: 'app' });
  } catch { /* chat still works unidentified */ }
}

export default function HelpPage() {
  const { isLoggedIn } = useAuth();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!CW_TOKEN) { setFailed(true); return undefined; }
    const onReady = () => { setReady(true); identify(); };
    window.addEventListener('chatwoot:ready', onReady);
    if (window.$chatwoot && window.chatwootSDK) {
      onReady();
    } else if (!document.getElementById('iw-chatwoot-sdk')) {
      window.chatwootSettings = { hideMessageBubble: true, position: 'right', locale: 'en', type: 'standard' };
      const s = document.createElement('script');
      s.id = 'iw-chatwoot-sdk';
      s.src = `${CW_URL}/packs/js/sdk.js`;
      s.async = true;
      s.onload = () => { try { window.chatwootSDK.run({ websiteToken: CW_TOKEN, baseUrl: CW_URL }); } catch { setFailed(true); } };
      s.onerror = () => setFailed(true);
      document.body.appendChild(s);
    }
    const t = setTimeout(() => { if (!window.$chatwoot) setFailed(true); }, 15000);
    return () => {
      clearTimeout(t);
      window.removeEventListener('chatwoot:ready', onReady);
      try { window.$chatwoot?.toggle('close'); } catch {}
    };
  }, []);

  // Signed in after the widget loaded → identify now.
  useEffect(() => { if (ready && isLoggedIn) identify(); }, [ready, isLoggedIn]);

  const openChat = useCallback(() => {
    try { window.$chatwoot.toggle('open'); } catch { setFailed(true); }
  }, []);

  return (
    <div className="iwa-page">
      <h1>Help &amp; support</h1>
      <p className="lead">Questions about an order, shipping, a COA or your account? Message the team and we will reply here in the app.</p>

      <section className="iwa-card" aria-labelledby="help-chat">
        <h2 id="help-chat">Message us</h2>
        <p>We reply as soon as we can. You can close the chat and come back to it later.</p>
        <button type="button" className="iwa-btn" style={{ width: '100%' }} onClick={openChat} disabled={!ready}>
          <MessageCircle size={18} aria-hidden="true" /> {ready ? 'Start a conversation' : failed ? 'Chat unavailable' : 'Loading chat…'}
        </button>
        {failed && (
          <p className="iwa-err" role="status">
            The chat could not load right now. Email <a href="mailto:support@ironwithin.io">support@ironwithin.io</a> and we will reply by email.
          </p>
        )}
      </section>

      <section className="iwa-card" aria-labelledby="help-links">
        <h2 id="help-links">Quick help</h2>
        {LINKS.map(({ href, label, Icon }) => (
          <div className="iwa-row" key={href}>
            <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 40, flex: 1 }}>
              <Icon size={18} aria-hidden="true" color="var(--primary-blue)" /> {label}
            </Link>
          </div>
        ))}
      </section>

      <section className="iwa-card" aria-labelledby="help-contact">
        <h2 id="help-contact">Other ways to reach us</h2>
        <div className="iwa-row">
          <a href="mailto:support@ironwithin.io" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 40 }}><Mail size={18} aria-hidden="true" /> support@ironwithin.io</a>
        </div>
        <div className="iwa-row">
          <a href="tel:+18505053780" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 40 }}><Phone size={18} aria-hidden="true" /> (850) 505-3780</a>
        </div>
      </section>

      <p className="iwa-note">{RUO_LINE}</p>
    </div>
  );
}

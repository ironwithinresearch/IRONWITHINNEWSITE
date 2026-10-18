'use client';
// src/components/AccountStatusNotice.jsx
//
// Tells a signed-in customer, in plain words, where their researcher account stands:
// email not confirmed yet (with a re-send button), waiting for approval, or — once —
// "you're approved". Renders nothing for approved accounts. Status comes from
// AuthContext (backend iw-research-access.php); the backend is what actually refuses
// orders, this only keeps people from discovering it at the last step.
//
// showVerifyResult: read ?verified=… from the URL (the confirmation link lands on
// /account?verified=1|already|invalid|expired) and say what happened.

import { useEffect, useState } from 'react';
import { MailWarning, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getToken } from '../lib/auth';

const VERIFY_MESSAGES = {
  // Confirming runs the automated screening: most accounts are approved on the spot, the
  // rest are flagged for a person to review (the pending box below then explains).
  '1': { tone: 'ok', title: 'Email confirmed', body: 'Thanks — your email is confirmed and your account has been reviewed. If it needs a closer look you will see a note below; otherwise you are ready to order.' },
  already: { tone: 'ok', title: 'Email already confirmed', body: 'Your email address was already confirmed.' },
  invalid: { tone: 'error', title: 'That confirmation link is not valid', body: 'It may have been replaced by a newer email. Use the button below to get a fresh link.' },
  expired: { tone: 'error', title: 'That confirmation link has expired', body: 'Links last 7 days. Use the button below to get a fresh one.' },
};

export default function AccountStatusNotice({ showVerifyResult = false, style }) {
  const { isLoggedIn, accountStatus, refreshAccountStatus } = useAuth();
  const [verify, setVerify] = useState(null);
  const [resend, setResend] = useState(''); // '' | 'sending' | 'sent' | error text

  useEffect(() => {
    if (!showVerifyResult) return;
    const v = new URLSearchParams(window.location.search).get('verified');
    if (v && VERIFY_MESSAGES[v]) {
      setVerify(VERIFY_MESSAGES[v]);
      refreshAccountStatus?.();
    }
  }, [showVerifyResult, refreshAccountStatus]);

  if (!isLoggedIn) return null;

  const s = accountStatus;
  const pendingEmail = s && s.status === 'pending_email';
  const pendingApproval = s && s.status === 'pending_approval';

  const sendAgain = async () => {
    setResend('sending');
    try {
      const res = await fetch('/api/account-status', { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json().catch(() => ({}));
      setResend(res.ok && data.success ? 'sent' : data.error || 'We could not send the email. Please try again in a minute.');
    } catch {
      setResend('We could not send the email. Please try again in a minute.');
    }
  };

  const blocks = [];
  if (verify) blocks.push(<Box key="v" tone={verify.tone} Icon={verify.tone === 'ok' ? CheckCircle2 : AlertCircle} title={verify.title} body={verify.body} />);
  if (pendingEmail) {
    blocks.push(
      <Box key="e" tone="warn" Icon={MailWarning} title="Your account is pending approval — please confirm your email"
        body={<>
          We emailed you a confirmation link when you signed up. Once you click it, our team reviews your account
          (usually within one business day) and you can place orders as soon as it is approved.
          <span style={{ display: 'block', marginTop: 10 }}>
            <button type="button" onClick={sendAgain} disabled={resend === 'sending' || resend === 'sent'} style={btn}>
              {resend === 'sending' ? 'Sending…' : resend === 'sent' ? 'Sent — check your inbox' : 'Email me a new link'}
            </button>
            {resend && resend !== 'sending' && resend !== 'sent' && <span style={{ display: 'block', marginTop: 6, color: '#dc2626' }}>{resend}</span>}
          </span>
        </>} />,
    );
  }
  if (pendingApproval) {
    blocks.push(
      <Box key="a" tone="warn" Icon={Clock} title="Your account is pending approval"
        body="Your email is confirmed. Our team reviews every new researcher account before the first order — we will email you as soon as yours is approved. You can keep browsing in the meantime." />,
    );
  }
  if (!blocks.length) return null;
  return <div style={style}>{blocks}</div>;
}

function Box({ tone, Icon, title, body }) {
  const c = tone === 'ok' ? { b: 'rgba(52,211,153,0.4)', bg: 'rgba(52,211,153,0.08)', i: '#059669' }
    : tone === 'error' ? { b: 'rgba(248,113,113,0.4)', bg: 'rgba(248,113,113,0.08)', i: '#dc2626' }
      : { b: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.08)', i: '#d97706' };
  return (
    <div role="status" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '14px 16px', borderRadius: 12, marginBottom: 12, border: `1px solid ${c.b}`, background: c.bg, textAlign: 'left' }}>
      <Icon size={18} color={c.i} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        <strong style={{ display: 'block', color: 'var(--text-light)', marginBottom: 2 }}>{title}</strong>
        {body}
      </div>
    </div>
  );
}

const btn = {
  minHeight: 40, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--glass-border)',
  background: 'var(--card-dark)', color: 'var(--text-light)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
};

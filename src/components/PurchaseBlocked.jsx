'use client';
// Full-page stop shown on /cart and /checkout to anyone who cannot buy yet: logged-out
// visitors and accounts that are still pending (email not confirmed / not approved).
// The processor's compliance review requires that unapproved accounts never reach the
// cart or checkout, so these pages render nothing else for them. The backend enforces
// the same rule on order creation (iw-research-access.php).
//
// The three research-use confirmations are shown (unticked, disabled) so the visitor
// knows what they will be asked to confirm on their first order.

import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';

export const RUO_CHECKOUT_ACKS = [
  ['age_21', 'I am 21 years of age or older.'],
  ['research_org', 'I represent a legitimate research organization and will use these products for lawful laboratory research only.'],
  ['not_human_use', 'I understand these products are not for human or veterinary use, diagnosis, treatment or consumption.'],
];

export default function PurchaseBlocked({ loggedIn, message, redirect = '/checkout' }) {
  const title = loggedIn ? 'Your account is pending approval' : 'Account required to check out';
  const body = loggedIn
    ? (message || 'Your cart and checkout open once your email is confirmed and your account is approved. Check your inbox for the confirmation link from Iron Within.')
    : 'Iron Within sells research compounds only to approved 21+ researcher accounts. Create your account or sign in to continue.';

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ maxWidth: 480, width: '100%', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '36px 24px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '14px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Lock size={24} color="var(--primary-blue)" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-light)', margin: '0 0 10px', textAlign: 'center' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 22px', textAlign: 'center' }}>{body}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 22 }}>
          {loggedIn ? (
            <Link href="/account" style={btnPrimary}>Check account status <ArrowRight size={16} /></Link>
          ) : (
            <>
              <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} style={btnPrimary}>Create your account <ArrowRight size={16} /></Link>
              <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} style={btnGhost}>I already have an account — Sign in</Link>
            </>
          )}
        </div>

        <fieldset disabled style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px 14px 4px', margin: 0 }}>
          <legend style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-light)', padding: '0 6px' }}>Required at checkout</legend>
          {RUO_CHECKOUT_ACKS.map(([k, text]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              <input type="checkbox" required disabled checked={false} readOnly name={`ruo_${k}`}
                style={{ width: 18, height: 18, marginTop: '1px', flexShrink: 0 }} />
              <span>{text}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </div>
  );
}

const btnPrimary = { padding: '14px', background: 'var(--gradient-primary)', borderRadius: '12px', color: '#fff', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const btnGhost = { padding: '13px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-light)', fontWeight: 600, textDecoration: 'none', textAlign: 'center' };

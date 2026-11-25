'use client';
// Peptide Paradigm Pro — app unlock codes sold on this store (25 Nov 2026).
//
// The backend (mu-plugin iw-pp-pro.php) mints the codes when an order is PAID and exposes
// them as Order.proCodes / Order.proPending. Kept OUT of GET_ORDERS on purpose, same as the
// hold-ship fields: if the plugin is ever missing, an unknown field fails the WHOLE query and
// would blank every customer's order history. Run separately with errorPolicy 'all'.
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { KeyRound, Copy, Check } from 'lucide-react';

export const PRO_SLUG_PREFIX = 'peptide-paradigm-pro';
export const PRO_APP_URL = 'https://app.peptideparadigm.app';

export const isProSlug = (slug) => typeof slug === 'string' && slug.startsWith(PRO_SLUG_PREFIX);
const itemSlug = (i) => i?.product?.node?.slug;
export const cartHasPro = (items) => (items || []).some((i) => isProSlug(itemSlug(i)));
/** Every line is an app code: nothing ships, so no shipping, Route or ship-pause copy. */
export const cartIsProOnly = (items) => (items || []).length > 0 && (items || []).every((i) => isProSlug(itemSlug(i)));

export const GET_ORDER_PRO_CODES = gql`
  query GetOrderProCodes {
    customer {
      orders(first: 100) {
        nodes {
          databaseId
          orderNumber
          proPending
          proCodes { code plan }
        }
      }
    }
  }
`;

/** Map databaseId -> { orderNumber, proPending, proCodes } for the signed-in customer. */
export function useProCodes(isLoggedIn, { pollUntilOrder = '' } = {}) {
  const { data, startPolling, stopPolling } = useQuery(GET_ORDER_PRO_CODES, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });
  const map = new Map();
  for (const n of data?.customer?.orders?.nodes || []) {
    if (n?.databaseId) map.set(n.databaseId, { orderNumber: String(n.orderNumber || ''), proPending: !!n.proPending, proCodes: n.proCodes || [] });
  }
  // Thank-you page: payment webhooks can land a few seconds after the buyer does, and the
  // codes are minted right after. Poll every 5s for up to 2 minutes while that order is pending.
  const target = pollUntilOrder ? [...map.values()].find((v) => v.orderNumber === String(pollUntilOrder)) : null;
  const waiting = !!pollUntilOrder && (!target || (target.proPending && !target.proCodes.length));
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (!isLoggedIn || !pollUntilOrder || !waiting || expired) { stopPolling?.(); return undefined; }
    startPolling?.(5000);
    const t = setTimeout(() => setExpired(true), 120000);
    return () => { clearTimeout(t); stopPolling?.(); };
  }, [isLoggedIn, pollUntilOrder, waiting, expired, startPolling, stopPolling]);
  return map;
}

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button"
      onClick={() => { try { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); } catch { /* no clipboard */ } }}
      aria-label={`Copy code ${text}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 40, minWidth: 40, padding: '0 12px',
               background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 9, color: 'var(--text-light)', fontSize: '0.8rem', cursor: 'pointer' }}>
      {done ? <Check size={15} color="#34d399" /> : <Copy size={15} />} {done ? 'Copied' : 'Copy'}
    </button>
  );
}

/**
 * The codes on one order, with redeem steps. Renders nothing for an order without Pro lines.
 * `pending` = paid-for codes not issued yet (or the order is not paid yet).
 */
export function ProCodesPanel({ info, compact = false }) {
  if (!info || (!info.proPending && !(info.proCodes || []).length)) return null;
  const codes = info.proCodes || [];
  return (
    <div style={{ textAlign: 'left', background: 'var(--bg-dark)', border: '1px solid rgba(168,85,247,0.45)', borderRadius: 14,
                  padding: compact ? '14px 16px' : '18px 20px', margin: compact ? '12px 0 0' : '0 0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: 'var(--text-light)', fontSize: '0.98rem', marginBottom: 8 }}>
        <KeyRound size={17} color="#c084fc" /> Peptide Paradigm Pro {codes.length > 1 ? 'codes' : 'code'}
      </div>
      {codes.length ? (
        <>
          {codes.map((c) => (
            <div key={c.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap',
                                       padding: '10px 12px', marginBottom: 8, background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 10 }}>
              <span>
                <span style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-light)' }}>{c.code}</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.plan === 'lifetime' ? 'Lifetime' : '1 Year'}</span>
              </span>
              <CopyButton text={c.code} />
            </div>
          ))}
          <ol style={{ margin: '8px 0 0', paddingLeft: 20, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            <li>Go to <a href={PRO_APP_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>app.peptideparadigm.app</a></li>
            <li>Sign in with any email (the one on this order is easiest)</li>
            <li>Open Settings &rsaquo; Redeem a code, and paste your code</li>
          </ol>
          {!compact && (
            <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              1 Year runs from the day you redeem, and a second 1-Year code adds another year. Lifetime never expires. We&rsquo;ve emailed your code too.
            </p>
          )}
        </>
      ) : (
        <p role="status" style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          Your unlock code is issued as soon as payment is confirmed. It will appear here and arrive by email.
        </p>
      )}
    </div>
  );
}

/** Thank-you pages: show this order's codes (polls briefly while payment/minting lands). */
export function OrderProCodes({ orderNumber, isLoggedIn }) {
  const map = useProCodes(isLoggedIn, { pollUntilOrder: orderNumber });
  if (!orderNumber) return null;
  const info = [...map.values()].find((v) => v.orderNumber === String(orderNumber));
  return info ? <ProCodesPanel info={info} /> : null;
}

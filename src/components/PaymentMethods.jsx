'use client';
// src/components/PaymentMethods.jsx
// "We Accept" payment logos for the cart, checkout, and footer.
// Card networks (visa/mastercard/amex/discover) are live today via the rail.
// The P2P marks (cashapp/venmo/zelle) are included but only shown once those
// payment options are actually wired (pass methods to control which appear).

const chip = {
  width: 42,
  height: 27,
  borderRadius: 5,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.10)',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontWeight: 800,
  flexShrink: 0,
  overflow: 'hidden',
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
};

const LOGOS = {
  visa: () => (
    <span key="visa" style={{ ...chip, color: '#1434CB', fontStyle: 'italic', fontSize: 12, letterSpacing: '0.02em' }} aria-label="Visa">
      VISA
    </span>
  ),
  mastercard: () => (
    <span key="mastercard" style={chip} aria-label="Mastercard">
      <svg width="34" height="21" viewBox="0 0 34 21" role="img">
        <circle cx="13" cy="10.5" r="8.5" fill="#EB001B" />
        <circle cx="21" cy="10.5" r="8.5" fill="#F79E1B" />
        <path d="M17 4.2a8.5 8.5 0 0 1 0 12.6 8.5 8.5 0 0 1 0-12.6z" fill="#FF5F00" />
      </svg>
    </span>
  ),
  amex: () => (
    <span key="amex" style={{ ...chip, background: '#1F72CD', color: '#fff', fontSize: 8.5, letterSpacing: '0.04em' }} aria-label="American Express">
      AMEX
    </span>
  ),
  discover: () => (
    <span key="discover" style={{ ...chip, color: '#1a1a1a', fontSize: 7, letterSpacing: 0 }} aria-label="Discover">
      DISC
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF6000', marginLeft: 1.5 }} />
    </span>
  ),
  cashapp: () => (
    <span key="cashapp" style={{ ...chip, background: '#00D632', color: '#fff', fontSize: 15 }} aria-label="Cash App">
      $
    </span>
  ),
  venmo: () => (
    <span key="venmo" style={{ ...chip, color: '#008CFF', fontSize: 10, fontStyle: 'italic', letterSpacing: '-0.01em' }} aria-label="Venmo">
      venmo
    </span>
  ),
  zelle: () => (
    <span key="zelle" style={{ ...chip, background: '#6D1ED4', color: '#fff', fontSize: 10, letterSpacing: '-0.01em' }} aria-label="Zelle">
      zelle
    </span>
  ),
};

const CARD_NETWORKS = ['visa', 'mastercard', 'amex', 'discover'];
const ALL_METHODS = ['visa', 'mastercard', 'amex', 'discover', 'cashapp', 'venmo', 'zelle'];

// TEMP: Mastercard hidden sitewide until ChargeX enables it on the merchant account.
// The Mastercard logo is defined above and just filtered out at render — flip this back
// to true (one line) to restore it everywhere the moment MC is live again.
const MC_ENABLED = false;

export default function PaymentMethods({
  label = 'We Accept',
  methods = ALL_METHODS,
  align = 'flex-start',
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: align }}>
      {label ? (
        <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {label}
        </span>
      ) : null}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', justifyContent: align }}>
        {methods
          .filter((m) => MC_ENABLED || m !== 'mastercard')
          .map((m) => (LOGOS[m] ? LOGOS[m]() : null))}
      </div>
    </div>
  );
}

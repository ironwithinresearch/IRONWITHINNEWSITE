// src/app/ruo-policy/page.js
// Research Use Only (RUO) Policy. Public — listed in src/lib/gate.js so it is reachable
// without an account or the 21+ cookie, and linked from the footer and the age gate.
// Server component: the whole policy is in the HTML (no client JS needed to read it).

import Link from 'next/link';

export const metadata = {
  title: 'Research Use Only Policy',
  description:
    'Iron Within Research sells research compounds strictly for lawful laboratory research by qualified researchers aged 21 and over. Not for human or veterinary use.',
  alternates: { canonical: '/ruo-policy' },
  robots: { index: true, follow: true },
};

const UPDATED = 'October 18, 2026';

const sections = [
  {
    title: '1. Research use only',
    body: [
      'Every product sold by Iron Within Research is supplied strictly for in-vitro laboratory research and scientific investigation. Products are not drugs, foods, dietary supplements, cosmetics or medical devices, and have not been evaluated or approved by the U.S. Food and Drug Administration for any use.',
      'Products are not for human or veterinary use, diagnosis, treatment, cure, prevention of any disease, or consumption of any kind. They must not be administered to people or animals.',
    ],
  },
  {
    title: '2. Who may buy',
    body: [
      'Purchasers must be at least 21 years of age and must represent a legitimate research organization or be a qualified researcher who will use the products for lawful laboratory research only.',
      'Every new account is reviewed before its first order. We ask for the purchaser’s legal name, a working email address (confirmed by a link we send), phone number, address and research purpose; organization details and credentials are welcome and help the review. We may ask for further information, and we may decline or close any account at our discretion.',
    ],
  },
  {
    title: '3. Acknowledgements we record',
    body: [
      'When creating an account, and again at every checkout, the purchaser confirms that they are 21 or older, that they represent a legitimate research organization and will use the products for lawful laboratory research only, and that they understand the products are not for human or veterinary use, diagnosis, treatment or consumption. We keep a record of each confirmation, its exact wording and the time it was given.',
    ],
  },
  {
    title: '4. Information on this website',
    body: [
      'Product descriptions, specifications and Certificates of Analysis describe the material supplied — identity, quantity, purity and testing. Nothing on this website is medical advice, and we do not provide dosing, administration or usage guidance for people or animals. Our staff and affiliates will not answer such questions.',
    ],
  },
  {
    title: '5. Handling and compliance',
    body: [
      'Purchasers are responsible for handling, storing and disposing of products safely in a suitable laboratory setting by trained personnel, and for complying with all laws and regulations that apply to them, including any local restrictions on the purchase or possession of research compounds.',
    ],
  },
  {
    title: '6. Refusal and cancellation',
    body: [
      'We will refuse or cancel any order, and may close the account, where we believe a product is intended for human or veterinary use, where the purchaser appears to be under 21, or where the information provided cannot be verified. Misuse of any product voids all warranties and is the sole responsibility of the purchaser.',
    ],
  },
  {
    title: '7. Contact',
    body: [
      'Questions about this policy: support@ironwithin.io.',
    ],
  },
];

export default function RuoPolicyPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page-header">
        <div className="container">
          <p style={{ color: 'var(--primary-blue)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Legal information
          </p>
          <h1>Research Use Only <span className="gradient-text">Policy</span></h1>
          <p>Last updated {UPDATED}</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(20px, 5vw, 40px)' }}>
            {sections.map((s, i) => (
              <div key={s.title} style={{ paddingBottom: 24, marginBottom: 24, borderBottom: i !== sections.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                <h2 style={{ fontSize: '1.2rem', margin: '0 0 10px', color: 'var(--text-light)' }}>{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 24)} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, margin: '0 0 10px' }}>{p}</p>
                ))}
              </div>
            ))}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
              See also our <Link href="/terms" style={{ color: 'var(--primary-blue)' }}>Terms &amp; Conditions</Link>,{' '}
              <Link href="/disclaimer" style={{ color: 'var(--primary-blue)' }}>Disclaimer</Link> and{' '}
              <Link href="/privacy" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { FileText, ShieldCheck, AlertTriangle, Scale, FlaskConical } from 'lucide-react';

const sections = [
  {
    title: 'Acceptance of Terms',
    content:
      'By accessing and using the Darryl Peptides website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should discontinue use of the website immediately.',
  },
  {
    title: 'Research Use Only',
    content:
      'All products sold by Darryl Peptides are intended solely for laboratory and research purposes. Products are not intended for human consumption, medical use, veterinary use, diagnosis, treatment, or prevention of any disease.',
  },
  {
    title: 'Eligibility',
    content:
      'You must be at least 18 years old and legally capable of entering into binding agreements to use this website or purchase products.',
  },
  {
    title: 'Account Responsibilities',
    content:
      'Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.',
  },
  {
    title: 'Product Information',
    content:
      'We strive to ensure that all product descriptions and information are accurate. However, we do not warrant that product descriptions, pricing, or other content is error-free.',
  },
  {
    title: 'Orders & Payments',
    content:
      'All orders are subject to acceptance and availability. Payment must be received in full before products are shipped.',
  },
  {
    title: 'Shipping',
    content:
      'Shipping times are estimates only and may vary based on location, customs processing, and carrier delays.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'Darryl Peptides shall not be liable for any indirect, incidental, consequential, or special damages arising from the use of our products or website.',
  },
  {
    title: 'Intellectual Property',
    content:
      'All content on this website, including logos, graphics, text, and designs, is the property of Darryl Peptides and may not be reproduced without permission.',
  },
  {
    title: 'Changes to Terms',
    content:
      'We reserve the right to modify these Terms & Conditions at any time. Continued use of the website constitutes acceptance of revised terms.',
  },
];

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page-header">
        <div className="container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--primary-blue)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <Scale size={14} />
            Legal Information
          </div>

          <h1>
            Terms &{' '}
            <span className="gradient-text">
              Conditions
            </span>
          </h1>

          <p>
            Please review these terms carefully before using our website or
            purchasing products.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px',
            }}
          >
            {sections.map((section, index) => (
              <div
                key={section.title}
                style={{
                  paddingBottom: '28px',
                  marginBottom: '28px',
                  borderBottom:
                    index !== sections.length - 1
                      ? '1px solid var(--glass-border)'
                      : 'none',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.3rem',
                    marginBottom: '12px',
                    color: 'var(--text-light)',
                  }}
                >
                  {section.title}
                </h2>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                  }}
                >
                  {section.content}
                </p>
              </div>
            ))}

            <div
              style={{
                marginTop: '30px',
                padding: '20px',
                background: 'rgba(0,207,255,0.08)',
                border: '1px solid rgba(0,207,255,0.2)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                gap: '12px',
              }}
            >
              <ShieldCheck
                size={20}
                color="var(--primary-blue)"
                style={{ flexShrink: 0 }}
              />
              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                By using this website, you acknowledge that all products are
                sold strictly for research purposes only and agree to comply
                with all applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
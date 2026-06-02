'use client';

import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  Cookie,
  Mail,
} from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content:
      'We may collect personal information including your name, email address, billing information, shipping address, phone number, and account details when you interact with our website.',
  },
  {
    icon: Lock,
    title: 'How We Use Your Information',
    content:
      'Information collected is used to process orders, provide customer support, improve website functionality, communicate updates, and comply with legal obligations.',
  },
  {
    icon: ShieldCheck,
    title: 'Data Protection',
    content:
      'We implement industry-standard security measures including SSL encryption, secure payment processing, and restricted access controls to protect your information.',
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking Technologies',
    content:
      'Our website may use cookies and similar technologies to improve user experience, remember preferences, analyze traffic, and optimize website performance.',
  },
  {
    icon: Eye,
    title: 'Third-Party Services',
    content:
      'We may share necessary information with trusted third-party providers including payment processors, shipping carriers, and analytics services solely for business operations.',
  },
  {
    icon: Database,
    title: 'Data Retention',
    content:
      'Personal information is retained only as long as necessary to fulfill business purposes, legal requirements, and customer service obligations.',
  },
  {
    icon: Lock,
    title: 'Your Rights',
    content:
      'Depending on your jurisdiction, you may have the right to access, update, correct, or request deletion of your personal information.',
  },
  {
    icon: ShieldCheck,
    title: 'Marketing Communications',
    content:
      'You may receive promotional emails from us. You can unsubscribe at any time using the unsubscribe link included in communications.',
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
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
            <ShieldCheck size={14} />
            Your Privacy Matters
          </div>

          <h1>
            Privacy{' '}
            <span className="gradient-text">
              Policy
            </span>
          </h1>

          <p>
            Learn how we collect, use, store, and protect your personal
            information when using our website.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: '950px' }}>
          <div
            style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px',
            }}
          >
            <div
              style={{
                marginBottom: '32px',
                padding: '22px',
                background: 'rgba(0,207,255,0.08)',
                border: '1px solid rgba(0,207,255,0.2)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                We respect your privacy and are committed to protecting your
                personal information. We do not sell, rent, or trade personal
                information to third parties.
              </p>
            </div>

            {sections.map((section, index) => {
              const Icon = section.icon;

              return (
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(0,207,255,0.08)',
                        border: '1px solid rgba(0,207,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        size={18}
                        color="var(--primary-blue)"
                      />
                    </div>

                    <h2
                      style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-light)',
                      }}
                    >
                      {section.title}
                    </h2>
                  </div>

                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.8,
                    }}
                  >
                    {section.content}
                  </p>
                </div>
              );
            })}

            <div
              style={{
                marginTop: '24px',
                padding: '24px',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                gap: '14px',
              }}
            >
              <Mail
                size={20}
                color="var(--purple)"
                style={{ flexShrink: 0 }}
              />

              <div>
                <h3
                  style={{
                    marginBottom: '8px',
                    color: 'var(--text-light)',
                  }}
                >
                  Questions About Privacy?
                </h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                  }}
                >
                  If you have any questions regarding this Privacy Policy or
                  how your information is handled, please contact our support
                  team through the Contact page.
                </p>
              </div>
            </div>

            <p
              style={{
                marginTop: '28px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              Last Updated: June 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
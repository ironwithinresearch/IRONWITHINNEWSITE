'use client';

import {
  RefreshCcw,
  ShieldCheck,
  PackageX,
  AlertTriangle,
  CreditCard,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const sections = [
  {
    icon: PackageX,
    title: 'Return Eligibility',
    content:
      'Due to the sensitive nature of research compounds, products cannot be returned once they have been shipped and delivered. This policy helps ensure product integrity, safety, and quality control.',
  },
  {
    icon: AlertTriangle,
    title: 'Damaged Orders',
    content:
      'If your order arrives damaged, please contact our support team within 7 days of delivery. Supporting photographs of the packaging and products may be required for claim review.',
  },
  {
    icon: CheckCircle2,
    title: 'Incorrect Products',
    content:
      'If you receive an incorrect item due to our error, please notify us within 7 days of receiving the order. We will review the issue and arrange an appropriate resolution.',
  },
  {
    icon: ShieldCheck,
    title: 'Missing Items',
    content:
      'Claims regarding missing items must be submitted within 7 days of delivery confirmation. We may investigate shipping records and packaging documentation before issuing a resolution.',
  },
  {
    icon: CreditCard,
    title: 'Refund Approval',
    content:
      'Approved refunds will be processed back to the original payment method whenever possible. Processing times may vary depending on your financial institution.',
  },
  {
    icon: Clock,
    title: 'Refund Processing Time',
    content:
      'Once approved, refunds generally appear within 5–10 business days. Some payment providers may require additional processing time.',
  },
];

export default function RefundPage() {
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
            <RefreshCcw size={14} />
            Customer Protection
          </div>

          <h1>
            Refund &{' '}
            <span className="gradient-text">
              Return Policy
            </span>
          </h1>

          <p>
            Learn about our policies regarding refunds, replacements,
            damaged shipments, and incorrect orders.
          </p>
        </div>
      </div>

      {/* Highlight Banner */}
      <section className="section-sm">
        <div className="container" style={{ maxWidth: '950px' }}>
          <div
            style={{
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
              }}
            >
              <ShieldCheck
                size={22}
                color="var(--purple)"
                style={{ flexShrink: 0 }}
              />

              <div>
                <h3
                  style={{
                    marginBottom: '10px',
                    color: 'var(--text-light)',
                  }}
                >
                  Our Commitment
                </h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                  }}
                >
                  Customer satisfaction is important to us. While returns
                  are generally not accepted for research products, we will
                  review legitimate claims involving damaged, incorrect,
                  or missing items and work toward a fair resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
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
                      marginBottom: '14px',
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

            {/* Non-Returnable Items */}
            <div
              style={{
                marginTop: '10px',
                padding: '24px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h3
                style={{
                  color: '#f87171',
                  marginBottom: '10px',
                }}
              >
                Non-Returnable Products
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                For safety, compliance, and quality assurance reasons,
                research compounds and related products cannot be returned
                once shipped unless otherwise required by applicable law.
              </p>
            </div>

            {/* Chargeback Notice */}
            <div
              style={{
                marginTop: '24px',
                padding: '24px',
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.2)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h3
                style={{
                  color: '#fbbf24',
                  marginBottom: '10px',
                }}
              >
                Chargeback Policy
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                Customers are encouraged to contact our support team before
                initiating a chargeback. Most issues can be resolved quickly
                through our customer service process.
              </p>
            </div>

            {/* Contact Section */}
            <div
              style={{
                marginTop: '24px',
                padding: '24px',
                background: 'rgba(0,207,255,0.08)',
                border: '1px solid rgba(0,207,255,0.2)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h3
                style={{
                  color: 'var(--primary-blue)',
                  marginBottom: '10px',
                }}
              >
                Need Assistance?
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                If you experience any issue with your order, please contact
                our support team as soon as possible with your order number
                and relevant details so we can investigate.
              </p>
            </div>

            <p
              style={{
                marginTop: '30px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
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
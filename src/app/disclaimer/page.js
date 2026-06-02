'use client';

import {
  AlertTriangle,
  FlaskConical,
  ShieldAlert,
  Scale,
  ExternalLink,
  Ban,
} from 'lucide-react';

const sections = [
  {
    icon: FlaskConical,
    title: 'Research Use Only',
    content:
      'All products offered by Darryl Peptides are intended exclusively for laboratory research and scientific investigation. Products are not intended for human consumption, medical use, veterinary use, or therapeutic applications.',
  },
  {
    icon: ShieldAlert,
    title: 'No Medical Advice',
    content:
      'The information provided on this website is for informational and educational purposes only. Nothing on this website should be interpreted as medical advice, diagnosis, treatment recommendations, or healthcare guidance.',
  },
  {
    icon: Ban,
    title: 'Not For Human Consumption',
    content:
      'Products sold through this website are not dietary supplements, drugs, foods, cosmetics, or medical devices. Customers acknowledge that products are purchased solely for research purposes.',
  },
  {
    icon: AlertTriangle,
    title: 'Product Information',
    content:
      'While we strive to maintain accurate and up-to-date information regarding products, specifications, and research data, we make no warranties regarding the completeness, accuracy, or reliability of any information displayed on this website.',
  },
  {
    icon: Scale,
    title: 'Limitation of Liability',
    content:
      'Darryl Peptides shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from the use, misuse, handling, storage, transportation, or application of products purchased through this website.',
  },
  {
    icon: ExternalLink,
    title: 'Third-Party References',
    content:
      'References to scientific studies, publications, journals, or external websites are provided solely for informational purposes. We do not endorse or guarantee the accuracy of third-party content.',
  },
];

export default function DisclaimerPage() {
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
              color: '#fbbf24',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <AlertTriangle size={14} />
            Important Information
          </div>

          <h1>
            Legal{' '}
            <span className="gradient-text">
              Disclaimer
            </span>
          </h1>

          <p>
            Please review this disclaimer carefully before purchasing or
            using any products available through our website.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: '950px' }}>
          {/* Warning Banner */}
          <div
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
              }}
            >
              <AlertTriangle
                size={24}
                color="#f87171"
                style={{ flexShrink: 0 }}
              />

              <div>
                <h2
                  style={{
                    marginBottom: '12px',
                    color: '#f87171',
                    fontSize: '1.2rem',
                  }}
                >
                  FDA Disclaimer
                </h2>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                  }}
                >
                  The statements made on this website have not been
                  evaluated by the Food and Drug Administration (FDA).
                  Products offered by Darryl Peptides are intended solely
                  for research purposes and are not intended to diagnose,
                  treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </div>

          {/* Content Card */}
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

            {/* Assumption of Risk */}
            <div
              style={{
                marginTop: '10px',
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
                Assumption of Risk
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                By purchasing products from Darryl Peptides, customers
                acknowledge that they possess the necessary knowledge,
                expertise, facilities, and qualifications required for
                handling laboratory research compounds and assume all
                responsibility for their proper use, storage, handling,
                and disposal.
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
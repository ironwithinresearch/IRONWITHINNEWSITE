'use client';

import {
  Truck,
  Package,
  Globe,
  MapPin,
  Clock,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

const sections = [
  {
    icon: Clock,
    title: 'Order Processing',
    content:
      'Orders are typically processed within 1–2 business days after payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.',
  },
  {
    icon: Truck,
    title: 'Domestic Shipping',
    content:
      'Domestic orders are shipped using trusted courier partners. Delivery times generally range from 2–7 business days depending on destination and shipping method selected at checkout.',
  },
  {
    icon: Globe,
    title: 'International Shipping',
    content:
      'We ship to many international destinations where legally permitted. Delivery times vary by country, customs clearance, and local carrier operations.',
  },
  {
    icon: Package,
    title: 'Tracking Information',
    content:
      'Once your order has shipped, tracking information will be provided via email. Please allow up to 24 hours for tracking updates to appear in carrier systems.',
  },
  {
    icon: MapPin,
    title: 'Shipping Addresses',
    content:
      'Customers are responsible for providing accurate shipping information. We are not responsible for delays or delivery issues resulting from incorrect or incomplete addresses.',
  },
  {
    icon: AlertCircle,
    title: 'Customs & Import Duties',
    content:
      'International customers are responsible for any customs duties, taxes, import fees, or other charges imposed by their local authorities.',
  },
];

export default function ShippingPage() {
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
            <Truck size={14} />
            Delivery Information
          </div>

          <h1>
            Shipping{' '}
            <span className="gradient-text">
              Policy
            </span>
          </h1>

          <p>
            Learn about processing times, delivery methods, tracking,
            and shipping responsibilities.
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <section className="section-sm">
        <div className="container" style={{ maxWidth: '950px' }}>
          <div
            style={{
              background: 'rgba(0,207,255,0.08)',
              border: '1px solid rgba(0,207,255,0.2)',
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
                color="var(--primary-blue)"
                style={{ flexShrink: 0 }}
              />

              <div>
                <h3
                  style={{
                    marginBottom: '10px',
                    color: 'var(--text-light)',
                  }}
                >
                  Fast & Secure Shipping
                </h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                  }}
                >
                  Our goal is to process and dispatch orders as quickly as
                  possible while maintaining secure packaging and reliable
                  delivery standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

            {/* Lost Packages */}
            <div
              style={{
                marginTop: '10px',
                padding: '24px',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h3
                style={{
                  color: 'var(--purple)',
                  marginBottom: '10px',
                }}
              >
                Lost, Delayed, or Damaged Shipments
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                If your shipment is significantly delayed, arrives damaged,
                or appears lost in transit, please contact our support team
                promptly. We will work with the shipping carrier to
                investigate and determine appropriate next steps.
              </p>
            </div>

            {/* Shipping Restrictions */}
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
                Shipping Restrictions
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                Darryl Peptides reserves the right to refuse shipment to
                locations where applicable laws, regulations, or restrictions
                prohibit the delivery of research compounds.
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
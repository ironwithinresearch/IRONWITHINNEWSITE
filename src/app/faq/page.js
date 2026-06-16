'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle, ChevronDown, Search, FlaskConical,
  Truck, CreditCard, ShieldCheck, RotateCcw,
  Package, ArrowRight, MessageCircle, X,
} from 'lucide-react';

/* ── FAQ data ────────────────────────────────────────────── */
const categories = [
  { id: 'products', label: 'Products', Icon: FlaskConical },
  { id: 'shipping', label: 'Shipping', Icon: Truck },
  { id: 'ordering', label: 'Ordering', Icon: CreditCard },
  { id: 'quality', label: 'Quality', Icon: ShieldCheck },
  { id: 'returns', label: 'Returns & Refunds', Icon: RotateCcw },
];

const faqs = [
  {
    category: 'products',
    q: 'What are research peptides?',
    a: 'Research peptides are short chains of amino acids studied for their biological activity. They are synthesized for laboratory research purposes only and are not approved for human or veterinary use. Our peptides are produced to pharmaceutical-grade purity standards.',
  },
  {
    category: 'products',
    q: 'How should I store my peptides?',
    a: 'Lyophilized (freeze-dried) peptides should be stored at -20°C and protected from light and moisture. Once reconstituted, they should be kept at 4°C and used within 4 weeks. Always follow the storage guidelines provided with your order.',
  },
  {
    category: 'products',
    q: 'What form do your peptides come in?',
    a: 'All our peptides are supplied as lyophilized powder in sealed vials. This form provides maximum stability during shipping and storage. Each vial includes the compound weight as listed on the product page.',
  },
  {
    category: 'products',
    q: 'Do you carry custom synthesis peptides?',
    a: 'Yes, we offer custom peptide synthesis for research institutions and qualified researchers. Minimum order quantities apply. Contact our research team via the contact page for a custom quote and timeline.',
  },
  {
    category: 'quality',
    q: 'How do you verify purity?',
    a: 'Every batch undergoes independent third-party HPLC (High-Performance Liquid Chromatography) and mass spectrometry testing. We target ≥99.3% purity across all compounds.',
  },
  {
    category: 'shipping',
    q: 'How fast do you ship?',
    a: 'Orders ship between 24–48 hours after placement. Standard domestic delivery is 2–4 business days. Express options (1–2 days) are available at checkout. International orders typically arrive within 7–14 business days.',
  },
  {
    category: 'shipping',
    q: 'Do you ship internationally?',
    a: 'Yes, we ship to over 40 countries. Import regulations for research compounds vary by country — it is the researcher\'s responsibility to ensure compliance with local laws.',
  },
  {
    category: 'shipping',
    q: 'Is cold-chain shipping available?',
    a: 'Cold-chain shipping is not available. All lyophilized peptides are stable at ambient temperature during normal transit periods and do not require cold-chain handling for standard shipping timeframes.',
  },
  {
    category: 'shipping',
    q: 'How much does shipping cost?',
    a: 'A flat domestic shipping fee applies to all orders, calculated at checkout. International shipping rates are calculated at checkout based on weight and destination.',
  },
  {
    category: 'ordering',
    q: 'Do I need an account to order?',
    a: 'Guest checkout is available, but we recommend creating a researcher account. An account gives you access to your order history, faster checkout, wishlist functionality, and exclusive researcher discounts.',
  },
  {
    category: 'ordering',
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover), as well as Cash App, Venmo, and Zelle. All card transactions are protected by 256-bit SSL encryption, and we never store card details.',
  },
  {
    category: 'ordering',
    q: 'Can I change or cancel my order after placing it?',
    a: 'Orders cannot be cancelled once placed. Please review your order carefully before completing your purchase. If you believe there is an error, contact our support team immediately at support@ironwithin.io, though we cannot guarantee any modifications once an order is submitted.',
  },
  {
    category: 'returns',
    q: 'What is your return policy?',
    a: 'We do not accept returns. Due to the nature of research compounds and regulatory requirements, all sales are final. We encourage you to review your order carefully before purchase.',
  },
  {
    category: 'returns',
    q: 'Do you offer refunds?',
    a: 'Refunds are not offered. In exceptional circumstances — such as a confirmed shipping error, significant product quality issue, or missing item — a refund may be reviewed and issued if approved at our discretion. Please contact support@ironwithin.io with full documentation.',
  },
  {
    category: 'returns',
    q: 'What if my order arrives damaged?',
    a: 'If your order arrives damaged or compromised, contact us within 48 hours of delivery with photos of the packaging and product. We will review your case and, if approved, may arrange a replacement or store credit.',
  },
  {
    category: 'returns',
    q: 'How long does a refund take if approved?',
    a: 'If a refund is approved, it is processed within 2–3 business days. Depending on your payment method and bank, funds typically appear within 5–7 business days after processing.',
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('products');
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(f => {
    const matchCat = f.category === activeCategory;
    const matchSearch = search === '' ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return search !== '' ? matchSearch : matchCat;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--primary-blue)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            <HelpCircle size={13} /> Help Centre
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900,
            marginBottom: '12px',
          }}>
            Frequently Asked{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Questions</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '28px' }}>
            Find answers to common questions about our products, shipping, and policies.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
            <Search size={16} style={{
              position: 'absolute', left: '16px', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search all questions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 44px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
                transition: 'border-color var(--transition-fast)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: '14px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}>
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '32px',
          alignItems: 'start',
        }}>

          {/* ── Category sidebar ── */}
          {!search && (
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              position: 'sticky',
              top: 'calc(var(--navbar-height) + 20px)',
            }}>
              {categories.map((cat, i) => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }} style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '14px 18px',
                  borderBottom: i < categories.length - 1 ? '1px solid var(--glass-border)' : 'none',
                  background: activeCategory === cat.id ? 'rgba(0,207,255,0.08)' : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${activeCategory === cat.id ? 'var(--primary-blue)' : 'transparent'}`,
                  color: activeCategory === cat.id ? 'var(--primary-blue)' : 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: activeCategory === cat.id ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left',
                }}>
                  <cat.Icon size={16} />
                  {cat.label}
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.7rem', fontWeight: 600,
                    color: activeCategory === cat.id ? 'var(--primary-blue)' : 'var(--text-muted)',
                    background: activeCategory === cat.id ? 'rgba(0,207,255,0.15)' : 'var(--bg-dark)',
                    padding: '2px 7px', borderRadius: '999px',
                  }}>
                    {faqs.filter(f => f.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* ── FAQ List ── */}
          <div style={{ gridColumn: search ? 'span 2' : 'auto' }}>

            {search && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "
                <span style={{ color: 'var(--primary-blue)' }}>{search}</span>"
              </p>
            )}

            {filtered.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 24px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
              }}>
                <HelpCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.4 }} />
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  No questions found for "{search}"
                </p>
                <Link href="/contact" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  color: 'var(--primary-blue)', fontWeight: 500, fontSize: '0.875rem',
                  textDecoration: 'none',
                }}>
                  Ask us directly <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((faq, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={i} style={{
                      background: 'var(--card-dark)',
                      border: `1px solid ${isOpen ? 'rgba(0,207,255,0.25)' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      transition: 'all var(--transition-base)',
                      boxShadow: isOpen ? '0 0 16px rgba(0,207,255,0.07)' : 'none',
                    }}>
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        style={{
                          width: '100%',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '18px 20px',
                          background: 'none', border: 'none',
                          color: 'var(--text-light)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.92rem', fontWeight: 600,
                          cursor: 'pointer', textAlign: 'left', gap: '12px',
                        }}
                      >
                        <span style={{ flex: 1 }}>{faq.q}</span>
                        <div style={{
                          width: 28, height: 28, flexShrink: 0,
                          borderRadius: '50%',
                          background: isOpen ? 'rgba(0,207,255,0.12)' : 'var(--bg-dark)',
                          border: `1px solid ${isOpen ? 'rgba(0,207,255,0.3)' : 'var(--glass-border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all var(--transition-base)',
                        }}>
                          <ChevronDown
                            size={14}
                            color={isOpen ? 'var(--primary-blue)' : 'var(--text-muted)'}
                            style={{
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                              transition: 'transform var(--transition-base)',
                            }}
                          />
                        </div>
                      </button>

                      {isOpen && (
                        <div style={{
                          padding: '0 20px 20px',
                          borderTop: '1px solid var(--glass-border)',
                        }}>
                          <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem', lineHeight: 1.8,
                            paddingTop: '16px',
                          }}>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Still need help ── */}
        <div style={{
          marginTop: '60px',
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '24px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at left, rgba(0,207,255,0.05) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <MessageCircle size={20} color="var(--primary-blue)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800 }}>
                Still have questions?
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Email our support team at{' '}
              <a
                href="mailto:support@ironwithin.io"
                style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}
              >
                support@ironwithin.io
              </a>
            </p>
          </div>
          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '13px 28px',
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-md)',
            color: '#fff', fontWeight: 700,
            textDecoration: 'none', fontFamily: 'var(--font-body)',
            boxShadow: 'var(--glow-blue)',
            flexShrink: 0, position: 'relative', zIndex: 1,
          }}>
            Email Support <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

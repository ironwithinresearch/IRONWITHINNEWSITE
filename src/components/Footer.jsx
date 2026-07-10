'use client';

import Link from 'next/link';
import { FlaskConical, Mail, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import PaymentMethods from './PaymentMethods';

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Best Sellers', href: '/shop' },
  ],
  Company: [
    { label: 'Contact', href: '/contact' },
    { label: 'Research Plans', href: '/continuity' },
    { label: 'Research App', href: 'https://peptideparadigm.app' },
    { label: 'Refer & Earn $25', href: '/refer' },
    { label: 'Rewards', href: '/rewards' },
    { label: 'Affiliates', href: '/affiliate' },
  ],
  Support: [
    { label: 'Lab Reports & COAs', href: '/lab-reports' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Track Order', href: '/orders' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
};

const trustItems = [
  { Icon: FlaskConical, label: 'Lab Verified' },
  { Icon: Truck, label: 'Fast Shipping' },
  { Icon: ShieldCheck, label: 'Secure Checkout' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-elevated)',
      borderTop: '1px solid var(--glass-border)',
      paddingTop: '64px',
    }}>
      <div className="container">

        {/* ── Top: Brand + Links ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--glow-blue)',
              }}>
                <FlaskConical size={18} color="#fff" />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800, fontSize: '1rem',
                letterSpacing: '-0.01em',
              }}>Iron Within Research</span>
            </div>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              marginBottom: '20px',
              maxWidth: '240px',
            }}>
              Premium research-grade peptides trusted by scientists and researchers worldwide. 99.3%+ purity guaranteed.
            </p>

            {/* Support email */}
            <a
              href="mailto:support@ironwithin.io"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                color: 'var(--primary-blue)',
                fontSize: '0.85rem', fontWeight: 500,
                textDecoration: 'none',
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Mail size={14} />
              support@ironwithin.io
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '16px',
              }}>{heading}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-blue)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Trust badges ── */}
        <div style={{
          display: 'flex', gap: '28px',
          flexWrap: 'wrap',
          padding: '20px 0',
          borderTop: '1px solid var(--glass-border)',
          borderBottom: '1px solid var(--glass-border)',
          marginBottom: '28px',
        }}>
          {trustItems.map(({ Icon, label }) => (
            <span key={label} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              color: 'var(--text-muted)', fontSize: '0.82rem',
            }}>
              <Icon size={14} color="var(--primary-blue)" />
              {label}
            </span>
          ))}
        </div>

        {/* ── We Accept ── */}
        <div style={{ paddingBottom: '28px' }}>
          <PaymentMethods />
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          paddingBottom: '32px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2026 Iron Within Nutrition LLC DBA Iron Within Research. All rights reserved. For research purposes only.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Not intended for human consumption.
          </p>
        </div>

      </div>
    </footer>
  );
}

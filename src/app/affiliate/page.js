'use client';

import Link from 'next/link';
import {
  FlaskConical, DollarSign, Users, BarChart3,
  ArrowRight, CheckCircle2, Zap, Globe, Gift,
  ShieldCheck, Star,
} from 'lucide-react';

const benefits = [
  {
    Icon: DollarSign,
    color: '#34d399',
    title: 'Competitive Commission',
    desc: 'Earn generous commissions on every sale you refer. Payments are processed automatically each week.',
  },
  {
    Icon: BarChart3,
    color: 'var(--primary-blue)',
    title: 'Real-Time Dashboard',
    desc: 'Track your clicks, conversions, and earnings in a powerful, easy-to-use affiliate dashboard.',
  },
  {
    Icon: Globe,
    color: 'var(--purple)',
    title: 'Dedicated Affiliate Link',
    desc: 'Get your own unique tracking link to share across any platform — social media, blogs, email, and more.',
  },
  {
    Icon: Gift,
    color: '#fbbf24',
    title: 'Marketing Resources',
    desc: 'Access banners, product images, and promotional copy to help you promote Iron Within Research.',
  },
  {
    Icon: Zap,
    color: 'var(--pink)',
    title: 'Instant Approval',
    desc: 'Apply and get approved quickly. Start earning with your first referral right away.',
  },
  {
    Icon: Users,
    color: 'var(--secondary-blue)',
    title: 'Affiliate Community',
    desc: 'Join a growing network of researchers, content creators, and health advocates promoting quality science.',
  },
];

const steps = [
  { num: '01', title: 'Apply', desc: 'Fill out the quick application form through our GoAffPro portal.' },
  { num: '02', title: 'Get Approved', desc: 'Our team reviews applications promptly. Most are approved within 24 hours.' },
  { num: '03', title: 'Share Your Link', desc: 'Receive your unique affiliate link and start promoting Iron Within Research.' },
  { num: '04', title: 'Earn Commissions', desc: 'Earn on every qualifying order made through your referral link.' },
];

const faqs = [
  { q: 'Who can apply to the affiliate program?', a: 'Anyone with a website, blog, social media account, or email list relevant to research, health, fitness, or biohacking is welcome to apply.' },
  { q: 'How are commissions calculated?', a: 'Commissions are calculated as a percentage of the order subtotal (excluding shipping and taxes). The exact rate is displayed in your affiliate dashboard after approval.' },
  { q: 'When do I get paid?', a: 'Affiliate payouts are processed weekly once you reach the minimum payout threshold. Payment methods include PayPal, bank transfer, and crypto.' },
  { q: 'Is there a cost to join?', a: 'No — joining the Iron Within Research affiliate program is completely free.' },
];

export default function AffiliatePage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 72px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.14) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, rgba(0,207,255,0.11) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 90%, rgba(236,72,153,0.09) 0%, transparent 55%)
          `,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '6px 16px',
            background: 'rgba(0,207,255,0.08)',
            border: '1px solid rgba(0,207,255,0.22)',
            borderRadius: '999px',
            marginBottom: '24px',
            fontSize: '0.75rem', color: 'var(--primary-blue)',
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <FlaskConical size={12} /> Affiliate Program
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: '20px', letterSpacing: '-0.03em',
          }}>
            Partner With{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Iron Within Research</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            lineHeight: 1.7, marginBottom: '36px',
            maxWidth: '540px', margin: '0 auto 36px',
          }}>
            Join our affiliate program and earn commissions by promoting premium research-grade peptides to your audience.
          </p>

          {/* CTA — links to GoAffPro */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://ironwithin.goaffpro.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 0 24px rgba(0,207,255,0.45)',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(0,207,255,0.65)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,207,255,0.45)'; }}
            >
              Apply Now — It's Free <ArrowRight size={16} />
            </a>
            <a
              href="https://ironwithin.goaffpro.com/login"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px',
                background: 'transparent',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-light)'; }}
            >
              Affiliate Login
            </a>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '36px' }}>
            {[
              { Icon: ShieldCheck, label: 'Free to Join' },
              { Icon: Star, label: 'Fast Approval' },
              { Icon: DollarSign, label: 'Weekly Payouts' },
            ].map(({ Icon, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Icon size={13} color="var(--primary-blue)" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container">

        {/* ── Benefits ── */}
        <section style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.72rem', fontWeight: 700,
              color: 'var(--primary-blue)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              <Zap size={12} /> Program Benefits
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
            }}>
              Why Become an{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Affiliate?</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {benefits.map(({ Icon, color, title, desc }) => (
              <div key={title} style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 0 20px ${color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: `${color}18`, border: `1px solid ${color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '18px',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800,
            }}>
              How It{' '}
              <span style={{
                background: 'var(--gradient-secondary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Works</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.5rem', fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '14px', lineHeight: 1,
                }}>{s.num}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
                  {s.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ marginBottom: '72px', maxWidth: '720px', margin: '0 auto 72px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800,
            textAlign: 'center', marginBottom: '36px',
          }}>
            Affiliate FAQ
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map(({ q, a }) => (
              <div key={q} style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <CheckCircle2 size={16} color="var(--primary-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.92rem' }}>{q}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section style={{
          position: 'relative',
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(40px, 6vw, 72px)',
          textAlign: 'center',
          overflow: 'hidden',
          marginBottom: '0',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,207,255,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900,
              marginBottom: '16px',
            }}>
              Ready to Start Earning?
            </h2>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '1rem',
              maxWidth: '460px', margin: '0 auto 32px', lineHeight: 1.7,
            }}>
              Apply today through our GoAffPro portal and start earning commissions on every sale you refer to Iron Within Research.
            </p>
            <a
              href="https://ironwithin.goaffpro.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 36px',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', fontFamily: 'var(--font-body)',
                boxShadow: 'var(--glow-blue)',
              }}
            >
              Apply Now on GoAffPro <ArrowRight size={16} />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import {
  FlaskConical, DollarSign, Users, BarChart3,
  ArrowRight, CheckCircle2, Zap, Globe, Gift,
  ShieldCheck, Star, Wallet,
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
    title: 'Done-For-You Swipe Pack',
    desc: 'Ready-to-post captions, hooks, product images, and the compliance disclosure — copy, paste, add your code, post. No guesswork.',
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
  { q: 'How are commissions calculated?', a: 'You earn 10% of each order’s subtotal to start (excluding shipping and taxes), rising to 15% once you pass $2,500/month in referred sales and 20% past $15,000/month. Your current rate and earnings show in your dashboard.' },
  { q: 'Do I get content to post?', a: 'Yes — every approved affiliate gets our Swipe Pack: ready-to-post captions, hooks, product images, and the required disclosure. Just add your code and post.' },
  { q: 'When do I get paid?', a: 'Affiliate payouts are processed weekly via Everee. Paying through Everee lets us properly issue your 1099 for tax purposes.' },
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
            Earn <strong style={{ color: 'var(--text-light)' }}>10% on every sale</strong> — rising to <strong style={{ color: 'var(--text-light)' }}>20%</strong> as you grow — promoting premium research-grade peptides. Weekly payouts, your own link, and done-for-you content so you can post in minutes.
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

        {/* ── 2× store-credit payout (already-approved affiliates) ── */}
        <section style={{ marginTop: '-20px', marginBottom: '64px' }}>
          <div style={{ maxWidth: 820, margin: '0 auto', background: 'linear-gradient(100deg, rgba(0,207,255,0.12), rgba(124,58,237,0.10))', border: '1px solid rgba(0,207,255,0.4)', borderRadius: 18, padding: '24px 26px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,207,255,0.12)', border: '1px solid rgba(0,207,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Wallet size={26} color="var(--primary-blue)" />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'inline-block', fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--primary-blue)', background: 'rgba(0,207,255,0.12)', padding: '3px 9px', borderRadius: 999, marginBottom: 8 }}>Already an affiliate?</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Get paid in 2× store credit</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                Take your commission as Iron Within store credit and it's worth <strong style={{ color: 'var(--primary-blue)' }}>double</strong> — a <strong style={{ color: 'var(--text-light)' }}>$100</strong> commission becomes <strong style={{ color: 'var(--primary-blue)' }}>$200</strong>. Auto-applies at checkout, switch anytime.
              </p>
            </div>
            <Link href="/affiliate/payout" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', background: 'var(--gradient-primary)', borderRadius: 11, color: '#fff', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(0,207,255,0.35)' }}>
              Choose 2× credit <ArrowRight size={16} />
            </Link>
          </div>
        </section>

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
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
          }}>
            {benefits.map(({ Icon, color, title, desc }) => (
              <div key={title} style={{
                flex: '1 1 280px',
                maxWidth: '320px',
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

        {/* ── Commission tiers ── */}
        <section style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800 }}>
              Earn More As You{' '}
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Grow</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 10 }}>Everyone starts at 10%. Drive volume, earn more on every sale.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 18, maxWidth: 860, margin: '0 auto' }}>
            {[
              { pct: '10%', name: 'Partner', req: 'Default — everyone starts here', best: false },
              { pct: '15%', name: 'Pro', req: '$2,500+ in referred sales / month', best: true },
              { pct: '20%', name: 'Elite', req: '$15,000+ in referred sales / month', best: false },
            ].map((t) => (
              <div key={t.name} style={{ background: 'var(--card-dark)', border: `1px solid ${t.best ? 'rgba(0,207,255,0.45)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-lg)', padding: '30px 24px', textAlign: 'center', position: 'relative' }}>
                {t.best && <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#00cfff,#ec4899)', color: '#fff', fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>Aim here</span>}
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.6rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{t.pct}</div>
                <div style={{ fontWeight: 800, color: '#fff', margin: '8px 0 4px' }}>{t.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>{t.req}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 20 }}>Tiers are based on trailing 30-day referred sales and reviewed monthly.</p>
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
            <div style={{ marginTop: 18 }}>
              <Link href="/affiliate/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                See the done-for-you Swipe Pack <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

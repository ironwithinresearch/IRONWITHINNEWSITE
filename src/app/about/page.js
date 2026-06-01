'use client';

import Link from 'next/link';
import {
  FlaskConical, ShieldCheck, Truck, Trophy,
  Users, Microscope, ArrowRight, CheckCircle2,
  Zap, Globe, HeartPulse, BadgeCheck, Star,
  Building2, Phone, Mail,
} from 'lucide-react';

/* ── Static data ─────────────────────────────────────────── */
const stats = [
  { value: '500+',  label: 'Research Compounds',   Icon: FlaskConical, color: 'var(--primary-blue)' },
  { value: '99.9%', label: 'Avg Purity Rate',       Icon: ShieldCheck,  color: '#34d399' },
  { value: '50K+',  label: 'Researchers Served',    Icon: Users,        color: 'var(--purple)' },
  { value: '12+',   label: 'Years of Excellence',   Icon: Trophy,       color: '#fbbf24' },
];

const values = [
  {
    Icon: ShieldCheck,
    color: '#34d399',
    title: 'Uncompromising Quality',
    desc: 'Every peptide we produce undergoes rigorous third-party testing. We publish full Certificates of Analysis for complete transparency.',
  },
  {
    Icon: Microscope,
    color: 'var(--primary-blue)',
    title: 'Science-First Approach',
    desc: 'Our formulations are grounded in peer-reviewed research. We follow the science, not trends, to deliver compounds that matter.',
  },
  {
    Icon: Globe,
    color: 'var(--purple)',
    title: 'Global Researcher Community',
    desc: 'Serving researchers in over 40 countries. We understand the needs of the global scientific community and deliver accordingly.',
  },
  {
    Icon: Zap,
    color: '#fbbf24',
    title: 'Speed & Reliability',
    desc: 'Orders ship within 24 hours. We know time-sensitive research cant wait, so we make fulfilment a priority.',
  },
];

const team = [
  {
    name: 'Dr. Darryl Moore',
    role: 'Founder & Chief Scientist',
    bio: 'PhD in Biochemistry from MIT. 15+ years in peptide synthesis and research applications.',
    initials: 'DM',
    color: 'var(--primary-blue)',
  },
  {
    name: 'Dr. Sarah Chen',
    role: 'Head of Quality Assurance',
    bio: 'Former FDA consultant with expertise in pharmaceutical-grade compound verification.',
    initials: 'SC',
    color: 'var(--purple)',
  },
  {
    name: 'James Whitfield',
    role: 'Director of Operations',
    bio: 'Logistics expert ensuring every order ships with full compliance and cold-chain integrity.',
    initials: 'JW',
    color: '#34d399',
  },
  {
    name: 'Dr. Priya Nair',
    role: 'Research Liaison',
    bio: 'Bridges the gap between our product line and the latest academic peptide research globally.',
    initials: 'PN',
    color: '#fbbf24',
  },
];

const milestones = [
  { year: '2012', event: 'Darryl Peptides founded in San Diego, CA with a focus on BPC-157 research.' },
  { year: '2015', event: 'Expanded catalogue to 50+ compounds. Established first third-party lab partnership.' },
  { year: '2018', event: 'Reached 10,000 researchers served. Launched international shipping to 25 countries.' },
  { year: '2020', event: 'ISO-certified manufacturing facility opened. Purity standards raised to ≥99%.' },
  { year: '2022', event: 'Crossed 500+ compound catalogue. Research partnerships with 3 universities.' },
  { year: '2024', event: '50,000+ researchers served. Launched same-day dispatch for domestic orders.' },
];

const certifications = [
  'ISO 9001:2015 Certified',
  'GMP Compliant Facility',
  'Third-Party HPLC Verified',
  'FDA Registered Facility',
  'Certificate of Analysis Included',
  'REACH Compliant',
];

/* ── Page ────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        padding: '100px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 30%, rgba(0,207,255,0.10) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 90%, rgba(236,72,153,0.07) 0%, transparent 55%)
          `,
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: `
            linear-gradient(rgba(0,207,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,207,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
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
            <FlaskConical size={12} /> Est. 2012
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: '20px', letterSpacing: '-0.03em',
          }}>
            Advancing Research{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>One Peptide</span>{' '}at a Time
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            lineHeight: 1.8, marginBottom: '36px',
            maxWidth: '600px', margin: '0 auto 36px',
          }}>
            Since 2012, Darryl Peptides has been the trusted source for pharmaceutical-grade
            research peptides — built on transparency, purity, and an unwavering commitment
            to the scientific community.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 30px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', fontFamily: 'var(--font-body)',
              boxShadow: 'var(--glow-blue)',
            }}>
              Shop Peptides <ArrowRight size={15} />
            </Link>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 30px',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-light)', fontWeight: 600, fontSize: '0.95rem',
              textDecoration: 'none', fontFamily: 'var(--font-body)',
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{
        background: 'var(--card-dark)',
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '48px 24px',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
          }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <s.Icon size={22} color={s.color} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '4px',
                }}>{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.72rem', fontWeight: 700,
                color: 'var(--primary-blue)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: '14px',
              }}>
                <Microscope size={12} /> Our Mission
              </div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 900, marginBottom: '20px',
                lineHeight: 1.15,
              }}>
                Empowering{' '}
                <span style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Scientific Discovery</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8, fontSize: '0.95rem',
                marginBottom: '20px',
              }}>
                We believe that access to high-quality research compounds shouldn't be a barrier
                to scientific progress. Our mission is to make pharmaceutical-grade peptides
                accessible, reliable, and fully transparent for researchers worldwide.
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8, fontSize: '0.95rem',
                marginBottom: '28px',
              }}>
                Every compound we offer comes with a full Certificate of Analysis, sourced from
                accredited third-party laboratories. We don't just meet the standard — we set it.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'All compounds independently HPLC verified',
                  'Transparent supply chain from synthesis to dispatch',
                  'Dedicated researcher support team',
                  'Compliant with international research regulations',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual */}
            <div style={{
              position: 'relative',
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px 32px',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at top right, rgba(0,207,255,0.07) 0%, transparent 65%)',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  marginBottom: '24px',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--glow-blue)',
                  }}>
                    <FlaskConical size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.9rem' }}>
                      Quality Promise
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Every single batch</div>
                  </div>
                </div>

                {/* Process steps */}
                {[
                  { step: '01', label: 'Synthesis', desc: 'GMP-compliant synthesis under strict protocols' },
                  { step: '02', label: 'Verification', desc: 'Independent HPLC purity testing ≥99%' },
                  { step: '03', label: 'Documentation', desc: 'Full CoA generated and attached to order' },
                  { step: '04', label: 'Dispatch', desc: 'Cold-chain shipping within 24 hours' },
                ].map((s, i) => (
                  <div key={s.step} style={{
                    display: 'flex', gap: '14px',
                    padding: '14px 0',
                    borderBottom: i < 3 ? '1px solid var(--glass-border)' : 'none',
                  }}>
                    <div style={{
                      width: 32, height: 32, flexShrink: 0,
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,207,255,0.1)',
                      border: '1px solid rgba(0,207,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.7rem', fontWeight: 800,
                      color: 'var(--primary-blue)',
                    }}>{s.step}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px' }}>{s.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-elevated) 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.72rem', fontWeight: 700,
              color: 'var(--purple)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              <Star size={12} /> Our Core Values
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
            }}>
              What We{' '}
              <span style={{
                background: 'var(--gradient-secondary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Stand For</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {values.map(v => (
              <div key={v.title} style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                transition: 'all var(--transition-base)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${v.color}44`;
                  e.currentTarget.style.boxShadow = `0 0 24px ${v.color}18`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 52, height: 52,
                  borderRadius: 'var(--radius-md)',
                  background: `${v.color}15`,
                  border: `1px solid ${v.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <v.Icon size={24} color={v.color} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem', fontWeight: 700,
                  marginBottom: '10px',
                }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.72rem', fontWeight: 700,
              color: 'var(--primary-blue)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              <Building2 size={12} /> Our Journey
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
            }}>
              Company{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Milestones</span>
            </h2>
          </div>

          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '72px', top: 0, bottom: 0,
              width: '1px',
              background: 'linear-gradient(180deg, var(--primary-blue), var(--purple), transparent)',
              opacity: 0.3,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {milestones.map((m, i) => (
                <div key={m.year} style={{
                  display: 'flex', gap: '24px',
                  padding: '20px 0',
                  borderBottom: i < milestones.length - 1 ? '1px solid var(--glass-border)' : 'none',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: '56px', flexShrink: 0,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem', fontWeight: 800,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textAlign: 'right',
                  }}>{m.year}</div>

                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--gradient-primary)',
                    marginTop: '5px', marginLeft: '9px',
                    boxShadow: '0 0 8px rgba(0,207,255,0.5)',
                  }} />

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem', lineHeight: 1.7,
                    flex: 1,
                  }}>{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-dark) 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.72rem', fontWeight: 700,
              color: 'var(--pink)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              <Users size={12} /> The Team
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
            }}>
              Meet the{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Experts</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {team.map(member => (
              <div key={member.name} style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px 24px',
                textAlign: 'center',
                transition: 'all var(--transition-base)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${member.color}44`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 20px ${member.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${member.color}, ${member.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '1.3rem', fontWeight: 900, color: '#fff',
                  fontFamily: 'var(--font-heading)',
                  boxShadow: `0 0 20px ${member.color}40`,
                }}>{member.initials}</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '4px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800 }}>
                    {member.name}
                  </h3>
                  <BadgeCheck size={14} color="var(--primary-blue)" />
                </div>
                <p style={{
                  color: member.color, fontSize: '0.75rem',
                  fontWeight: 600, marginBottom: '12px',
                  letterSpacing: '0.03em',
                }}>{member.role}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ── */}
      <section style={{ padding: '60px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800,
            }}>
              Certifications &{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Compliance</span>
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {certifications.map(cert => (
              <div key={cert} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 16px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'; e.currentTarget.style.background = 'var(--card-elevated)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'var(--card-dark)'; }}
              >
                <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div className="container">
          <div style={{
            position: 'relative',
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(40px, 6vw, 72px)',
            textAlign: 'center',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0,207,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900,
                marginBottom: '14px',
              }}>
                Join Our Research{' '}
                <span style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Community</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)', fontSize: '1rem',
                maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.7,
              }}>
                Start exploring our full catalogue of verified research peptides today.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/shop" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '13px 28px',
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff', fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'var(--font-body)',
                  boxShadow: 'var(--glow-blue)',
                }}>
                  Browse Shop <ArrowRight size={15} />
                </Link>
                <Link href="/contact" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '13px 28px',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-light)', fontWeight: 500,
                  textDecoration: 'none', fontFamily: 'var(--font-body)',
                }}>
                  <Phone size={14} /> Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
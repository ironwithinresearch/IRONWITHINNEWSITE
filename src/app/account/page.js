'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User, Package, Heart, Settings, LogOut,
  ShieldCheck, Bell, Mail, Phone, Building2,
  FlaskConical, ChevronRight, Edit2, Camera,
  BadgeCheck, Star, ArrowRight, Lock,
} from 'lucide-react';

/* ── Mock user data ──────────────────────────────────────── */
const user = {
  name: 'Dr. James Mitchell',
  email: 'j.mitchell@research.edu',
  phone: '+1 (555) 012-3456',
  organization: 'Institute of Peptide Research',
  role: 'Research Scientist',
  joined: 'January 2024',
  orders: 14,
  wishlist: 6,
  totalSpent: 847.60,
};

const recentOrders = [
  { id: 'DP-48291', date: 'May 20, 2026', status: 'Delivered', total: 129.97, items: 3 },
  { id: 'DP-47103', date: 'May 05, 2026', status: 'Processing', total: 79.99,  items: 1 },
  { id: 'DP-45887', date: 'Apr 18, 2026', status: 'Delivered', total: 164.97, items: 2 },
];

const statusColor = {
  Delivered:  { bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)',  text: '#34d399' },
  Processing: { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  text: '#fbbf24' },
  Shipped:    { bg: 'rgba(0,207,255,0.12)',   border: 'rgba(0,207,255,0.3)',   text: 'var(--primary-blue)' },
  Cancelled:  { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   text: '#f87171' },
};

const sidebarLinks = [
  { icon: User,     label: 'My Profile',    tab: 'profile' },
  { icon: Package,  label: 'My Orders',     tab: 'orders',   href: '/orders' },
  { icon: Heart,    label: 'Wishlist',      tab: 'wishlist', href: '/wishlist' },
  { icon: Settings, label: 'Settings',      tab: 'settings' },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode]   = useState(false);
  const [profile, setProfile]     = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    organization: user.organization,
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
            <User size={13} /> My Account
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900,
          }}>
            Account{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Dashboard</span>
          </h1>
        </div>
      </div>

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '28px',
          alignItems: 'start',
        }}>

          {/* ── Sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Profile card */}
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 20px',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at top, rgba(0,207,255,0.04) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Avatar */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', fontWeight: 900, color: '#fff',
                    boxShadow: 'var(--glow-blue)',
                    fontFamily: 'var(--font-heading)',
                  }}>
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <button style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--card-dark)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    <Camera size={12} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</span>
                  <BadgeCheck size={14} color="var(--primary-blue)" />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '4px' }}>{user.email}</p>
                <p style={{
                  fontSize: '0.72rem', color: 'var(--primary-blue)',
                  fontWeight: 600, letterSpacing: '0.04em',
                }}>{user.role}</p>

                <div style={{ height: 1, background: 'var(--glass-border)', margin: '16px 0' }} />

                {/* Quick stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Orders',   value: user.orders },
                    { label: 'Wishlist', value: user.wishlist },
                  ].map(s => (
                    <div key={s.label} style={{
                      padding: '10px 8px',
                      background: 'var(--bg-dark)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--glass-border)',
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.2rem', fontWeight: 900,
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>{s.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nav links */}
            <div style={{
              background: 'var(--card-dark)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}>
              {sidebarLinks.map((link, i) => (
                link.href ? (
                  <Link key={link.tab} href={link.href} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 18px',
                    borderBottom: i < sidebarLinks.length - 1 ? '1px solid var(--glass-border)' : 'none',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.88rem', fontWeight: 500,
                    transition: 'all var(--transition-fast)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-blue)'; e.currentTarget.style.background = 'rgba(0,207,255,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <link.icon size={16} />
                    {link.label}
                    <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                  </Link>
                ) : (
                  <button key={link.tab} onClick={() => setActiveTab(link.tab)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 18px',
                    borderBottom: i < sidebarLinks.length - 1 ? '1px solid var(--glass-border)' : 'none',
                    background: activeTab === link.tab ? 'rgba(0,207,255,0.07)' : 'transparent',
                    border: 'none',
                    borderLeft: activeTab === link.tab ? '3px solid var(--primary-blue)' : '3px solid transparent',
                    color: activeTab === link.tab ? 'var(--primary-blue)' : 'var(--text-secondary)',
                    fontSize: '0.88rem', fontWeight: activeTab === link.tab ? 600 : 500,
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                  }}>
                    <link.icon size={16} />
                    {link.label}
                    <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                  </button>
                )
              ))}

              {/* Logout */}
              <button style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 18px',
                background: 'transparent', border: 'none',
                color: '#f87171', fontSize: '0.88rem', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all var(--transition-fast)',
                textAlign: 'left',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div>

            {/* ── PROFILE TAB ── */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                  {[
                    { label: 'Total Orders',  value: user.orders,                 icon: Package,     color: 'var(--primary-blue)' },
                    { label: 'Total Spent',   value: `$${user.totalSpent.toFixed(2)}`, icon: Star,  color: '#fbbf24' },
                    { label: 'Member Since',  value: user.joined,                 icon: FlaskConical, color: 'var(--purple)' },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: 'var(--card-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px',
                      transition: 'all var(--transition-fast)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}44`; e.currentTarget.style.boxShadow = `0 0 16px ${s.color}15`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                        background: `${s.color}18`,
                        border: `1px solid ${s.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px',
                      }}>
                        <s.icon size={17} color={s.color} />
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem', fontWeight: 800,
                        color: 'var(--text-light)', marginBottom: '2px',
                      }}>{s.value}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Profile form */}
                <div style={{
                  background: 'var(--card-dark)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '28px',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '24px',
                  }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>
                      Profile Information
                    </h2>
                    <button onClick={() => setEditMode(v => !v)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px',
                      background: editMode ? 'var(--gradient-primary)' : 'transparent',
                      border: `1px solid ${editMode ? 'transparent' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: editMode ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.82rem', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                      transition: 'all var(--transition-fast)',
                    }}>
                      <Edit2 size={13} /> {editMode ? 'Save Changes' : 'Edit Profile'}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    {[
                      { label: 'Full Name',        icon: <User size={14} />,       field: 'name',         value: profile.name },
                      { label: 'Email Address',    icon: <Mail size={14} />,       field: 'email',        value: profile.email,        type: 'email' },
                      { label: 'Phone Number',     icon: <Phone size={14} />,      field: 'phone',        value: profile.phone,        type: 'tel' },
                      { label: 'Organization',     icon: <Building2 size={14} />,  field: 'organization', value: profile.organization },
                    ].map(f => (
                      <div key={f.field}>
                        <label style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          fontSize: '0.78rem', fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                          marginBottom: '8px',
                        }}>
                          {f.icon} {f.label}
                        </label>
                        {editMode ? (
                          <input
                            type={f.type || 'text'}
                            value={f.value}
                            onChange={e => setProfile(p => ({ ...p, [f.field]: e.target.value }))}
                            style={{
                              width: '100%', padding: '10px 14px',
                              background: 'var(--bg-dark)',
                              border: '1px solid var(--glass-border)',
                              borderRadius: 'var(--radius-md)',
                              color: 'var(--text-light)',
                              fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none',
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
                            onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                          />
                        ) : (
                          <div style={{
                            padding: '10px 14px',
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.88rem', color: 'var(--text-light)',
                          }}>{f.value}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent orders preview */}
                <div style={{
                  background: 'var(--card-dark)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '28px',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '20px',
                  }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>
                      Recent Orders
                    </h2>
                    <Link href="/orders" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      color: 'var(--primary-blue)', fontSize: '0.82rem', fontWeight: 500,
                      textDecoration: 'none',
                    }}>
                      View All <ArrowRight size={13} />
                    </Link>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {recentOrders.map(order => {
                      const sc = statusColor[order.status] || statusColor.Processing;
                      return (
                        <div key={order.id} style={{
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          background: 'var(--bg-dark)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-md)',
                          flexWrap: 'wrap', gap: '10px',
                          transition: 'border-color var(--transition-fast)',
                        }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,207,255,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px' }}>
                              {order.id}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                              {order.date} · {order.items} items
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <span style={{
                              padding: '4px 10px',
                              background: sc.bg,
                              border: `1px solid ${sc.border}`,
                              borderRadius: '999px',
                              fontSize: '0.72rem', fontWeight: 700,
                              color: sc.text,
                            }}>{order.status}</span>
                            <span style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '0.95rem', fontWeight: 800,
                              background: 'var(--gradient-primary)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Notifications */}
                <SettingsCard title="Notifications" icon={<Bell size={17} color="var(--primary-blue)" />}>
                  {[
                    { label: 'Order Updates',        sub: 'Shipping and delivery notifications', default: true },
                    { label: 'Product Restocks',     sub: 'Alert when wishlist items are back', default: true },
                    { label: 'Promotional Emails',   sub: 'Discounts and special offers', default: false },
                    { label: 'Research Newsletter',  sub: 'Latest peptide research insights', default: true },
                  ].map(n => <ToggleRow key={n.label} {...n} />)}
                </SettingsCard>

                {/* Security */}
                <SettingsCard title="Security" icon={<ShieldCheck size={17} color="#34d399" />}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link href="/reset-password" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'var(--bg-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      transition: 'border-color var(--transition-fast)',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,207,255,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={15} color="var(--text-muted)" />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-light)' }}>
                            Change Password
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Last changed 3 months ago
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} color="var(--text-muted)" />
                    </Link>

                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'var(--bg-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldCheck size={15} color="var(--text-muted)" />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-light)' }}>
                            Two-Factor Authentication
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Add an extra layer of security
                          </div>
                        </div>
                      </div>
                      <span style={{
                        padding: '3px 10px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '999px',
                        fontSize: '0.68rem', fontWeight: 700,
                        color: '#f87171',
                      }}>Disabled</span>
                    </div>
                  </div>
                </SettingsCard>

                {/* Danger zone */}
                <div style={{
                  background: 'rgba(239,68,68,0.04)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem', fontWeight: 700,
                    color: '#f87171', marginBottom: '8px',
                  }}>Danger Zone</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button style={{
                    padding: '10px 20px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: '#f87171', fontWeight: 600, fontSize: '0.85rem',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-fast)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .account-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────── */
function SettingsCard({ title, icon, children }) {
  return (
    <div style={{
      background: 'var(--card-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 'var(--radius-md)',
          background: 'rgba(0,207,255,0.08)',
          border: '1px solid rgba(0,207,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, sub, default: defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid var(--glass-border)',
    }}>
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>
      </div>
      <div
        onClick={() => setOn(v => !v)}
        style={{
          width: 42, height: 24, borderRadius: '999px',
          background: on ? 'var(--gradient-primary)' : 'var(--card-elevated)',
          border: '1px solid var(--glass-border)',
          position: 'relative', cursor: 'pointer',
          transition: 'all var(--transition-base)', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 3, left: on ? 21 : 3,
          width: 16, height: 16,
          borderRadius: '50%', background: '#fff',
          transition: 'left var(--transition-base)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
    </div>
  );
}
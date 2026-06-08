'use client';
// src/app/account/page.js

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_CUSTOMER } from '@/lib/queries/orders';
import { useAuth } from '@/context/AuthContext';
import {
  User, Package, MapPin, Settings, ArrowRight,
  LogOut, ShieldCheck, Loader2, FlaskConical,
} from 'lucide-react';

export default function AccountPage() {
  const { isLoggedIn, user, logout, mounted } = useAuth();

  const { data, loading } = useQuery(GET_CUSTOMER, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
  });

  const customer = data?.customer;

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '16px',
            background: 'linear-gradient(135deg, #00cfff, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <FlaskConical size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>
            Researcher Account
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Sign in to access your orders, profile, and account settings.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px',
              background: 'var(--gradient-primary)',
              borderRadius: '10px',
              color: '#fff', fontWeight: 600, textDecoration: 'none',
              fontFamily: 'var(--font-body)',
            }}>
              Sign In <ArrowRight size={15} />
            </Link>
            <Link href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px',
              border: '1px solid var(--glass-border)',
              borderRadius: '10px',
              color: 'var(--text-light)', fontWeight: 600, textDecoration: 'none',
              fontFamily: 'var(--font-body)',
            }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* Header */}
        <div style={{
          background: 'var(--card-dark)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px', padding: '28px',
          marginBottom: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at left, rgba(0,207,255,0.05) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff',
            }}>
              {(customer?.firstName || user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              {loading ? (
                <Loader2 size={18} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '2px' }}>
                    {customer?.firstName
                      ? `${customer.firstName} ${customer.lastName}`
                      : user?.name || 'Researcher'}
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {customer?.email || user?.email}
                  </p>
                </>
              )}
            </div>
          </div>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '9px 18px',
            background: 'transparent',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
            color: '#f87171', fontWeight: 500, fontSize: '0.875rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
            position: 'relative', zIndex: 1,
          }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Menu grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {[
            {
              href: '/orders', Icon: Package,
              color: 'var(--primary-blue)',
              title: 'My Orders',
              desc: 'View and track your orders',
            },
            {
              href: '/account/profile', Icon: User,
              color: 'var(--purple)',
              title: 'Profile',
              desc: 'Update your name and email',
            },
            {
              href: '/account/addresses', Icon: MapPin,
              color: '#34d399',
              title: 'Addresses',
              desc: 'Manage shipping addresses',
            },
            {
              href: '/account/security', Icon: ShieldCheck,
              color: '#fbbf24',
              title: 'Security',
              desc: 'Change your password',
            },
          ].map(({ href, Icon, color, title, desc }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px', padding: '24px',
                transition: 'all 0.2s ease', cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${color}44`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.2)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '14px',
                }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '5px' }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Shipping Address Preview */}
        {customer?.shipping?.address1 && (
          <div style={{
            marginTop: '24px',
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px', padding: '24px',
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--primary-blue)" /> Default Shipping Address
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              {customer.shipping.firstName} {customer.shipping.lastName}<br />
              {customer.shipping.address1}<br />
              {customer.shipping.city}, {customer.shipping.state} {customer.shipping.postcode}<br />
              {customer.shipping.country}
            </p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

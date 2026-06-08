'use client';
// src/app/account/page.js

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_CUSTOMER, GET_ORDERS } from '@/lib/queries/orders';
import { useAuth } from '@/context/AuthContext';
import { decodePriceHtml } from '@/lib/utils';
import {
  User, Package, MapPin, Settings, ArrowRight,
  LogOut, ShieldCheck, Loader2, FlaskConical,
  Search, Truck, CheckCircle2, Clock, XCircle,
  ChevronDown, X, ShoppingCart, RotateCcw, Download,
} from 'lucide-react';

const statusConfig = {
  COMPLETED:  { label: 'Delivered',  color: '#34d399',             bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)',  Icon: CheckCircle2 },
  PROCESSING: { label: 'Processing', color: '#fbbf24',             bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', Icon: Clock },
  ON_HOLD:    { label: 'On Hold',    color: '#fbbf24',             bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', Icon: Clock },
  PENDING:    { label: 'Pending',    color: 'var(--primary-blue)', bg: 'rgba(0,207,255,0.12)',  border: 'rgba(0,207,255,0.3)',  Icon: Truck },
  CANCELLED:  { label: 'Cancelled',  color: '#f87171',             bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  Icon: XCircle },
  REFUNDED:   { label: 'Refunded',   color: '#f87171',             bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  Icon: XCircle },
  FAILED:     { label: 'Failed',     color: '#f87171',             bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  Icon: XCircle },
};

const filterOptions = ['All', 'Delivered', 'Processing', 'On Hold', 'Cancelled'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return dateStr; }
}

// ── Inline Orders Panel ──────────────────────────────────────────────────────
function OrdersPanel() {
  const { isLoggedIn } = useAuth();
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const { data, loading, error } = useQuery(GET_ORDERS, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
  });

  const orders   = data?.customer?.orders?.nodes || [];
  const filtered = orders.filter(o => {
    const sc          = statusConfig[o.status] || {};
    const statusLabel = sc.label || o.status;
    const matchFilter = filter === 'All' || statusLabel === filter;
    const matchSearch =
      o.orderNumber?.toString().includes(search) ||
      o.lineItems?.nodes?.some(li =>
        li.product?.node?.name?.toLowerCase().includes(search.toLowerCase())
      );
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ marginTop: '28px' }}>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <Package size={16} color="var(--primary-blue)" />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>My Orders</h2>
        {!loading && (
          <span style={{ marginLeft: '4px', padding: '2px 9px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.25)', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
            {orders.length}
          </span>
        )}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by order # or product…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e  => (e.target.style.borderColor = 'var(--primary-blue)')}
            onBlur={e   => (e.target.style.borderColor = 'var(--glass-border)')}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ padding: '7px 14px', borderRadius: '999px', border: `1px solid ${filter === f ? 'var(--primary-blue)' : 'var(--glass-border)'}`, background: filter === f ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)', color: filter === f ? 'var(--primary-blue)' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: filter === f ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#f87171', textAlign: 'center', fontSize: '0.88rem' }}>
          Failed to load orders. Please refresh the page.
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
          <Package size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.3 }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>
            {orders.length === 0 ? 'No orders yet' : 'No orders found'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.85rem' }}>
            {orders.length === 0 ? 'Your order history will appear here after your first purchase.' : 'Try adjusting your search or filter.'}
          </p>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 22px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
            <ShoppingCart size={13} /> Browse Shop
          </Link>
        </div>
      )}

      {/* Orders list */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(order => {
            const sc        = statusConfig[order.status] || statusConfig.PROCESSING;
            const isOpen    = expandedId === order.id;
            const lineItems = order.lineItems?.nodes || [];

            return (
              <div
                key={order.id}
                style={{ background: 'var(--card-dark)', border: `1px solid ${isOpen ? 'rgba(0,207,255,0.25)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all 0.2s ease', boxShadow: isOpen ? '0 0 20px rgba(0,207,255,0.08)' : 'none' }}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isOpen ? null : order.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', flexWrap: 'wrap', gap: '12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: `${sc.color}15`, border: `1px solid ${sc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <sc.Icon size={16} color={sc.color} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{order.orderNumber}</span>
                        <span style={{ padding: '2px 8px', background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, color: sc.color, letterSpacing: '0.04em' }}>{sc.label}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {formatDate(order.date)} · {lineItems.length} item{lineItems.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                      dangerouslySetInnerHTML={{ __html: decodePriceHtml(order.total) }}
                    />
                    <ChevronDown size={15} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--glass-border)', padding: '18px 20px' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>Items Ordered</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                      {lineItems.map((li, i) => {
                        const product   = li.product?.node;
                        const variation = li.variation?.node;
                        const attrs     = variation?.attributes?.nodes || [];
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 13px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              {product?.image?.sourceUrl
                                ? <img src={product.image.sourceUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                : <Package size={16} color="var(--text-muted)" />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product?.name || 'Product'}</div>
                              {attrs.length > 0 && (
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '3px' }}>
                                  {attrs.map((a, ai) => (
                                    <span key={ai} style={{ padding: '1px 6px', background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.2)', borderRadius: '999px', fontSize: '0.62rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                                      {a.name}: {a.value}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>Qty: {li.quantity}</div>
                            </div>
                            <div
                              style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                              dangerouslySetInnerHTML={{ __html: decodePriceHtml(li.total) }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Package size={11} /> Payment
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.paymentMethodTitle || 'N/A'}</p>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Truck size={11} /> Subtotal
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                          dangerouslySetInnerHTML={{ __html: decodePriceHtml(order.subtotal) }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {order.status === 'COMPLETED' && (
                        <button
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.color = '#fbbf24'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <RotateCcw size={12} /> Reorder
                        </button>
                      )}
                      <button
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <Download size={12} /> Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Account Page ─────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { isLoggedIn, user, logout, mounted } = useAuth();
  const [activeSection, setActiveSection] = useState('orders');

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
          <div style={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg, #00cfff, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FlaskConical size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>Researcher Account</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>Sign in to access your orders, profile, and account settings.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--gradient-primary)', borderRadius: '10px', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              Sign In <ArrowRight size={15} />
            </Link>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-light)', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'orders',    Icon: Package,     color: 'var(--primary-blue)', title: 'My Orders',  desc: 'View and track your orders' },
    { id: 'profile',   Icon: User,        color: 'var(--purple)',       title: 'Profile',    desc: 'Update your name and email',     href: '/account/profile' },
    { id: 'addresses', Icon: MapPin,      color: '#34d399',             title: 'Addresses',  desc: 'Manage shipping addresses',      href: '/account/addresses' },
    { id: 'security',  Icon: ShieldCheck, color: '#fbbf24',             title: 'Security',   desc: 'Change your password',           href: '/account/security' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* Profile header */}
        <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '28px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at left, rgba(0,207,255,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
              {(customer?.firstName || user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              {loading ? (
                <Loader2 size={18} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '2px' }}>
                    {customer?.firstName ? `${customer.firstName} ${customer.lastName}` : user?.name || 'Researcher'}
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{customer?.email || user?.email}</p>
                </>
              )}
            </div>
          </div>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#f87171', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-body)', position: 'relative', zIndex: 1 }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Menu grid — Orders card toggles inline panel, others navigate */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {menuItems.map(({ id, href, Icon, color, title, desc }) => {
            const isActive = activeSection === id && id === 'orders';
            const CardContent = (
              <div
                style={{ background: 'var(--card-dark)', border: `1px solid ${isActive ? `${color}55` : 'var(--glass-border)'}`, borderRadius: '16px', padding: '24px', transition: 'all 0.2s ease', cursor: 'pointer', boxShadow: isActive ? `0 0 18px ${color}18` : 'none', height: '100%', boxSizing: 'border-box' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.2)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isActive ? `${color}55` : 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isActive ? `0 0 18px ${color}18` : 'none'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '5px' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{desc}</p>
              </div>
            );

            // Orders card: toggle inline section
            if (id === 'orders') {
              return (
                <div key={id} onClick={() => setActiveSection(activeSection === 'orders' ? null : 'orders')}>
                  {CardContent}
                </div>
              );
            }
            // Others: navigate
            return (
              <Link key={id} href={href} style={{ textDecoration: 'none' }}>
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* Inline Orders Panel */}
        {activeSection === 'orders' && <OrdersPanel />}

        {/* Shipping Address Preview */}
        {customer?.shipping?.address1 && (
          <div style={{ marginTop: '24px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px' }}>
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
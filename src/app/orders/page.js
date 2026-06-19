'use client';
// src/app/orders/page.js

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { useAuth } from '@/context/AuthContext';
import { GET_ORDERS } from '@/lib/queries/orders';
import { decodePriceHtml } from '@/lib/utils';
import {
  Package, ChevronRight, Search, Truck,
  CheckCircle2, Clock, XCircle, ArrowRight,
  Download, RotateCcw, Eye, ChevronDown, X,
  Loader2, ShoppingCart, MapPin,
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

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const { data, loading, error } = useQuery(GET_ORDERS, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
  });

  const orders = data?.customer?.orders?.nodes || [];

  const filtered = orders.filter(o => {
    const sc = statusConfig[o.status] || {};
    const statusLabel = sc.label || o.status;
    const matchFilter = filter === 'All' || statusLabel === filter;
    const matchSearch = o.orderNumber?.toString().includes(search) ||
      o.lineItems?.nodes?.some(li => li.product?.node?.name?.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '40px' }}>
        <Package size={48} color="var(--text-muted)" style={{ opacity: 0.3 }} />
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>Sign in to view your orders</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You need to be logged in to view your order history.</p>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--gradient-primary)', borderRadius: '10px', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
          Sign In <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-blue)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            <Package size={13} /> Order History
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900 }}>
            My{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Orders</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            {loading ? 'Loading…' : `${orders.length} total order${orders.length !== 1 ? 's' : ''} · ${orders.filter(o => o.status === 'COMPLETED').length} completed`}
          </p>
        </div>
      </div>

      <div className="container">

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input type="text" placeholder="Search by order # or product…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '11px 14px 11px 40px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'} />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filterOptions.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '999px', border: `1px solid ${filter === f ? 'var(--primary-blue)' : 'var(--glass-border)'}`, background: filter === f ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)', color: filter === f ? 'var(--primary-blue)' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: filter === f ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <Loader2 size={36} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: '20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#f87171', textAlign: 'center' }}>
            Failed to load orders. Please refresh the page.
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '8px' }}>
              {orders.length === 0 ? 'No orders yet' : 'No orders found'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
              {orders.length === 0 ? 'Your order history will appear here after your first purchase.' : 'Try adjusting your search or filter.'}
            </p>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 24px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              <ShoppingCart size={14} /> Browse Shop
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map(order => {
              const sc = statusConfig[order.status] || statusConfig.PROCESSING;
              const isOpen = expandedId === order.id;
              const lineItems = order.lineItems?.nodes || [];

              return (
                <div key={order.id} style={{ background: 'var(--card-dark)', border: `1px solid ${isOpen ? 'rgba(0,207,255,0.25)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all 0.2s ease', boxShadow: isOpen ? '0 0 20px rgba(0,207,255,0.08)' : 'none' }}>

                  {/* Order header — click to expand */}
                  <div onClick={() => setExpandedId(isOpen ? null : order.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', cursor: 'pointer', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: `${sc.color}15`, border: `1px solid ${sc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <sc.Icon size={18} color={sc.color} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>#{order.orderNumber}</span>
                          <span style={{ padding: '3px 9px', background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, color: sc.color, letterSpacing: '0.04em' }}>{sc.label}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {formatDate(order.date)} · {lineItems.length} item{lineItems.length !== 1 ? 's' : ''}
                        </div>
                        {order.trackingNumber && (
                          <a href={order.trackingUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: '#34d399', fontSize: '0.76rem', fontWeight: 700, textDecoration: 'none' }}>
                            <Truck size={13} /> Track shipment →
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                        dangerouslySetInnerHTML={{ __html: decodePriceHtml(order.total) }} />
                      <ChevronDown size={16} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--glass-border)', padding: '20px 22px' }}>

                      {/* Shipment tracking — appears once ShipStation sends a tracking number */}
                      {order.trackingNumber && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', padding: '14px 16px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                          <div>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Truck size={14} /> Shipment Tracking
                            </p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>
                              {order.trackingProvider ? <span style={{ textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: 6 }}>{order.trackingProvider}</span> : null}
                              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.trackingNumber}</span>
                            </p>
                          </div>
                          {order.trackingUrl && (
                            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#34d399', color: '#04130c', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                              Track Package →
                            </a>
                          )}
                        </div>
                      )}

                      {/* Line items */}
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>Items Ordered</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        {lineItems.map((li, i) => {
                          const product = li.product?.node;
                          const variation = li.variation?.node;
                          const attrs = variation?.attributes?.nodes || [];
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                              <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {product?.image?.sourceUrl ? (
                                  <img src={product.image.sourceUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                  <Package size={18} color="var(--text-muted)" />
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{product?.name || 'Product'}</div>
                                {attrs.length > 0 && (
                                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '3px' }}>
                                    {attrs.map((a, ai) => (
                                      <span key={ai} style={{ padding: '1px 6px', background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.2)', borderRadius: '999px', fontSize: '0.65rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                                        {a.name}: {a.value}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>Qty: {li.quantity}</div>
                              </div>
                              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                dangerouslySetInnerHTML={{ __html: decodePriceHtml(li.total) }} />
                            </div>
                          );
                        })}
                      </div>

                      {/* Order meta */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                        <div style={{ padding: '14px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Package size={12} /> Payment
                          </p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{order.paymentMethodTitle || 'N/A'}</p>
                        </div>
                        <div style={{ padding: '14px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Truck size={12} /> Subtotal
                          </p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}
                            dangerouslySetInnerHTML={{ __html: decodePriceHtml(order.subtotal) }} />
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {order.status === 'COMPLETED' && (
                          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.color = '#fbbf24'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                            <RotateCcw size={13} /> Reorder
                          </button>
                        )}
                        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                          <Download size={13} /> Invoice
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
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

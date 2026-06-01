'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package, ChevronRight, Search, Filter,
  FlaskConical, Beaker, Pill, Dna, Microscope,
  Truck, CheckCircle2, Clock, XCircle,
  ArrowRight, Download, RotateCcw, Eye,
  ChevronDown, X,
} from 'lucide-react';

/* ── Mock orders data ────────────────────────────────────── */
const allOrders = [
  {
    id: 'DP-48291',
    date: 'May 20, 2026',
    status: 'Delivered',
    total: 129.97,
    items: [
      { name: 'BPC-157',     qty: 2, price: 49.99, Icon: FlaskConical, color: 'var(--primary-blue)' },
      { name: 'CJC-1295',   qty: 1, price: 54.99, Icon: Dna,          color: '#34d399' },
    ],
    tracking: 'UPS-1Z999AA10123456784',
    address: '123 Research Blvd, New York, NY 10001',
  },
  {
    id: 'DP-47103',
    date: 'May 05, 2026',
    status: 'Processing',
    total: 79.99,
    items: [
      { name: 'Semaglutide', qty: 1, price: 79.99, Icon: Pill, color: 'var(--pink)' },
    ],
    tracking: null,
    address: '123 Research Blvd, New York, NY 10001',
  },
  {
    id: 'DP-45887',
    date: 'Apr 18, 2026',
    status: 'Delivered',
    total: 164.97,
    items: [
      { name: 'TB-500',      qty: 2, price: 59.99, Icon: Beaker,      color: 'var(--purple)' },
      { name: 'Ipamorelin',  qty: 1, price: 44.99, Icon: Microscope,  color: 'var(--primary-blue)' },
    ],
    tracking: 'UPS-1Z999AA10987654321',
    address: '123 Research Blvd, New York, NY 10001',
  },
  {
    id: 'DP-44201',
    date: 'Mar 30, 2026',
    status: 'Shipped',
    total: 49.99,
    items: [
      { name: 'BPC-157', qty: 1, price: 49.99, Icon: FlaskConical, color: 'var(--primary-blue)' },
    ],
    tracking: 'FDX-784513278900',
    address: '123 Research Blvd, New York, NY 10001',
  },
  {
    id: 'DP-42980',
    date: 'Mar 10, 2026',
    status: 'Cancelled',
    total: 94.99,
    items: [
      { name: 'Follistatin', qty: 1, price: 94.99, Icon: Dna, color: '#fbbf24' },
    ],
    tracking: null,
    address: '123 Research Blvd, New York, NY 10001',
  },
];

const statusConfig = {
  Delivered:  { color: '#34d399',              bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)',  Icon: CheckCircle2 },
  Processing: { color: '#fbbf24',              bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', Icon: Clock },
  Shipped:    { color: 'var(--primary-blue)', bg: 'rgba(0,207,255,0.12)',  border: 'rgba(0,207,255,0.3)',  Icon: Truck },
  Cancelled:  { color: '#f87171',             bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  Icon: XCircle },
};

const filterOptions = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled'];

export default function OrdersPage() {
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = allOrders.filter(o => {
    const matchFilter = filter === 'All' || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
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
            <Package size={13} /> Order History
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900,
          }}>
            My{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Orders</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            {allOrders.length} total orders · {allOrders.filter(o => o.status === 'Delivered').length} delivered
          </p>
        </div>
      </div>

      <div className="container">

        {/* ── Search + Filter ── */}
        <div style={{
          display: 'flex', gap: '12px',
          flexWrap: 'wrap', marginBottom: '28px',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={15} style={{
              position: 'absolute', left: '13px', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search by order ID or product…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '11px 14px 11px 40px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex',
              }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filterOptions.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: `1px solid ${filter === f ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                background: filter === f ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)',
                color: filter === f ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: filter === f ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all var(--transition-fast)',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* ── Orders List ── */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: 'var(--card-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '8px' }}>
              No orders found
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Try adjusting your search or filter.
            </p>
            <Link href="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '11px 24px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fff', fontWeight: 600,
              textDecoration: 'none', fontFamily: 'var(--font-body)',
            }}>
              Browse Shop <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map(order => {
              const sc   = statusConfig[order.status] || statusConfig.Processing;
              const isOpen = expandedId === order.id;

              return (
                <div key={order.id} style={{
                  background: 'var(--card-dark)',
                  border: `1px solid ${isOpen ? 'rgba(0,207,255,0.25)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  transition: 'all var(--transition-base)',
                  boxShadow: isOpen ? '0 0 20px rgba(0,207,255,0.08)' : 'none',
                }}>

                  {/* ── Order Header ── */}
                  <div
                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 22px',
                      cursor: 'pointer', flexWrap: 'wrap', gap: '12px',
                    }}
                  >
                    {/* Left info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 'var(--radius-md)',
                        background: `${sc.color}15`,
                        border: `1px solid ${sc.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <sc.Icon size={18} color={sc.color} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.id}</span>
                          <span style={{
                            padding: '3px 9px',
                            background: sc.bg,
                            border: `1px solid ${sc.border}`,
                            borderRadius: '999px',
                            fontSize: '0.68rem', fontWeight: 700,
                            color: sc.color, letterSpacing: '0.04em',
                          }}>{order.status}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {order.date} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Right: total + expand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem', fontWeight: 900,
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>${order.total.toFixed(2)}</span>
                      <ChevronDown size={16} color="var(--text-muted)" style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform var(--transition-base)',
                        flexShrink: 0,
                      }} />
                    </div>
                  </div>

                  {/* ── Expanded Details ── */}
                  {isOpen && (
                    <div style={{
                      borderTop: '1px solid var(--glass-border)',
                      padding: '20px 22px',
                    }}>
                      {/* Items */}
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{
                          fontSize: '0.75rem', fontWeight: 700,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.07em',
                          marginBottom: '12px',
                        }}>Items Ordered</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items.map(item => (
                            <div key={item.name} style={{
                              display: 'flex', alignItems: 'center',
                              gap: '12px', padding: '12px 14px',
                              background: 'var(--bg-dark)',
                              border: '1px solid var(--glass-border)',
                              borderRadius: 'var(--radius-md)',
                            }}>
                              <div style={{
                                width: 36, height: 36, flexShrink: 0,
                                borderRadius: 'var(--radius-sm)',
                                background: `${item.color}15`,
                                border: `1px solid ${item.color}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <item.Icon size={16} color={item.color} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Qty: {item.qty}</div>
                              </div>
                              <div style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.9rem', fontWeight: 700,
                                background: 'var(--gradient-primary)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                              }}>${(item.price * item.qty).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tracking + address */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '14px',
                        marginBottom: '20px',
                      }}>
                        <div style={{
                          padding: '14px',
                          background: 'var(--bg-dark)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-md)',
                        }}>
                          <p style={{
                            fontSize: '0.72rem', fontWeight: 700,
                            color: 'var(--text-muted)', textTransform: 'uppercase',
                            letterSpacing: '0.07em', marginBottom: '8px',
                            display: 'flex', alignItems: 'center', gap: '5px',
                          }}>
                            <Truck size={12} /> Tracking
                          </p>
                          {order.tracking ? (
                            <p style={{ fontSize: '0.82rem', color: 'var(--primary-blue)', fontWeight: 500 }}>
                              {order.tracking}
                            </p>
                          ) : (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              Not yet available
                            </p>
                          )}
                        </div>

                        <div style={{
                          padding: '14px',
                          background: 'var(--bg-dark)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-md)',
                        }}>
                          <p style={{
                            fontSize: '0.72rem', fontWeight: 700,
                            color: 'var(--text-muted)', textTransform: 'uppercase',
                            letterSpacing: '0.07em', marginBottom: '8px',
                            display: 'flex', alignItems: 'center', gap: '5px',
                          }}>
                            <Package size={12} /> Shipping To
                          </p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {order.address}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <Link href={`/product/1`} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '9px 18px',
                          background: 'var(--gradient-primary)',
                          borderRadius: 'var(--radius-md)',
                          color: '#fff', fontWeight: 600, fontSize: '0.82rem',
                          textDecoration: 'none', fontFamily: 'var(--font-body)',
                        }}>
                          <Eye size={13} /> View Details
                        </Link>

                        <button style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '9px 18px',
                          background: 'transparent',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.82rem',
                          cursor: 'pointer', fontFamily: 'var(--font-body)',
                          transition: 'all var(--transition-fast)',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <Download size={13} /> Download Invoice
                        </button>

                        {order.status === 'Delivered' && (
                          <button style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '9px 18px',
                            background: 'transparent',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.82rem',
                            cursor: 'pointer', fontFamily: 'var(--font-body)',
                            transition: 'all var(--transition-fast)',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)'; e.currentTarget.style.color = '#fbbf24'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                          >
                            <RotateCcw size={13} /> Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
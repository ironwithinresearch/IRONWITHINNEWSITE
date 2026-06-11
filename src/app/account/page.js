'use client';
// src/app/account/page.js

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { GET_CUSTOMER, GET_ORDERS } from '@/lib/queries/orders';
import { UPDATE_CUSTOMER } from '@/lib/queries/auth';
import { useAuth } from '@/context/AuthContext';
import { decodePriceHtml } from '@/lib/utils';
import {
  User, Package, MapPin, Settings, ArrowRight,
  LogOut, ShieldCheck, Loader2, FlaskConical,
  Search, Truck, CheckCircle2, Clock, XCircle,
  ChevronDown, X, ShoppingCart, RotateCcw, Download,
  Save, Eye, EyeOff, CheckCircle, AlertCircle,
} from 'lucide-react';

/* ─────────────────────── helpers ─────────────────────────── */
const statusConfig = {
  COMPLETED:  { label: 'Delivered',  color: '#34d399',           bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)',  Icon: CheckCircle2 },
  PROCESSING: { label: 'Processing', color: '#fbbf24',           bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', Icon: Clock },
  ON_HOLD:    { label: 'On Hold',    color: '#fbbf24',           bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', Icon: Clock },
  PENDING:    { label: 'Pending',    color: 'var(--primary-blue)', bg: 'rgba(0,207,255,0.12)', border: 'rgba(0,207,255,0.3)', Icon: Truck },
  CANCELLED:  { label: 'Cancelled',  color: '#f87171',           bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  Icon: XCircle },
  REFUNDED:   { label: 'Refunded',   color: '#f87171',           bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  Icon: XCircle },
  FAILED:     { label: 'Failed',     color: '#f87171',           bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  Icon: XCircle },
};
const filterOptions = ['All', 'Delivered', 'Processing', 'On Hold', 'Cancelled'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return dateStr; }
}

/* ── shared input style ── */
const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: 'var(--bg-dark)',
  border: '1px solid var(--glass-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-light)',
  fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
};
const labelStyle = {
  display: 'block',
  fontSize: '0.72rem', fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.07em',
  marginBottom: '6px',
};
const sectionHeadStyle = {
  fontFamily: 'var(--font-heading)', fontSize: '0.82rem', fontWeight: 700,
  color: 'var(--text-muted)', textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: '14px',
  paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)',
};

/* ── Toast / inline alert ── */
function Alert({ type, msg }) {
  if (!msg) return null;
  const ok = type === 'success';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '12px 16px', borderRadius: 'var(--radius-md)',
      background: ok ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
      border: `1px solid ${ok ? 'rgba(52,211,153,0.35)' : 'rgba(239,68,68,0.35)'}`,
      color: ok ? '#34d399' : '#f87171',
      fontSize: '0.84rem', marginBottom: '18px',
    }}>
      {ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  ORDERS PANEL                                              */
/* ══════════════════════════════════════════════════════════ */
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
          <input type="text" placeholder="Search by order # or product…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, padding: '10px 14px 10px 38px' }}
            onFocus={e => (e.target.style.borderColor = 'var(--primary-blue)')}
            onBlur={e => (e.target.style.borderColor = 'var(--glass-border)')}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {filterOptions.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '7px 14px', borderRadius: '999px', border: `1px solid ${filter === f ? 'var(--primary-blue)' : 'var(--glass-border)'}`, background: filter === f ? 'rgba(0,207,255,0.1)' : 'var(--card-dark)', color: filter === f ? 'var(--primary-blue)' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: filter === f ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >{f}</button>
          ))}
        </div>
      </div>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Loader2 size={32} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} /></div>}
      {error   && <div style={{ padding: '18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#f87171', textAlign: 'center', fontSize: '0.88rem' }}>Failed to load orders. Please refresh the page.</div>}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
          <Package size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.3 }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>{orders.length === 0 ? 'No orders yet' : 'No orders found'}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.85rem' }}>{orders.length === 0 ? 'Your order history will appear here after your first purchase.' : 'Try adjusting your search or filter.'}</p>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 22px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
            <ShoppingCart size={13} /> Browse Shop
          </Link>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(order => {
            const sc      = statusConfig[order.status] || statusConfig.PROCESSING;
            const isOpen  = expandedId === order.id;
            const lineItems = order.lineItems?.nodes || [];
            return (
              <div key={order.id} style={{ background: 'var(--card-dark)', border: `1px solid ${isOpen ? 'rgba(0,207,255,0.25)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all 0.2s ease', boxShadow: isOpen ? '0 0 20px rgba(0,207,255,0.08)' : 'none' }}>
                <div onClick={() => setExpandedId(isOpen ? null : order.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: `${sc.color}15`, border: `1px solid ${sc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <sc.Icon size={16} color={sc.color} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{order.orderNumber}</span>
                        <span style={{ padding: '2px 8px', background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, color: sc.color, letterSpacing: '0.04em' }}>{sc.label}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatDate(order.date)} · {lineItems.length} item{lineItems.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} dangerouslySetInnerHTML={{ __html: decodePriceHtml(order.total) }} />
                    <ChevronDown size={15} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                  </div>
                </div>

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
                              {product?.image?.sourceUrl ? <img src={product.image.sourceUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={16} color="var(--text-muted)" />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product?.name || 'Product'}</div>
                              {attrs.length > 0 && (
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '3px' }}>
                                  {attrs.map((a, ai) => <span key={ai} style={{ padding: '1px 6px', background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.2)', borderRadius: '999px', fontSize: '0.62rem', color: 'var(--primary-blue)', fontWeight: 600 }}>{a.name}: {a.value}</span>)}
                                </div>
                              )}
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>Qty: {li.quantity}</div>
                            </div>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} dangerouslySetInnerHTML={{ __html: decodePriceHtml(li.total) }} />
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={11} /> Payment</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.paymentMethodTitle || 'N/A'}</p>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><Truck size={11} /> Subtotal</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: decodePriceHtml(order.subtotal) }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {order.status === 'COMPLETED' && (
                        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.color = '#fbbf24'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                          <RotateCcw size={12} /> Reorder
                        </button>
                      )}
                      <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
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

/* ══════════════════════════════════════════════════════════ */
/*  PROFILE PANEL                                             */
/* ══════════════════════════════════════════════════════════ */
function ProfilePanel({ customer, refetch }) {
  const { token } = useAuth();

  const [form, setForm] = useState({
    firstName:        customer?.firstName        || '',
    lastName:         customer?.lastName         || '',
    email:            customer?.email            || '',
    phone:            customer?.billing?.phone   || '',
    // billing
    billingAddress1:  customer?.billing?.address1  || '',
    billingAddress2:  customer?.billing?.address2  || '',
    billingCity:      customer?.billing?.city      || '',
    billingState:     customer?.billing?.state     || '',
    billingPostcode:  customer?.billing?.postcode  || '',
    billingCountry:   customer?.billing?.country   || '',
    // shipping
    shipFirstName:    customer?.shipping?.firstName || '',
    shipLastName:     customer?.shipping?.lastName  || '',
    shippingAddress1: customer?.shipping?.address1  || '',
    shippingAddress2: customer?.shipping?.address2  || '',
    shippingCity:     customer?.shipping?.city      || '',
    shippingState:    customer?.shipping?.state     || '',
    shippingPostcode: customer?.shipping?.postcode  || '',
    shippingCountry:  customer?.shipping?.country   || '',
  });

  const [alert, setAlert]   = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  // Strip empty strings — WPGraphQL CountriesEnum rejects ""
  function cleanAddr(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== '' && v != null)
    );
  }

  async function handleSave() {
    setSaving(true);
    setAlert({ type: '', msg: '' });
    try {
      const billing = cleanAddr({
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        phone:     form.phone,
        address1:  form.billingAddress1,
        address2:  form.billingAddress2,
        city:      form.billingCity,
        state:     form.billingState,
        postcode:  form.billingPostcode,
        country:   form.billingCountry,
      });
      const shipping = cleanAddr({
        firstName: form.shipFirstName || form.firstName,
        lastName:  form.shipLastName  || form.lastName,
        address1:  form.shippingAddress1,
        address2:  form.shippingAddress2,
        city:      form.shippingCity,
        state:     form.shippingState,
        postcode:  form.shippingPostcode,
        country:   form.shippingCountry,
      });

      await updateCustomer({
        variables: {
          input: {
            firstName: form.firstName,
            lastName:  form.lastName,
            email:     form.email,
            billing,
            shipping,
          },
        },
        context: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
      setAlert({ type: 'success', msg: 'Profile updated successfully!' });
      if (refetch) refetch();
    } catch (err) {
      setAlert({ type: 'error', msg: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <User size={16} color="var(--purple)" />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>Edit Profile</h2>
      </div>

      <Alert type={alert.type} msg={alert.msg} />

      {/* ── Personal Info ── */}
      <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: '16px' }}>
        <p style={sectionHeadStyle}>Personal Information</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="First Name" value={form.firstName} onChange={set('firstName')} />
          <Field label="Last Name"  value={form.lastName}  onChange={set('lastName')} />
          <Field label="Email Address" value={form.email}  onChange={set('email')}  type="email" colSpan />
          <Field label="Phone Number"  value={form.phone}  onChange={set('phone')}  type="tel"   colSpan />
        </div>
      </div>

      {/* ── Billing Address ── */}
      <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: '16px' }}>
        <p style={sectionHeadStyle}>Billing Address</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Address Line 1" value={form.billingAddress1} onChange={set('billingAddress1')} colSpan />
          <Field label="Address Line 2" value={form.billingAddress2} onChange={set('billingAddress2')} colSpan placeholder="Apartment, suite, etc. (optional)" />
          <Field label="City"    value={form.billingCity}     onChange={set('billingCity')} />
          <Field label="State"   value={form.billingState}    onChange={set('billingState')} />
          <Field label="Postcode / ZIP" value={form.billingPostcode} onChange={set('billingPostcode')} />
          <CountrySelect label="Country" value={form.billingCountry} onChange={set('billingCountry')} />
        </div>
      </div>

      {/* ── Shipping Address ── */}
      <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: '24px' }}>
        <p style={sectionHeadStyle}>Shipping Address</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="First Name" value={form.shipFirstName} onChange={set('shipFirstName')} />
          <Field label="Last Name"  value={form.shipLastName}  onChange={set('shipLastName')} />
          <Field label="Address Line 1" value={form.shippingAddress1} onChange={set('shippingAddress1')} colSpan />
          <Field label="Address Line 2" value={form.shippingAddress2} onChange={set('shippingAddress2')} colSpan placeholder="Apartment, suite, etc. (optional)" />
          <Field label="City"    value={form.shippingCity}     onChange={set('shippingCity')} />
          <Field label="State"   value={form.shippingState}    onChange={set('shippingState')} />
          <Field label="Postcode / ZIP" value={form.shippingPostcode} onChange={set('shippingPostcode')} />
          <CountrySelect label="Country" value={form.shippingCountry} onChange={set('shippingCountry')} />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '12px 28px',
        background: saving ? 'var(--glass-border)' : 'var(--gradient-primary)',
        border: 'none', borderRadius: 'var(--radius-md)',
        color: '#fff', fontWeight: 700, fontSize: '0.88rem',
        cursor: saving ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-body)',
        transition: 'opacity 0.15s ease',
        opacity: saving ? 0.7 : 1,
      }}>
        {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}

/* ── Country codes (WPGraphQL CountriesEnum) ── */
const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' }, { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' },
  { code: 'BD', name: 'Bangladesh' }, { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' }, { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'HR', name: 'Croatia' },
  { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' },
  { code: 'EG', name: 'Egypt' }, { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' }, { code: 'GR', name: 'Greece' },
  { code: 'HK', name: 'Hong Kong' }, { code: 'HU', name: 'Hungary' },
  { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' },
  { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' }, { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' }, { code: 'KE', name: 'Kenya' },
  { code: 'KW', name: 'Kuwait' }, { code: 'LB', name: 'Lebanon' },
  { code: 'MY', name: 'Malaysia' }, { code: 'MX', name: 'Mexico' },
  { code: 'MA', name: 'Morocco' }, { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' }, { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' }, { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' }, { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russia' },
  { code: 'SA', name: 'Saudi Arabia' }, { code: 'SG', name: 'Singapore' },
  { code: 'ZA', name: 'South Africa' }, { code: 'KR', name: 'South Korea' },
  { code: 'ES', name: 'Spain' }, { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' }, { code: 'TW', name: 'Taiwan' },
  { code: 'TH', name: 'Thailand' }, { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' }, { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' },
  { code: 'VN', name: 'Vietnam' }, { code: 'YE', name: 'Yemen' },
];

/* ── tiny reusable field ── */
function Field({ label, value, onChange, type = 'text', colSpan, placeholder }) {
  return (
    <div style={{ gridColumn: colSpan ? '1 / -1' : undefined }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder || label}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'var(--primary-blue)')}
        onBlur={e => (e.target.style.borderColor = 'var(--glass-border)')}
      />
    </div>
  );
}

/* ── country select ── */
function CountrySelect({ label, value, onChange, colSpan }) {
  return (
    <div style={{ gridColumn: colSpan ? '1 / -1' : undefined }}>
      <label style={labelStyle}>{label}</label>
      <select
        value={value} onChange={onChange}
        style={{
          ...inputStyle,
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: '36px',
          cursor: 'pointer',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--primary-blue)')}
        onBlur={e => (e.target.style.borderColor = 'var(--glass-border)')}
      >
        <option value="">Select country…</option>
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  SECURITY PANEL  (change password)                        */
/* ══════════════════════════════════════════════════════════ */
function SecurityPanel({ customer }) {
  const { token } = useAuth();

  const [form, setForm]     = useState({ current: '', newPw: '', confirm: '' });
  const [show, setShow]     = useState({ current: false, newPw: false, confirm: false });
  const [alert, setAlert]   = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const tog = (k) => () => setShow(s => ({ ...s, [k]: !s[k] }));

  async function handleChangePassword() {
    setAlert({ type: '', msg: '' });

    if (!form.newPw || form.newPw.length < 8)
      return setAlert({ type: 'error', msg: 'New password must be at least 8 characters.' });
    if (form.newPw !== form.confirm)
      return setAlert({ type: 'error', msg: 'Passwords do not match.' });

    setSaving(true);
    try {
      await updateCustomer({
        variables: { input: { password: form.newPw } },
        context: { headers: { Authorization: `Bearer ${token}` } },
      });
      setAlert({ type: 'success', msg: 'Password changed successfully!' });
      setForm({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      setAlert({ type: 'error', msg: err.message || 'Failed to change password.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <ShieldCheck size={16} color="#fbbf24" />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>Security</h2>
      </div>

      <Alert type={alert.type} msg={alert.msg} />

      <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '24px', maxWidth: 480 }}>
        <p style={sectionHeadStyle}>Change Password</p>

        {/* Current password */}
        {/* <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Current Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={show.current ? 'text' : 'password'}
              value={form.current} onChange={set('current')}
              placeholder="Enter current password"
              style={{ ...inputStyle, paddingRight: '40px' }}
              onFocus={e => (e.target.style.borderColor = 'var(--primary-blue)')}
              onBlur={e => (e.target.style.borderColor = 'var(--glass-border)')}
            />
            <button onClick={tog('current')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              {show.current ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div> */}

        {/* New password */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={show.newPw ? 'text' : 'password'}
              value={form.newPw} onChange={set('newPw')}
              placeholder="Min. 8 characters"
              style={{ ...inputStyle, paddingRight: '40px' }}
              onFocus={e => (e.target.style.borderColor = 'var(--primary-blue)')}
              onBlur={e => (e.target.style.borderColor = 'var(--glass-border)')}
            />
            <button onClick={tog('newPw')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              {show.newPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* strength bar */}
          {form.newPw && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
              {[1,2,3,4].map(i => {
                const len = form.newPw.length;
                const hasUpper = /[A-Z]/.test(form.newPw);
                const hasNum   = /[0-9]/.test(form.newPw);
                const hasSpec  = /[^A-Za-z0-9]/.test(form.newPw);
                const strength = (len >= 8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpec ? 1 : 0);
                const color = strength <= 1 ? '#f87171' : strength === 2 ? '#fbbf24' : strength === 3 ? '#60a5fa' : '#34d399';
                return <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? color : 'var(--glass-border)', transition: 'background 0.2s' }} />;
              })}
            </div>
          )}
        </div>

        {/* Confirm */}
        <div style={{ marginBottom: '22px' }}>
          <label style={labelStyle}>Confirm New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={show.confirm ? 'text' : 'password'}
              value={form.confirm} onChange={set('confirm')}
              placeholder="Repeat new password"
              style={{
                ...inputStyle, paddingRight: '40px',
                borderColor: form.confirm && form.confirm !== form.newPw ? '#f87171' : 'var(--glass-border)',
              }}
              onFocus={e => (e.target.style.borderColor = form.confirm !== form.newPw ? '#f87171' : 'var(--primary-blue)')}
              onBlur={e => (e.target.style.borderColor = form.confirm && form.confirm !== form.newPw ? '#f87171' : 'var(--glass-border)')}
            />
            <button onClick={tog('confirm')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {form.confirm && form.confirm !== form.newPw && (
            <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '5px' }}>Passwords do not match</p>
          )}
        </div>

        <button onClick={handleChangePassword} disabled={saving} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 28px',
          background: saving ? 'var(--glass-border)' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          border: 'none', borderRadius: 'var(--radius-md)',
          color: '#fff', fontWeight: 700, fontSize: '0.88rem',
          cursor: saving ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-body)',
          opacity: saving ? 0.7 : 1,
        }}>
          {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={15} />}
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  MAIN ACCOUNT PAGE                                         */
/* ══════════════════════════════════════════════════════════ */
export default function AccountPage() {
  const { isLoggedIn, user, logout, mounted } = useAuth();
  const [activeSection, setActiveSection]     = useState('orders');

  const { data, loading, refetch } = useQuery(GET_CUSTOMER, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
  });

  const customer = data?.customer;

  if (!mounted) return null;

  /* ── Not logged in ── */
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

  /* ── Menu items — all toggle inline now ── */
  const menuItems = [
    { id: 'orders',   Icon: Package,     color: 'var(--primary-blue)', title: 'My Orders',  desc: 'View and track your orders' },
    { id: 'profile',  Icon: User,        color: 'var(--purple)',       title: 'Profile',    desc: 'Update your name and email' },
    { id: 'security', Icon: ShieldCheck, color: '#fbbf24',             title: 'Security',   desc: 'Change your password' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* ── Profile header ── */}
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

        {/* ── Menu grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {menuItems.map(({ id, Icon, color, title, desc }) => {
            const isActive = activeSection === id;
            return (
              <div key={id} onClick={() => setActiveSection(isActive ? null : id)} style={{ cursor: 'pointer' }}>
                <div style={{
                  background: 'var(--card-dark)',
                  border: `1px solid ${isActive ? `${color}55` : 'var(--glass-border)'}`,
                  borderRadius: '16px', padding: '24px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 0 18px ${color}18` : 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.2)`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isActive ? `${color}55` : 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isActive ? `0 0 18px ${color}18` : 'none'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon size={20} color={color} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '5px' }}>{title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Inline Panels ── */}
        {activeSection === 'orders'   && <OrdersPanel />}
        {activeSection === 'profile'  && <ProfilePanel customer={customer} refetch={refetch} />}
        {activeSection === 'security' && <SecurityPanel customer={customer} />}

      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
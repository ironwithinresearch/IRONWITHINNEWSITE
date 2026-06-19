'use client';
// src/app/product/[slug]/page.js
// NOTE: Rename folder from [id] to [slug]

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT } from '@/lib/queries/products';
import { getCoa } from '@/data/coas';
import { useCart } from '@/context/CartContext';
import GuaranteeBadge from '@/components/GuaranteeBadge';
import {
  FlaskConical, ShoppingCart, Heart, ChevronRight,
  Shield, Truck, BadgeCheck, Minus, Plus,
  Loader2, CheckCircle2, AlertCircle, Info, Package,
  FileText, Download,
} from 'lucide-react';

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [selectedDose, setSelectedDose] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [cartError, setCartError] = useState('');
  const [subscribe, setSubscribe] = useState(false);   // Subscribe & Save
  const [subCadence, setSubCadence] = useState(30);

  // The gift card has a dedicated page; never show it on the generic product page.
  useEffect(() => {
    if (slug === 'gift-card') router.replace('/gift-cards');
  }, [slug, router]);

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { slug },
    skip: !slug,
    // Bypass the normalized cache: WooGraphQL variation attributes collide in
    // Apollo's cache and collapse across variations, which broke dose/quantity
    // price resolution. The raw network response keeps each variation intact.
    fetchPolicy: 'no-cache',
  });

  const product = data?.product;
  const coa = getCoa(slug);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={36} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <AlertCircle size={40} color="#f87171" />
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>Product not found</h2>
        <Link href="/shop" style={{ color: 'var(--primary-blue)' }}>← Back to Shop</Link>
      </div>
    );
  }

  const isVariable = product.__typename === 'VariableProduct';
  const variations = product.variations?.nodes || [];
  const images = [
    product.image?.sourceUrl,
    ...(product.galleryImages?.nodes?.map(g => g.sourceUrl) || []),
  ].filter(Boolean);

  // ---- Dose + volume-tier model (matches the legacy ironwithinlabs UX) ----
  // Doses come from the "variant-options" attribute (e.g. 10mg/15mg/30mg).
  // The "bundle-save" attribute holds quantity tiers (1-unit / 2-units / 3-units),
  // each already priced with its volume discount baked in. We show dose buttons +
  // a quantity stepper, and auto-select the tier-variation matching the quantity.
  const money = (n) => '$' + (Number.isFinite(n) ? n.toFixed(2) : '0.00');
  const parseNum = (s) => {
    if (s == null) return NaN;
    const n = parseFloat(String(s).replace(/&nbsp;|&#160;|,/g, '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : NaN;
  };
  const valsOf = (v) => (v.attributes?.nodes || []).map(a => a.value || '');
  const doseOf = (v) => valsOf(v).find(x => /\d\s*mg/i.test(x)) || '';
  const tierOf = (v) => valsOf(v).find(x => /unit/i.test(x)) || '';
  const doseNum = (d) => { const m = String(d).match(/(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : 9999; };

  const doses = isVariable
    ? [...new Set(variations.map(doseOf).filter(Boolean))].sort((a, b) => doseNum(a) - doseNum(b))
    : [];
  const hasDoses = doses.length > 0;
  const hasTiers = isVariable && variations.some(v => tierOf(v));
  const doseInStock = (d) => variations.some(v => doseOf(v) === d && v.stockStatus === 'IN_STOCK');
  const effectiveDose = hasDoses ? (selectedDose || doses.find(doseInStock) || doses[0]) : null;

  const poolFor = (d) => hasDoses ? variations.filter(v => doseOf(v) === d) : variations.slice();
  // Quantity tiers selected by PRICE RANK, not by attribute text: variation
  // attributes can collapse through the GraphQL cache, but per-variation prices
  // stay distinct. 1-unit (standard) is the most expensive; more units = cheaper
  // per unit. So sort a dose's variations by price DESC and map quantity to rank.
  const pricedSorted = (d) => poolFor(d)
    .filter(v => !isNaN(parseNum(v.price)))
    .sort((a, b) => parseNum(b.price) - parseNum(a.price));
  function pickVariation(d) {
    if (!isVariable) return null;
    const pool = poolFor(d);
    if (!pool.length) return null;
    const ps = pricedSorted(d);
    if (!ps.length) return pool[0];
    const idx = Math.min(Math.max(qty, 1) - 1, ps.length - 1);
    return ps[idx];
  }
  const resolvedVariation = pickVariation(effectiveDose);
  const doseTiers = isVariable ? pricedSorted(effectiveDose) : [];
  // Two structures supported during migration:
  //  • dose-only (1 variation/dose): volume discount applied by quantity here +
  //    server-side by the IW Volume Pricing mu-plugin (2.5% @2, 5% @3+).
  //  • legacy tiers (>1 variation/dose): discount is baked into the tier prices,
  //    picked by price rank above.
  const volPct = qty >= 3 ? 0.05 : qty >= 2 ? 0.025 : 0;
  const isDoseOnly = isVariable && doseTiers.length <= 1;

  let unitPrice, basePrice;
  if (!isVariable) {
    unitPrice = parseNum(product.price);
    basePrice = parseNum(product.regularPrice || product.price);
  } else if (isDoseOnly) {
    basePrice = parseNum(resolvedVariation?.price);
    unitPrice = volPct > 0 && Number.isFinite(basePrice)
      ? Math.round(basePrice * (1 - volPct) * 100) / 100
      : basePrice;
  } else {
    unitPrice = parseNum(resolvedVariation?.price);
    basePrice = parseNum(doseTiers[0]?.price);
  }
  const totalPrice = (Number.isFinite(unitPrice) ? unitPrice : 0) * qty * (subscribe ? 0.9 : 1);
  const savePct = (Number.isFinite(basePrice) && Number.isFinite(unitPrice) && basePrice > unitPrice + 0.001)
    ? Math.round((1 - unitPrice / basePrice) * 100) : 0;
  // Regular (pre-sale) unit price, to show struck-through when on a site-wide sale
  const regularUnit = isVariable
    ? parseNum(resolvedVariation?.regularPrice)
    : parseNum(product.regularPrice);
  const onSale = !!product.onSale && Number.isFinite(regularUnit) && regularUnit > unitPrice + 0.001;

  const inStock = isVariable
    ? (resolvedVariation ? resolvedVariation.stockStatus === 'IN_STOCK' : variations.some(v => v.stockStatus === 'IN_STOCK'))
    : product.stockStatus === 'IN_STOCK';

  // Live vial count for the selected dose (null = untracked)
  const stockQty = isVariable ? resolvedVariation?.stockQuantity : product.stockQuantity;
  const hasCount = Number.isFinite(stockQty);

  const handleAddToCart = async () => {
    setCartError('');

    if (isVariable && !resolvedVariation) {
      setCartError('Please select a dose before adding to cart.');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(
      product.databaseId,
      qty,
      resolvedVariation?.databaseId || null,
      subscribe ? { iw_subscribe: String(subCadence) } : null   // tags the cart item as a subscription
    );
    setAddingToCart(false);

    if (result?.success !== false) {
      // Subscribe & Save: the item is tagged via extraData above; the 10% comes
      // from a server-side price override (no coupon).
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } else {
      setCartError(result.error || 'Failed to add to cart. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '32px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shop</Link>
          {product.productCategories?.nodes?.[0] && (
            <>
              <ChevronRight size={13} />
              <Link href="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                {product.productCategories.nodes[0].name}
              </Link>
            </>
          )}
          <ChevronRight size={13} />
          <span style={{ color: 'var(--primary-blue)' }}>{product.name}</span>
        </nav>

        {/* Main layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px', marginBottom: '64px', alignItems: 'start',
        }}>

          {/* ── Left: Images ── */}
          <div>
            <div style={{
              background: 'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: '320px', marginBottom: '12px', overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,207,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
              {images[0] ? (
                <img src={images[0]} alt={product.image?.altText || product.name}
                  style={{ maxHeight: '280px', objectFit: 'contain', position: 'relative', zIndex: 1, padding: '16px' }} />
              ) : (
                <FlaskConical size={80} color="var(--primary-blue)" style={{ opacity: 0.3 }} />
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {images.map((src, i) => (
                  <div key={i} style={{ width: 64, height: 64, borderRadius: '10px', border: '1px solid var(--glass-border)', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-elevated)' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
              {[
                { Icon: Shield, label: 'Lab Verified', sub: '3rd-party tested' },
                { Icon: Truck, label: 'Fast Shipping', sub: 'Ships in 24–48hrs' },
              ].map(t => (
                <div key={t.label} style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' }}>
                  <t.Icon size={18} color="var(--primary-blue)" style={{ margin: '0 auto 6px', display: 'block' }} />
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '2px' }}>{t.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {product.productCategories?.nodes?.[0] && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.25)', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary-blue)', width: 'fit-content' }}>
                <FlaskConical size={11} />{product.productCategories.nodes[0].name}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1 }}>{product.name}</h1>
                <BadgeCheck size={22} color="var(--primary-blue)" />
              </div>
              {product.sku && <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>SKU: {product.sku}</p>}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {Number.isFinite(unitPrice) ? money(subscribe ? unitPrice * 0.9 : unitPrice) : 'Contact for price'}
              </span>
              {isVariable && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ unit</span>}
              {subscribe && Number.isFinite(unitPrice) ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem', textDecoration: 'line-through' }}>{money(unitPrice)}</span>
              ) : onSale ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem', textDecoration: 'line-through' }}>{money(regularUnit)}</span>
              ) : null}
              {subscribe ? (
                <span style={{ padding: '3px 10px', background: 'rgba(0,207,255,0.14)', border: '1px solid rgba(0,207,255,0.35)', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                  🔁 Subscribe &amp; Save
                </span>
              ) : savePct > 0 ? (
                <span style={{ padding: '3px 10px', background: 'rgba(52,211,153,0.14)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, color: '#34d399' }}>
                  Save {savePct}%
                </span>
              ) : null}
              <span style={{ padding: '3px 10px', background: inStock ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${inStock ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, color: inStock ? '#34d399' : '#f87171' }}>
                {inStock ? (hasCount ? `${stockQty} in stock` : 'In Stock') : 'Out of Stock'}
              </span>
            </div>

            {product.shortDescription && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
            )}

            {/* Dose selector */}
            {isVariable && hasDoses && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Dose
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {doses.map(d => {
                    const ok = doseInStock(d);
                    const active = effectiveDose === d;
                    return (
                      <button key={d} onClick={() => ok && setSelectedDose(d)} disabled={!ok} style={{
                        padding: '9px 18px',
                        background: active ? 'var(--gradient-primary)' : 'var(--card-dark)',
                        border: `1px solid ${active ? 'transparent' : 'var(--glass-border)'}`,
                        borderRadius: '8px',
                        color: active ? '#001018' : 'var(--text-light)',
                        fontWeight: 700, fontSize: '0.9rem', cursor: ok ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font-body)',
                        opacity: ok ? 1 : 0.45,
                      }}>
                        {d}{!ok && ' · Out'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Certificate of Analysis (COA) */}
            {coa && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'rgba(0,207,255,0.05)', border: '1px solid rgba(0,207,255,0.25)', borderRadius: '12px' }}>
                <span style={{ width: 40, height: 40, flexShrink: 0, borderRadius: '10px', background: 'rgba(0,207,255,0.12)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}>Certificate of Analysis</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    3rd-party tested{coa.batchDate ? ` · batch ${coa.batchDate}` : ''}
                  </div>
                </div>
                <a href={coa.coaFile} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'var(--gradient-primary)', color: '#001018', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', flexShrink: 0 }}>
                  <Download size={14} /> View COA
                </a>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ display: 'flex', gap: '8px', padding: '12px 14px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px' }}>
              <Info size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                For research purposes only. Not for human consumption.
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', border: '1px solid var(--glass-border)', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, background: 'var(--card-dark)', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Minus size={14} />
                </button>
                <div style={{ width: 52, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', fontWeight: 700 }}>{qty}</div>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, background: 'var(--card-dark)', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={14} />
                </button>
              </div>

              {/* Volume tiers — click to jump quantity; discount deepens automatically */}
              {(hasTiers || isDoseOnly) && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {[{ n: 1, label: '1 unit', off: 'Standard' }, { n: 2, label: '2 units', off: 'Save 2.5%' }, { n: 3, label: '3+ units', off: 'Save 5%' }].map(t => {
                    const active = t.n === 3 ? qty >= 3 : qty === t.n;
                    return (
                      <button key={t.n} onClick={() => setQty(t.n)} style={{
                        padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', minWidth: 78,
                        background: active ? 'rgba(0,207,255,0.12)' : 'var(--card-dark)',
                        border: `1px solid ${active ? 'var(--primary-blue)' : 'var(--glass-border)'}`,
                        color: active ? 'var(--primary-blue)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-body)', fontWeight: 600,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                      }}>
                        <span style={{ fontSize: '0.8rem' }}>{t.label}</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>{t.off}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Running total */}
              {Number.isFinite(totalPrice) && totalPrice > 0 && (
                <div style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Total:{' '}
                  <strong style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>{money(totalPrice)}</strong>
                  {qty > 1 && <span style={{ color: 'var(--text-muted)' }}> ({qty} × {money(unitPrice)})</span>}
                </div>
              )}
            </div>

            {/* Cart error */}
            {cartError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem' }}>
                <AlertCircle size={14} /> {cartError}
              </div>
            )}

            {/* Subscribe & Save — per product */}
            {inStock && slug !== 'gift-card' && (
              <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
                <button type="button" onClick={() => setSubscribe(false)}
                  style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', background: !subscribe ? 'rgba(0,207,255,0.06)' : 'transparent', border: `1px solid ${!subscribe ? 'var(--primary-blue)' : 'var(--glass-border)'}`, color: 'var(--text-light)', fontFamily: 'var(--font-body)' }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${!subscribe ? 'var(--primary-blue)' : 'var(--text-muted)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{!subscribe && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-blue)' }} />}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>One-time purchase</span>
                </button>
                <button type="button" onClick={() => setSubscribe(true)}
                  style={{ textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', background: subscribe ? 'rgba(0,207,255,0.06)' : 'transparent', border: `1px solid ${subscribe ? 'var(--primary-blue)' : 'var(--glass-border)'}`, color: 'var(--text-light)', fontFamily: 'var(--font-body)' }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${subscribe ? 'var(--primary-blue)' : 'var(--text-muted)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{subscribe && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-blue)' }} />}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      🔁 Subscribe &amp; Save 10%
                      {Number.isFinite(unitPrice) && (
                        <span style={{ color: 'var(--primary-blue)' }}> — {money(unitPrice * 0.9)}</span>
                      )}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {Number.isFinite(unitPrice) ? `${money(unitPrice * 0.9)} now (10% off${onSale ? ' the sale price' : ''}) + free US shipping. Renews at the price each cycle.` : '10% off + free US shipping · cancel anytime'}
                    </span>
                    {subscribe && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Deliver every</span>
                        <select value={subCadence} onChange={(e) => setSubCadence(parseInt(e.target.value, 10))}
                          style={{ padding: '5px 9px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '7px', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}>
                          <option value={30}>30 days</option>
                          <option value={60}>60 days</option>
                          <option value={90}>90 days</option>
                        </select>
                      </span>
                    )}
                  </span>
                </button>
              </div>
            )}

            {/* Add to cart + wishlist */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAddToCart}
                disabled={!inStock || addingToCart || (isVariable && !resolvedVariation)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px 24px',
                  background: addedToCart ? 'rgba(52,211,153,0.15)' : 'var(--gradient-primary)',
                  border: addedToCart ? '1px solid rgba(52,211,153,0.4)' : 'none',
                  borderRadius: '10px',
                  color: addedToCart ? '#34d399' : '#fff',
                  fontWeight: 700, fontSize: '0.95rem', cursor: (!inStock || (isVariable && !resolvedVariation)) ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)',
                  boxShadow: addedToCart ? 'none' : 'var(--glow-blue)',
                  opacity: (!inStock || (isVariable && !resolvedVariation)) ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }}>
                {addedToCart ? (
                  <><CheckCircle2 size={16} /> Added to Cart!</>
                ) : addingToCart ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Adding…</>
                ) : (
                  <><ShoppingCart size={16} /> {inStock ? 'Add to Cart' : 'Out of Stock'}</>
                )}
              </button>

              {/* <button onClick={() => setWishlisted(v => !v)} style={{
                width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: wishlisted ? 'rgba(236,72,153,0.12)' : 'var(--card-dark)',
                border: `1px solid ${wishlisted ? 'rgba(236,72,153,0.4)' : 'var(--glass-border)'}`,
                borderRadius: '10px', color: wishlisted ? 'var(--pink)' : 'var(--text-secondary)',
                cursor: 'pointer', flexShrink: 0,
              }}>
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button> */}
            </div>

            {/* Guarantee + proof (risk reversal) */}
            <GuaranteeBadge style={{ marginTop: '20px' }} />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div>
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--glass-border)', marginBottom: '28px' }}>
            {['description', 'specifications', 'related'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '12px 20px', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--primary-blue)' : 'transparent'}`,
                color: activeTab === tab ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer', textTransform: 'capitalize', marginBottom: '-1px',
              }}>{tab}</button>
            ))}
          </div>

          <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '28px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            {activeTab === 'description' && (
              <div dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription || 'No description available.' }} />
            )}
            {activeTab === 'specifications' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['SKU', product.sku],
                    ['Category', product.productCategories?.nodes?.[0]?.name],
                    ['Type', isVariable ? 'Variable Product' : 'Simple Product'],
                    ['Stock Status', inStock ? (hasCount ? `${stockQty} in stock` : 'In Stock') : 'Out of Stock'],
                    ['Price', Number.isFinite(unitPrice) ? money(unitPrice) : ''],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--text-light)', width: '40%' }}>{k}</td>
                      <td style={{ padding: '12px 0' }} dangerouslySetInnerHTML={{ __html: String(v) }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'related' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                {product.related?.nodes?.length > 0 ? product.related.nodes.map(rel => (
                  <Link key={rel.id} href={`/product/${rel.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '14px', textAlign: 'center', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      {rel.image?.sourceUrl ? (
                        <img src={rel.image.sourceUrl} alt={rel.name} style={{ height: 60, objectFit: 'contain', margin: '0 auto 10px' }} />
                      ) : (
                        <FlaskConical size={32} color="var(--primary-blue)" style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                      )}
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-light)' }}>{rel.name}</p>
                    </div>
                  </Link>
                )) : <p style={{ color: 'var(--text-muted)' }}>No related products found.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

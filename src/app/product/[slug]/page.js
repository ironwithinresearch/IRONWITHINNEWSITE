'use client';
// src/app/product/[slug]/page.js
// NOTE: Rename folder from [id] to [slug]

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT } from '@/lib/queries/products';
import { useCart } from '@/context/CartContext';
import {
  FlaskConical, ShoppingCart, Heart, ChevronRight,
  Shield, Truck, BadgeCheck, Minus, Plus,
  Loader2, CheckCircle2, AlertCircle, Info, Package,
} from 'lucide-react';

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [cartError, setCartError] = useState('');

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { slug },
    skip: !slug,
  });

  const product = data?.product;

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

  const price = isVariable
    ? (selectedVariation?.price || product.price)
    : product.price;

  const inStock = isVariable
    ? (selectedVariation ? selectedVariation.stockStatus === 'IN_STOCK' : variations.some(v => v.stockStatus === 'IN_STOCK'))
    : product.stockStatus === 'IN_STOCK';

  const handleAddToCart = async () => {
    setCartError('');

    if (isVariable && !selectedVariation) {
      setCartError('Please select an option before adding to cart.');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(
      product.databaseId,
      qty,
      selectedVariation?.databaseId || null
    );
    setAddingToCart(false);

    if (result?.success !== false) {
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
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
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
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                dangerouslySetInnerHTML={{ __html: price || 'Contact for price' }} />
              {product.regularPrice && product.salePrice && (
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem', textDecoration: 'line-through' }}
                  dangerouslySetInnerHTML={{ __html: product.regularPrice }} />
              )}
              <span style={{ padding: '3px 10px', background: inStock ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${inStock ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, color: inStock ? '#34d399' : '#f87171' }}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.shortDescription && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
            )}

            {/* Variation selector */}
            {isVariable && variations.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Select Option
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {variations.map(v => (
                    <button key={v.id} onClick={() => setSelectedVariation(v)} style={{
                      padding: '8px 16px',
                      background: selectedVariation?.id === v.id ? 'var(--gradient-primary)' : 'var(--card-dark)',
                      border: `1px solid ${selectedVariation?.id === v.id ? 'transparent' : 'var(--glass-border)'}`,
                      borderRadius: '8px',
                      color: selectedVariation?.id === v.id ? '#fff' : 'var(--text-light)',
                      fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      opacity: v.stockStatus !== 'IN_STOCK' ? 0.5 : 1,
                    }}>
                      {v.attributes?.nodes?.map(a => a.value).join(' / ')}
                      {v.stockStatus !== 'IN_STOCK' && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
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
            </div>

            {/* Cart error */}
            {cartError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem' }}>
                <AlertCircle size={14} /> {cartError}
              </div>
            )}

            {/* Add to cart + wishlist */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAddToCart}
                disabled={!inStock || addingToCart || (isVariable && !selectedVariation)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px 24px',
                  background: addedToCart ? 'rgba(52,211,153,0.15)' : 'var(--gradient-primary)',
                  border: addedToCart ? '1px solid rgba(52,211,153,0.4)' : 'none',
                  borderRadius: '10px',
                  color: addedToCart ? '#34d399' : '#fff',
                  fontWeight: 700, fontSize: '0.95rem', cursor: (!inStock || (isVariable && !selectedVariation)) ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)',
                  boxShadow: addedToCart ? 'none' : 'var(--glow-blue)',
                  opacity: (!inStock || (isVariable && !selectedVariation)) ? 0.6 : 1,
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

              <button onClick={() => setWishlisted(v => !v)} style={{
                width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: wishlisted ? 'rgba(236,72,153,0.12)' : 'var(--card-dark)',
                border: `1px solid ${wishlisted ? 'rgba(236,72,153,0.4)' : 'var(--glass-border)'}`,
                borderRadius: '10px', color: wishlisted ? 'var(--pink)' : 'var(--text-secondary)',
                cursor: 'pointer', flexShrink: 0,
              }}>
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Truck size={13} color="var(--primary-blue)" /> Free shipping on orders over $225
            </p>
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
                    ['Stock Status', product.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'],
                    ['Price', price],
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

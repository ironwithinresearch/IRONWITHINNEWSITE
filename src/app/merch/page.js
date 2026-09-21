'use client';
// src/app/merch/page.js
//
// The Merchandise tab. Deliberately NOT the shop grid with a filter on it:
//   - every merch product is variable (size + colour), so a card must send the buyer to the
//     product page to choose. An add-to-cart button here would have nothing to add.
//   - print-on-demand never runs out, so the low-stock and backorder chrome is meaningless.
//   - merch is never discounted, so there is no sale badge to render.
//
// Merch is also excluded from /shop, so the two never show the same thing twice.

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/queries/products';
import { decodePriceHtml } from '@/lib/utils';
import { Shirt, Loader2, ChevronRight, Truck } from 'lucide-react';

export default function MerchPage() {
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { first: 100, category: 'merch' },
    fetchPolicy: 'cache-and-network',
  });

  const products = [...(data?.products?.nodes || [])]
    .filter((p) => p?.slug)
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <header style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Shirt size={20} color="var(--primary-blue)" />
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary-blue)' }}>
              Iron Within Merch
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, margin: '0 0 12px', color: 'var(--text-light)' }}>
            Wear it
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '58ch', lineHeight: 1.65, margin: 0 }}>
            Tees, long sleeves, tanks, caps and drinkware. Printed to order, so every size and
            colour is always available.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '10px 14px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: 'max-content' }}>
            <Truck size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            Merch is printed and shipped separately from research products, so an order with both
            arrives in two parcels and shows two shipping lines.
          </div>
        </header>

        {loading && !products.length && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <Loader2 size={26} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {error && (
          <p style={{ color: 'var(--text-secondary)' }}>
            We couldn&apos;t load the merch just now. Please refresh, or{' '}
            <Link href="/contact" style={{ color: 'var(--primary-blue)' }}>get in touch</Link>.
          </p>
        )}

        {!loading && !error && !products.length && (
          <p style={{ color: 'var(--text-secondary)' }}>Nothing here yet — check back shortly.</p>
        )}

        {products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}
                style={{ textDecoration: 'none', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ height: 260, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  {product.image?.sourceUrl ? (
                    <Image src={product.image.sourceUrl} alt={product.image.altText || product.name}
                      width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <Shirt size={40} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-light)', margin: 0, lineHeight: 1.3 }}>
                    {product.name}
                  </h2>
                  <span style={{ color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {decodePriceHtml(product.price) || ''}
                  </span>
                  <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                    Choose size &amp; colour <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

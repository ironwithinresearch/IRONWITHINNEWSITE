'use client';
// src/components/BundleUpsell.jsx
// Cart-page AOV lever: surfaces the research bundles ("complete your stack & save")
// to shoppers who've built a cart but don't have a bundle yet. Bundles are simple
// products with a regularPrice (the à-la-carte value) and a lower price (the bundle
// price) — the savings is the difference. Sorts a bundle to the top when the cart
// already holds one of its components ("matches your cart"). Auto-includes The
// Freedom Stack once it publishes (drafts/future are excluded from GraphQL).

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/queries/products';
import { useCart } from '@/context/CartContext';
import { Layers, Plus, Check, Loader2 } from 'lucide-react';

const BUNDLES = [
  { slug: 'grand-slam-bundle', blurb: 'RT-3 30mg + GLOW + CJC/IPA (10+10)',        components: ['rt-3', 'glow-bundle', 'cjc-ipa'] },
  { slug: 'the-freedom-stack', blurb: 'RT-3 30mg + SS-31 ×2 + KLOW ×2',            components: ['rt-3', 'ss-31', 'klow'] },
  { slug: 'long-shot',         blurb: 'NAD+ 1000mg ×2 + GHK-Cu 100mg + Thymosin α1 ×2', components: ['nad', 'ghk-cu'] },
  { slug: 'the-radiant-bundle', blurb: 'KPV 10mg ×10 + GHK-Cu 50mg ×2',                 components: ['kpv', 'ghk-cu'] },
];
const SLUGS = BUNDLES.map((b) => b.slug);
const num = (s) => parseFloat(String(s || '').replace(/[^0-9.]/g, '')) || 0;

export default function BundleUpsell({ cartSlugs = [] }) {
  const { addToCart } = useCart();
  const { data } = useQuery(GET_PRODUCTS, { variables: { slugIn: SLUGS, first: 10 } });
  const [adding, setAdding] = useState(null);
  const [added, setAdded] = useState(null);

  const items = useMemo(() => {
    const inCart = new Set((cartSlugs || []).filter(Boolean));
    const bySlug = Object.fromEntries((data?.products?.nodes || []).map((p) => [p.slug, p]));
    return BUNDLES
      .map((b) => ({ ...b, p: bySlug[b.slug] }))
      .filter((b) => b.p && b.p.stockStatus !== 'OUT_OF_STOCK' && !inCart.has(b.slug))
      .map((b) => {
        const price = num(b.p.price);
        const reg = num(b.p.regularPrice) || price;
        const save = Math.max(0, reg - price);
        const pct = reg > 0 ? Math.round((save / reg) * 100) : 0;
        const relevant = b.components.some((c) => inCart.has(c));
        return { ...b, price, reg, save, pct, relevant };
      })
      .sort((a, b) => (b.relevant - a.relevant) || (b.save - a.save))
      .slice(0, 2);
  }, [data, cartSlugs]);

  if (!items.length) return null;

  const add = async (it) => {
    if (adding) return;
    setAdding(it.slug);
    try {
      await addToCart(it.p.databaseId, 1);
      setAdded(it.slug);
      setTimeout(() => setAdded(null), 2500);
    } finally {
      setAdding(null);
    }
  };

  return (
    <div style={{ background: 'var(--card-dark)', border: '1px solid rgba(0,207,255,0.25)', borderRadius: '16px', padding: '18px 18px 14px', marginTop: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <Layers size={16} color="var(--primary-blue)" />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-light)' }}>
          Complete your stack &amp; save
        </h3>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 14px' }}>
        Bundle the most-requested sets and pay less than buying each vial on its own.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((it) => {
          const isAdding = adding === it.slug;
          const isAdded = added === it.slug;
          return (
            <div key={it.slug} style={{ display: 'flex', gap: '13px', alignItems: 'center', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '11px 12px' }}>
              <Link href={`/product/${it.slug}`} style={{ flexShrink: 0 }}>
                <div style={{ width: 58, height: 58, borderRadius: '9px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {it.p.image?.sourceUrl
                    ? <img src={it.p.image.sourceUrl} alt={it.p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <Layers size={22} color="var(--text-muted)" />}
                </div>
              </Link>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                  <Link href={`/product/${it.slug}`} style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-light)' }}>{it.p.name}</span>
                  </Link>
                  {it.relevant && (
                    <span style={{ padding: '1px 7px', background: 'rgba(0,207,255,0.14)', border: '1px solid rgba(0,207,255,0.5)', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.03em', color: 'var(--primary-blue)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      ✓ matches your cart
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 5px', lineHeight: 1.3 }}>{it.blurb}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-light)' }}>${it.price.toFixed(2)}</span>
                  {it.save > 0 && (
                    <>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${it.reg.toFixed(2)}</span>
                      <span style={{ padding: '1px 8px', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.45)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800, color: '#34d399', whiteSpace: 'nowrap' }}>
                        Save ${it.save.toFixed(2)} ({it.pct}%)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => add(it)}
                disabled={isAdding || isAdded}
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px', padding: '9px 13px', background: isAdded ? 'rgba(52,211,153,0.18)' : 'var(--gradient-primary)', border: isAdded ? '1px solid rgba(52,211,153,0.5)' : 'none', borderRadius: '9px', color: isAdded ? '#34d399' : '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: isAdding || isAdded ? 'default' : 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                {isAdding ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  : isAdded ? <><Check size={14} /> Added</>
                  : <><Plus size={14} /> Add</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';
// /flash — the items in the live flash window, straight from iw-flash.php (/api/flash).
// Before a window opens it previews the next one's items with a countdown; buttons unlock at the
// start time. Store-wide windows have no picks and are never listed (operator, 17 Oct 2026).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, ShoppingCart, Clock, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function clock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const p = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${p(m)}:${p(sec)}` : `${m}:${p(sec)}`;
}
const ctTime = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' });
const ctDay = (iso) => new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/Chicago' });
const money = (n) => '$' + Number(n).toFixed(2);

function Card({ it, live, max, onAdd, adding }) {
  const [qty, setQty] = useState(1);
  const out = !it.in_stock || it.stock === 0;
  return (
    <div style={{ background: 'var(--card-dark)', border: `1px solid ${live ? 'rgba(239,68,68,0.45)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/product/${it.slug}`} style={{ position: 'relative', display: 'block', background: 'linear-gradient(135deg, var(--bg-elevated), var(--card-elevated))', padding: 18, textAlign: 'center' }}>
        {it.image ? <img src={it.image} alt={`${it.name} ${it.size}`} style={{ height: 190, maxWidth: '100%', objectFit: 'contain' }} /> : <div style={{ height: 190 }} />}
        <span style={{ position: 'absolute', top: 12, left: 12, background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: '0.8rem', padding: '4px 10px', borderRadius: 999 }}>-{it.percent}%</span>
        {it.stock != null && it.stock > 0 && it.stock <= 10 && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: '#fbbf24', fontWeight: 700, fontSize: '0.72rem', padding: '4px 9px', borderRadius: 999 }}>Only {it.stock} left</span>
        )}
      </Link>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <Link href={`/product/${it.slug}`} style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{it.name} <span style={{ color: 'var(--primary-blue)', fontSize: '0.85rem', fontWeight: 600 }}>{it.size}</span></div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{money(it.price)}</span>
          <s style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{money(it.regular)}</s>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {live && !out && (
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
              <button aria-label="Fewer" onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 34, height: 40, background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '1.1rem', cursor: 'pointer' }}>−</button>
              <span style={{ minWidth: 22, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
              <button aria-label="More" onClick={() => setQty((q) => Math.min(max, it.stock ?? max, q + 1))} style={{ width: 34, height: 40, background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
            </div>
          )}
          <button
            disabled={!live || out || adding}
            onClick={() => onAdd(it, qty)}
            style={{ flex: 1, height: 42, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: live && !out ? 'pointer' : 'default',
              background: live && !out ? 'linear-gradient(90deg,#ef4444,#b91c1c)' : 'var(--bg-elevated)', color: live && !out ? '#fff' : 'var(--text-secondary)' }}
          >
            {out ? 'Sold out' : !live ? <><Clock size={15} /> Not open yet</> : adding ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><ShoppingCart size={16} /> Add to cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FlashPage() {
  const { addToCart, notification } = useCart();
  const [data, setData] = useState(null);
  const [now, setNow] = useState(0);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => fetch('/api/flash', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d) setData(d); }).catch(() => {});
    load();
    const poll = setInterval(load, 30000);
    setNow(Date.now());
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => { alive = false; clearInterval(poll); clearInterval(tick); };
  }, []);

  // Refetch the moment the next window opens or the live one closes, so the page flips on time.
  const liveEnd = data?.live_end ? new Date(data.live_end).getTime() : 0;
  const nextStart = data?.next_items_start ? new Date(data.next_items_start).getTime() : 0;
  useEffect(() => {
    if (!now) return;
    if ((liveEnd && now >= liveEnd && now - liveEnd < 1500) || (nextStart && now >= nextStart && now - nextStart < 1500)) {
      fetch('/api/flash', { cache: 'no-store' }).then((r) => r.json()).then(setData).catch(() => {});
    }
  }, [now, liveEnd, nextStart]);

  async function onAdd(it, qty) {
    setAdding(it.variation_id || it.product_id);
    try { await addToCart(it.product_id, qty, it.variation_id || null); } finally { setAdding(null); }
  }

  const live = (data?.live_items || []).length > 0 && liveEnd > now;
  const items = live ? data.live_items : (data?.next_items || []);
  const max = data?.max_per_sku || 5;
  const stack = (data?.windows || []).find((w) => new Date(w.end).getTime() > now && w.percent)?.codes_stack;

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#ef4444', fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.8rem' }}>
          <Zap size={16} fill="#ef4444" /> FLASH SALE
        </div>
        {!data ? (
          <div style={{ padding: 60 }}><Loader2 size={30} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite' }} /></div>
        ) : live ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,5vw,2.8rem)', margin: '8px 0 6px' }}>Live now</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Ends in <strong style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{clock(liveEnd - now)}</strong></p>
          </>
        ) : items.length ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,5vw,2.8rem)', margin: '8px 0 6px' }}>Next flash: {ctTime(data.next_items_start)} CT</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {ctDay(data.next_items_start)} · opens in <strong style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{clock(nextStart - now)}</strong>
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,5vw,2.8rem)', margin: '8px 0 6px' }}>No flash sale right now</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 18px' }}>Watch our socials and email for the next one.</p>
            <Link href="/shop" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Shop the store →</Link>
          </>
        )}
        {data && items.length > 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '12px auto 0', maxWidth: 560, lineHeight: 1.5 }}>
            Zelle, Venmo and Cash App only during the flash · max {max} of each item{stack ? ' · your affiliate code stacks' : ''}.
            {!live && ' Prices drop when the window opens.'}
          </p>
        )}
      </div>

      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
          {items.map((it) => (
            <Card key={it.variation_id || it.product_id} it={it} live={live} max={max} onAdd={onAdd}
              adding={adding === (it.variation_id || it.product_id)} />
          ))}
        </div>
      )}

      {notification && (
        <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 20px', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          background: notification.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(52,211,153,0.95)' }}>
          {notification.message}
        </div>
      )}
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 36 }}>For research use only. Not for human consumption.</p>
    </div>
  );
}

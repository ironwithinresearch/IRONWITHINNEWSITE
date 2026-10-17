'use client';
// /deals — every live offer in one calm place, so the menu and the top bar don't have to
// carry them (operator, 17 Oct 2026). Each card self-gates on its own dates.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { annPromoLive } from '@/lib/anniversary';
import { giveawayOpen } from '@/lib/giveaway';

const ctWhen = (iso) => new Date(iso).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' });

function Deal({ eyebrow, title, body, href, cta, highlight }) {
  return (
    <Link href={href} style={{
      display: 'flex', flexDirection: 'column', gap: 8, padding: '22px 22px 20px', textDecoration: 'none',
      background: 'var(--card-dark)', borderRadius: 'var(--radius-lg)',
      border: `1px solid ${highlight ? 'rgba(234,88,12,0.45)' : 'var(--glass-border)'}`,
    }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: highlight ? '#ea580c' : 'var(--text-muted)' }}>{eyebrow}</span>
      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-light)', fontFamily: 'var(--font-body)' }}>{title}</span>
      <span style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--text-secondary)', flex: 1 }}>{body}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-light)' }}>{cta} <ArrowRight size={15} /></span>
    </Link>
  );
}

export default function Deals() {
  const [now, setNow] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    fetch('/api/flash').then((r) => r.json()).then((d) => {
      const t = Date.now();
      const w = (d.windows || []).find((x) => new Date(x.end).getTime() > t && x.percent);
      if (w) setFlash({ live: new Date(w.start).getTime() <= t, start: w.start, percent: w.percent });
    }).catch(() => {});
  }, []);

  const deals = [];
  if (flash) {
    deals.push({
      eyebrow: flash.live ? 'Live now' : 'Next flash sale',
      title: flash.live ? `Flash sale: ${flash.percent}% off select items` : `${flash.percent}% off select items, ${ctWhen(flash.start)} CT`,
      body: 'Short windows on a handful of compounds. Pay by Zelle, Venmo or Cash App to get the flash price.',
      href: '/flash', cta: flash.live ? 'Shop the flash sale' : 'Preview the items', highlight: flash.live,
    });
  }
  if (now && annPromoLive(now)) {
    deals.push({ eyebrow: 'Through October 31', title: 'Anniversary Month', body: 'A different offer every day of October, including Flash Saturdays and Loyalty Sundays.', href: '/anniversary', cta: 'See the calendar' });
  }
  deals.push({ eyebrow: 'Always on', title: 'Refer a friend', body: 'Your friend gets $25 off their first order, and you get $25 in store credit once they order.', href: '/refer', cta: 'Get your referral link' });
  deals.push({ eyebrow: 'Always on', title: 'Teachers, military & first responders', body: '15% off for those who serve. Verify once and it applies at checkout.', href: '/heroes', cta: 'Verify and save' });
  if (now && giveawayOpen(now)) {
    deals.push({ eyebrow: 'Giveaway', title: 'Win a cruise for two', body: 'Every qualifying order is an automatic entry. Full official rules on the giveaway page.', href: '/giveaway', cta: 'See the rules' });
  }
  deals.push({ eyebrow: 'Gift cards', title: 'Send a gift card', body: 'Delivered by email and spendable on anything in the store.', href: '/gift-cards', cta: 'Buy a gift card' });

  return (
    <main style={{ minHeight: '100vh', padding: '48px 16px 80px' }}>
      <div className="container" style={{ maxWidth: 1040, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 8px' }}>Deals</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 28px', maxWidth: 620 }}>
          Every current offer in one place. Affiliate codes stack where noted on each offer.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {deals.map((d) => <Deal key={d.title} {...d} />)}
        </div>
      </div>
    </main>
  );
}

'use client';
/* Black Friday Giveaway — sweepstakes landing page + Official Rules (Brian, 7 Nov 2026).
 *
 * Built as a lawful US sweepstakes, the same way as the cruise page (/giveaway/cruise):
 *   - NO PURCHASE NECESSARY is the first thing on the page
 *   - the free entry form sits beside the purchase route with EQUAL weight and the same deadline,
 *     and a person holds ONE entry however they enter — so buying can never improve the odds
 *   - the full Official Rules are on this page, not behind a link
 *
 * The backend (mu-plugin iw-bf-giveaway.php) implements these rules and must not drift from them:
 * window, $450 purchase threshold, one entry per person, the affiliate exclusion, the prize tiers.
 * The sale-day rate list is read live from /api/black-friday (IW_BF_RATES), never typed here.
 *
 * ⚠️ Not legal advice. A template built to the usual US sweepstakes structure; have it reviewed.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Gift, ShoppingBag, PenLine, ShieldCheck, CalendarDays, Tag } from 'lucide-react';
import { BFG, BF_DAYS, bfgOpen, reseqRewardLine } from '@/lib/blackFriday';

const STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'],
  ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'],
  ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'],
  ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'],
  ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'],
  ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

const S = {
  wrap: { maxWidth: 880, margin: '0 auto', padding: '36px 16px 90px' },
  h2: { fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 12px' },
  h3: { color: 'var(--text-light)', fontSize: '1rem', fontWeight: 700, margin: '10px 0 8px' },
  p: { color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12, maxWidth: '70ch' },
  card: { background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '20px 20px' },
  rule: { fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 14 },
  rh: { color: 'var(--text-light)', fontWeight: 700, display: 'block', marginBottom: 3 },
  strong: { color: 'var(--text-light)' },
  label: { display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: 6 },
  input: { width: '100%', minHeight: 44, padding: '10px 12px', fontSize: '1rem', color: 'var(--text-light)', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 10 },
};

const money = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

function RateList({ rows }) {
  const groups = useMemo(() => {
    const g = new Map();
    for (const r of rows) {
      if (!r.in_sale) continue;
      if (!g.has(r.pct)) g.set(r.pct, []);
      g.get(r.pct).push(`${r.name}${r.dose ? ` ${r.dose}` : ''}`);
    }
    return [...g.entries()].sort((a, b) => b[0] - a[0]);
  }, [rows]);
  const total = groups.reduce((n, [, items]) => n + items.length, 0);
  if (!total) return null;
  return (
    <details style={{ marginTop: 12 }}>
      <summary style={{ cursor: 'pointer', minHeight: 40, display: 'flex', alignItems: 'center', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.92rem' }}>
        See every item and its sale-day rate ({total} items)
      </summary>
      <div style={{ marginTop: 10 }}>
        {groups.map(([pct, items]) => (
          <p key={pct} style={{ ...S.p, fontSize: '0.86rem', marginBottom: 10 }}>
            <strong style={S.strong}>{pct}% off ({items.length}):</strong> {items.join(', ')}.
          </p>
        ))}
        <p style={{ ...S.p, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 0 }}>
          This list is generated from the store&apos;s live sale settings. An item with fewer than 5 in stock drops out of the
          sale on the day; RT-3 20mg, RT-3 30mg and TRZ-2 30mg are the buy 1, get 2 free items and have no stock limit.
        </p>
      </div>
    </details>
  );
}

function EntryForm({ open }) {
  const [f, setF] = useState({ name: '', email: '', state: '', age21: false, us_resident: false, website: '' });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { ok, status, message }

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/bf-giveaway', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const data = await res.json().catch(() => null);
      setResult(data && data.message ? data : { ok: false, status: 'error', message: 'Your entry was not stored. Please try again, or email support@ironwithin.io.' });
    } catch {
      setResult({ ok: false, status: 'error', message: 'Your entry was not stored because we could not reach the server. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  const good = result && (result.status === 'entered' || result.status === 'already_entered');

  if (!open) {
    return (
      <p style={{ ...S.p, marginBottom: 0 }}>
        The free entry form is available from {BFG.opensLabel} until {BFG.closesLabel}.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate={false} style={{ display: 'grid', gap: 14 }}>
      <div>
        <label htmlFor="bfg-name" style={S.label}>Full name</label>
        <input id="bfg-name" name="name" autoComplete="name" required minLength={2} maxLength={120} value={f.name} onChange={set('name')} style={S.input} />
      </div>
      <div>
        <label htmlFor="bfg-email" style={S.label}>Email</label>
        <input id="bfg-email" name="email" type="email" autoComplete="email" required maxLength={190} value={f.email} onChange={set('email')} style={S.input} />
      </div>
      <div>
        <label htmlFor="bfg-state" style={S.label}>State</label>
        <select id="bfg-state" name="state" required value={f.state} onChange={set('state')} style={S.input}>
          <option value="">Choose your state</option>
          {STATES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
        </select>
      </div>
      {/* Honeypot: hidden from people and screen readers; bots fill it. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="bfg-website">Website</label>
        <input id="bfg-website" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>
      <label htmlFor="bfg-age" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minHeight: 40, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
        <input id="bfg-age" type="checkbox" required checked={f.age21} onChange={set('age21')} style={{ width: 22, height: 22, flex: 'none', marginTop: 1, accentColor: 'var(--primary-blue)' }} />
        I am 21 or older.
      </label>
      <label htmlFor="bfg-us" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minHeight: 40, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
        <input id="bfg-us" type="checkbox" required checked={f.us_resident} onChange={set('us_resident')} style={{ width: 22, height: 22, flex: 'none', marginTop: 1, accentColor: 'var(--primary-blue)' }} />
        I am a legal resident of one of the 50 United States or the District of Columbia, and I have read the Official Rules below.
      </label>
      <button type="submit" disabled={busy} style={{
        minHeight: 48, padding: '12px 18px', borderRadius: 10, border: 'none', cursor: busy ? 'wait' : 'pointer',
        background: 'var(--gradient-primary)', color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-body)',
      }}>
        {busy ? 'Sending...' : 'Enter the giveaway'}
      </button>
      <div role="status" aria-live="polite" style={{ minHeight: 1 }}>
        {result && (
          <p style={{
            margin: 0, padding: '12px 14px', borderRadius: 10, fontSize: '0.92rem', lineHeight: 1.55,
            background: good ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
            border: `1px solid ${good ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.45)'}`,
            color: good ? '#a7f3d0' : '#fecaca',
          }}>
            {result.message}
          </p>
        )}
      </div>
      <p style={{ ...S.p, fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
        We use what you enter here only to run this giveaway. It is not added to any marketing list.
      </p>
    </form>
  );
}

export default function BlackFridayGiveaway() {
  const [now, setNow] = useState(null);
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    fetch('/api/black-friday').then((r) => r.json()).then((d) => { if (d && d.ok) setCfg(d); }).catch(() => {});
  }, []);

  const open = now ? bfgOpen(now) : true;
  const B = BFG.bigPrize;
  const Sm = BFG.smallPrize;
  const b1g2 = cfg?.sale?.b1g2 || [];
  const rates = cfg?.sale?.rates || [];

  return (
    <div style={S.wrap}>
      <header style={{ marginBottom: 26 }}>
        {/* The single most important line on the page. */}
        <p style={{
          background: 'rgba(0,207,255,0.07)', border: '1px solid rgba(0,207,255,0.35)', borderRadius: 12,
          padding: '13px 16px', margin: '0 0 22px', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-light)',
        }}>
          <strong>NO PURCHASE NECESSARY TO ENTER OR WIN.</strong> A purchase will not improve your chance of winning.
          Void where prohibited. Open to legal residents of the 50 United States and D.C. who are 21 or older.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <Gift size={20} color="var(--primary-blue)" aria-hidden="true" />
          <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--primary-blue)' }}>
            Iron Within Research Giveaway
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,6vw,2.6rem)', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 12px', lineHeight: 1.08 }}>
          Black Friday Giveaway
        </h1>
        <p style={{ ...S.p, fontSize: '1.05rem' }}>
          One winner receives up to <strong style={S.strong}>{money(B.total)} in Iron Within store credit</strong>,
          paid as monthly credits. Enter free with the form below, or with {money(BFG.minSpend)} or more in paid orders.
          Either way it is one entry per person. Entries close {BFG.closesLabel}.
        </p>
      </header>

      {/* ── Summary ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="bfg-summary" style={{ marginBottom: 30 }}>
        <h2 id="bfg-summary" style={S.h2}>At a glance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          <div style={S.card}>
            <PenLine size={18} color="var(--primary-blue)" aria-hidden="true" />
            <h3 style={S.h3}>How to enter</h3>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 8 }}>
              <strong style={S.strong}>Free:</strong> fill in the form on this page.
            </p>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 8 }}>
              <strong style={S.strong}>With orders:</strong> paid orders during the entry period that add up to {money(BFG.minSpend)} or more,
              after discounts and not counting shipping, tax or gift card purchases. Nothing to fill in.
            </p>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 0 }}>
              Both count the same. One entry per person, however you enter.
            </p>
          </div>
          <div style={S.card}>
            <Gift size={18} color="var(--primary-blue)" aria-hidden="true" />
            <h3 style={S.h3}>The prize</h3>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 8 }}>
              <strong style={S.strong}>{BFG.tierMin} or more eligible entries:</strong> {money(B.total)} in store credit, as {B.months} monthly credits of {money(B.monthly)}.
            </p>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 8 }}>
              <strong style={S.strong}>Fewer than {BFG.tierMin}:</strong> {money(Sm.total)} in store credit, as {Sm.months} monthly credits of {money(Sm.monthly)}.
            </p>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 0 }}>
              Drawing {BFG.drawLabel}. Each month&apos;s credit expires 30 days after it is issued.
            </p>
          </div>
        </div>

        <div style={{ ...S.card, marginTop: 14 }}>
          <Tag size={18} color="var(--primary-blue)" aria-hidden="true" />
          <h3 style={S.h3}>Sale days</h3>
          <ul style={{ ...S.p, fontSize: '0.9rem', paddingLeft: 18, marginBottom: 12 }}>
            {BF_DAYS.map((d) => (
              <li key={d.day} style={{ marginBottom: 4 }}><strong style={S.strong}>{d.label}</strong>, {d.when}</li>
            ))}
          </ul>
          <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 8 }}>
            <strong style={S.strong}>Buy 1, get 2 free</strong> on RT-3 20mg, RT-3 30mg and TRZ-2 30mg, at regular price.
            For every 3 of the same item in your cart, 2 are free, up to 2 deals (6 units) per item per order.
            {b1g2.length > 0 && <> Regular prices: {b1g2.map((x) => `${x.name} ${x.dose} $${Number(x.regular).toFixed(2)}`).join(', ')}.</>}
            {' '}Creator codes apply to the item you pay for.
          </p>
          <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 8 }}>
            <strong style={S.strong}>35% off most other items</strong>, with a smaller discount on a few items, no code needed.
            Creator codes stack on top.
          </p>
          <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 8 }}>
            <strong style={S.strong}>Between sale days</strong> (November 8 through November 27), most items are also 35% off, including
            RT-3 and TRZ-2 in every size. The buy 1, get 2 free offer runs on the three sale days only.
          </p>
          <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 0 }}>
            <strong style={S.strong}>Not in the sale:</strong> aminos, merch, gift cards, bundles and research plans, lab supplies
            (water), RT-3 60mg and TRZ-2 60mg.
          </p>
          <RateList rows={rates} />
        </div>

        {open && (
          <p style={{ ...S.p, fontSize: '0.9rem', marginTop: 14, marginBottom: 0 }}>{reseqRewardLine}</p>
        )}
      </section>

      {/* ── Free entry ──────────────────────────────────────────────────────── */}
      <section id="enter" aria-labelledby="bfg-enter" style={{ marginBottom: 30 }}>
        <h2 id="bfg-enter" style={S.h2}>Enter free</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          <div style={S.card}>
            <EntryForm open={open} />
          </div>
          <div style={S.card}>
            <ShoppingBag size={18} color="var(--primary-blue)" aria-hidden="true" />
            <h3 style={S.h3}>Or enter with your orders</h3>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 8 }}>
              If your paid orders at ironwithin.io during the entry period add up to {money(BFG.minSpend)} or more, you are entered
              automatically under the email on your account. Orders that are cancelled or refunded do not count.
            </p>
            <p style={{ ...S.p, fontSize: '0.9rem', marginBottom: 0 }}>
              A purchase entry has the same weight and the same deadline as a free entry, and someone who does both still has one entry.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="bfg-dates" style={{ marginBottom: 30 }}>
        <h2 id="bfg-dates" style={S.h2}><CalendarDays size={17} aria-hidden="true" style={{ verticalAlign: -2, marginRight: 6 }} />Key dates</h2>
        <div style={S.card}>
          <p style={{ ...S.p, marginBottom: 6 }}><strong style={S.strong}>Entries open:</strong> {BFG.opensLabel}</p>
          <p style={{ ...S.p, marginBottom: 6 }}><strong style={S.strong}>Entries close:</strong> {BFG.closesLabel}</p>
          <p style={{ ...S.p, marginBottom: 0 }}><strong style={S.strong}>Winner drawn:</strong> {BFG.drawLabel}</p>
        </div>
      </section>

      {/* ── Official Rules ──────────────────────────────────────────────────── */}
      <section id="rules" aria-labelledby="bfg-rules" style={{ marginBottom: 22 }}>
        <h2 id="bfg-rules" style={S.h2}><ShieldCheck size={17} aria-hidden="true" style={{ verticalAlign: -2, marginRight: 6 }} />Official Rules</h2>
        <div style={S.card}>
          <p style={S.rule}><strong style={{ ...S.rh, fontSize: '0.95rem' }}>NO PURCHASE NECESSARY TO ENTER OR WIN. A PURCHASE OR PAYMENT OF ANY KIND WILL NOT INCREASE YOUR CHANCES OF WINNING. VOID WHERE PROHIBITED.</strong></p>

          <p style={S.rule}><span style={S.rh}>1. Sponsor</span>
            {BFG.sponsor}, {BFG.sponsorAddress}, {BFG.sponsorEmail} (&quot;Sponsor&quot;).</p>

          <p style={S.rule}><span style={S.rh}>2. Entry period</span>
            The Black Friday Giveaway (the &quot;Giveaway&quot;) begins {BFG.opensLabel} and ends {BFG.closesLabel} (the
            &quot;Entry Period&quot;). The Sponsor&apos;s clock is the official timekeeper.</p>

          <p style={S.rule}><span style={S.rh}>3. Eligibility</span>
            Open only to legal residents of the fifty (50) United States and the District of Columbia who are 21 years of age or
            older at the time of entry. Not eligible: employees of the Sponsor; anyone who is an approved, pending or invited
            affiliate in the Sponsor&apos;s affiliate program; and the immediate family members and household members of any
            of them. Void where prohibited or restricted by law.</p>

          <p style={S.rule}><span style={S.rh}>4. How to enter</span>
            There are two ways to enter. Both carry the same weight and the same deadline.
            <br /><br />
            <em>(a) Free entry.</em> Complete the entry form at ironwithin.io/giveaway with your full name, email address and
            state, and confirm that you are 21 or older and a legal US resident, during the Entry Period.
            <br /><br />
            <em>(b) Purchase entry.</em> Place paid orders at ironwithin.io during the Entry Period whose combined totals are
            ${BFG.minSpend} or more. Order totals are measured after discounts, and do not include shipping, taxes or the
            purchase of gift cards. Amounts paid with store credit or a gift card count toward the total. Orders that are
            cancelled, refunded or charged back do not count. A purchase entry is recorded automatically under the email
            address on the customer account (or on the order, if there is no account).
            <br /><br />
            <strong style={S.strong}>Limit one (1) entry per person</strong>, however many times or ways that person enters.
            A person who qualifies by purchase and also submits the form still has one entry. A purchase does not improve the
            odds of winning. Entries made using more than one identity or email address, or by any automated means, are void.</p>

          <p style={S.rule}><span style={S.rh}>5. Prize</span>
            One (1) winner. The prize is Iron Within store credit, and its value is set by the number of eligible entries at the
            end of the Entry Period, counting each eligible person once whether they entered free, by purchase or both:
            <br />
            &bull; <strong style={S.strong}>{BFG.tierMin} or more eligible entries:</strong> {money(B.total)} in store credit, issued as {B.months} monthly
            credits of {money(B.monthly)} each.
            <br />
            &bull; <strong style={S.strong}>Fewer than {BFG.tierMin} eligible entries:</strong> {money(Sm.total)} in store credit, issued as {Sm.months} monthly
            credits of {money(Sm.monthly)} each.
            <br />
            The first credit is issued after the winner is confirmed, and one credit is issued in each following month. Each
            monthly credit expires 30 days after it is issued, and any unused balance of that credit is
            forfeited. The approximate retail value of the prize is the stated credit total ({money(B.total)} or {money(Sm.total)}).
            Store credit is a promotional credit with no cash value. It is not transferable, cannot be exchanged for cash and
            cannot be resold. It is redeemable only at ironwithin.io, by the winner as a verified account holder aged 21 or older who completes the store&apos;s researcher account signup and accepts its research-use-only terms,
            and is subject to the store&apos;s Terms, including its research-use-only terms. No substitution, except that the
            Sponsor may substitute a prize of equal or greater value.</p>

          <p style={S.rule}><span style={S.rh}>6. Odds</span>
            The odds of winning depend on the number of eligible entries received during the Entry Period.</p>

          <p style={S.rule}><span style={S.rh}>7. Drawing</span>
            The winner will be selected in a random drawing from all eligible entries, one entry per person, on {BFG.drawLabel}.
            The drawing is conducted by the Sponsor using a computer random number generator.</p>

          <p style={S.rule}><span style={S.rh}>8. Winner notification</span>
            The winner will be notified by email, at the address on the entry, within seven (7) days of the drawing, and must
            respond within fourteen (14) days of that email. If the winner does not respond in time, cannot be verified as
            eligible, or declines the prize, the prize is forfeited and an alternate winner will be drawn. The winner may be
            asked to confirm their age, residence and identity, and, where permitted by law, to sign an affidavit of eligibility
            and a release.</p>

          <p style={S.rule}><span style={S.rh}>9. Taxes</span>
            All taxes on the prize are the sole responsibility of the winner. For a prize valued at $600 or more, the winner must
            provide a completed IRS Form W-9 before the prize is issued, and the Sponsor will report the prize as required by law.</p>

          <p style={S.rule}><span style={S.rh}>10. Not affiliated with any platform</span>
            This Giveaway is not sponsored, endorsed or administered by, or associated with, Instagram, Facebook, TikTok or any
            other platform on which it may be shared.</p>

          <p style={S.rule}><span style={S.rh}>11. Privacy</span>
            Information collected through an entry is used only to run this Giveaway: to check eligibility, to conduct the
            drawing, to contact the winner and as required by law. See our{' '}
            <Link href="/privacy" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</Link>.</p>

          <p style={S.rule}><span style={S.rh}>12. General conditions</span>
            The Sponsor may disqualify any entry or entrant it finds to be tampering with the entry process or acting in
            violation of these rules, and may modify, suspend or cancel the Giveaway if it cannot run as planned, where permitted
            by law. By entering, entrants agree to these rules and release the Sponsor from liability arising from the Giveaway
            or the prize, to the extent permitted by law. The Sponsor&apos;s decisions are final and binding on all matters
            relating to this Giveaway.</p>

          <p style={S.rule}><span style={S.rh}>13. Winner&apos;s name</span>
            To request the winner&apos;s first name and state, email {BFG.sponsorEmail} with the subject &quot;Black Friday
            Giveaway winner&quot; within sixty (60) days after the drawing.</p>

          <p style={{ ...S.rule, marginBottom: 0 }}><span style={S.rh}>14. Governing law</span>
            These rules are governed by the laws of the State of Florida.</p>
        </div>
      </section>

      <p style={{ ...S.p, fontSize: '0.86rem' }}>
        Also running: our separate cruise sweepstakes, which has its own rules and closes November 30, 2026.{' '}
        <Link href="/giveaway/cruise" style={{ color: 'var(--primary-blue)' }}>Cruise sweepstakes rules</Link>
      </p>

      <p style={{ ...S.p, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
        For research use only. Not for human or veterinary use. See our{' '}
        <Link href="/terms" style={{ color: 'var(--primary-blue)' }}>Terms</Link> and{' '}
        <Link href="/privacy" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}

'use client';
/* Cruise sweepstakes landing page.
 *
 * Structured as a lawful US sweepstakes rather than a promotion with rules bolted on:
 *   - NO PURCHASE NECESSARY is the first thing on the page, not a footnote
 *   - the free mail-in route sits beside the purchase route with equal weight, because a
 *     purchase-only prize draw is an illegal lottery in most states
 *   - full Official Rules are ON this page, not behind a link
 *   - Carnival is a third-party trademark; the disclaimer is explicit
 *
 * ⚠️ Not legal advice. Have it reviewed. lib/giveaway.js carries the values that must be
 * filled in first, and this page renders a loud banner while any remain.
 */

import Link from 'next/link';
import { GIVEAWAY as G, giveawayTodos } from '@/lib/giveaway';
import { Ship, Mail, ShoppingBag, ShieldCheck, CalendarDays } from 'lucide-react';

const S = {
  wrap: { maxWidth: 860, margin: '0 auto', padding: '40px 20px 90px' },
  h2: { fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-light)', margin: '0 0 12px' },
  p: { color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12, maxWidth: '68ch' },
  card: { background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '22px 24px' },
  rule: { fontSize: '0.86rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 14 },
  rh: { color: 'var(--text-light)', fontWeight: 700, display: 'block', marginBottom: 3 },
};

export default function GiveawayPage() {
  const todos = giveawayTodos();

  return (
    <div style={S.wrap}>

      {todos.length > 0 && (
        <div role="alert" style={{
          background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.5)',
          borderRadius: 12, padding: '14px 16px', marginBottom: 24, color: '#fca5a5', fontSize: '0.86rem', lineHeight: 1.6,
        }}>
          <strong style={{ display: 'block', color: '#f87171' }}>Not ready to promote — {todos.length} value{todos.length === 1 ? '' : 's'} still unset</strong>
          {todos.join(', ')} in <code>lib/giveaway.js</code>. Official Rules are not valid without the
          sponsor&apos;s registered legal name and the prize&apos;s stated value.
        </div>
      )}

      <header style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <Ship size={20} color="var(--primary-blue)" />
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--primary-blue)' }}>
            Iron Within Research Sweepstakes
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.6rem', fontWeight: 900, color: 'var(--text-light)', margin: '0 0 14px', lineHeight: 1.05 }}>
          {G.prizeName}
        </h1>
        <p style={{ ...S.p, fontSize: '1.05rem' }}>
          We&apos;re covering the cruise fare for two. Enter free by mail, or earn entries on orders
          you were placing anyway — one entry for every ${G.dollarsPerEntry} spent.
        </p>

        {/* The single most important line on the page. */}
        <div style={{
          background: 'rgba(0,207,255,0.07)', border: '1px solid rgba(0,207,255,0.35)',
          borderRadius: 12, padding: '13px 16px', marginTop: 16,
          fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.01em',
        }}>
          NO PURCHASE NECESSARY TO ENTER OR WIN. A purchase will not improve your chance of winning.
          Void where prohibited. Open to legal residents of the 50 United States and D.C. who are{' '}
          {G.minAge} or older.
        </div>
      </header>

      <section style={{ marginBottom: 30 }}>
        <h2 style={S.h2}>Two ways to enter — both count the same</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
          <div style={S.card}>
            <ShoppingBag size={18} color="var(--primary-blue)" />
            <h3 style={{ color: 'var(--text-light)', fontSize: '1rem', margin: '10px 0 8px' }}>With an order</h3>
            <p style={{ ...S.p, marginBottom: 0, fontSize: '0.9rem' }}>
              One entry for every <strong style={{ color: 'var(--text-light)' }}>${G.dollarsPerEntry}</strong> spent
              on an order, applied automatically — nothing to fill in. Entries add up across every order
              you place during the period. <strong style={{ color: 'var(--text-light)' }}>Entries double</strong> on
              orders placed {G.bonusFromLabel} through {G.bonusToLabel}.
            </p>
          </div>
          <div style={S.card}>
            <Mail size={18} color="var(--primary-blue)" />
            <h3 style={{ color: 'var(--text-light)', fontSize: '1rem', margin: '10px 0 8px' }}>Free, by mail</h3>
            <p style={{ ...S.p, marginBottom: 0, fontSize: '0.9rem' }}>
              Hand-print your full name, address, email, phone and date of birth on a 3&quot;×5&quot; card
              and mail it in a stamped envelope to the Sponsor address below. One entry per envelope,
              each mailed separately. Must be postmarked by {G.closesLabel.split(' at ')[0]} and received
              within seven days of that date.
            </p>
          </div>
        </div>
        <p style={{ ...S.p, marginTop: 12, fontSize: '0.86rem' }}>
          Mail-in entries carry exactly the same weight in the drawing as entries earned on an order.
        </p>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2 style={S.h2}>The prize</h2>
        <div style={S.card}>
          <p style={{ ...S.p, marginBottom: 10 }}><strong style={{ color: 'var(--text-light)' }}>Included:</strong> {G.prizeIncludes}</p>
          <p style={{ ...S.p, marginBottom: 10 }}><strong style={{ color: 'var(--text-light)' }}>Not included:</strong> {G.prizeExcludes}</p>
          <p style={{ ...S.p, marginBottom: 0, fontSize: '0.88rem' }}>
            Approximate retail value: <strong style={{ color: 'var(--text-light)' }}>{G.prizeArv}</strong>. One prize
            will be awarded. Departure ports and sailing dates: {G.prizePorts}.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2 style={S.h2}><CalendarDays size={17} style={{ verticalAlign: -2, marginRight: 6 }} />Key dates</h2>
        <div style={S.card}>
          <p style={{ ...S.p, marginBottom: 6 }}><strong style={{ color: 'var(--text-light)' }}>Opens:</strong> {G.opensLabel}</p>
          <p style={{ ...S.p, marginBottom: 6 }}><strong style={{ color: 'var(--text-light)' }}>Closes:</strong> {G.closesLabel}</p>
          <p style={{ ...S.p, marginBottom: 0 }}><strong style={{ color: 'var(--text-light)' }}>Winner drawn:</strong> {G.drawLabel}</p>
        </div>
      </section>

      <section id="rules" style={{ marginBottom: 20 }}>
        <h2 style={S.h2}><ShieldCheck size={17} style={{ verticalAlign: -2, marginRight: 6 }} />Official Rules</h2>
        <div style={S.card}>
          <p style={S.rule}><span style={S.rh}>1. No purchase necessary</span>
            NO PURCHASE OR PAYMENT OF ANY KIND IS NECESSARY TO ENTER OR WIN. A purchase will not
            increase your chances of winning. Void where prohibited or restricted by law.</p>

          <p style={S.rule}><span style={S.rh}>2. Sponsor</span>
            {G.sponsorLegalName}, {G.sponsorAddress} (&quot;Sponsor&quot;). Questions: {G.sponsorEmail}.</p>

          <p style={S.rule}><span style={S.rh}>3. Eligibility</span>
            Open only to legal residents of the fifty (50) United States and the District of Columbia
            who are {G.minAge} years of age or older at the time of entry. Employees of the Sponsor and
            its affiliates, and members of their immediate families or households, are not eligible.
            Void where prohibited.</p>

          <p style={S.rule}><span style={S.rh}>4. Entry period</span>
            Begins {G.opensLabel} and ends {G.closesLabel}. The Sponsor&apos;s clock is the official
            timekeeper.</p>

          <p style={S.rule}><span style={S.rh}>5. How to enter</span>
            <em>(a) With a purchase.</em> Receive one (1) entry for each ${G.dollarsPerEntry} (US) spent,
            excluding shipping, taxes and the value of any free item, on a single order placed during
            the Entry Period. Partial amounts do not earn an entry. Orders placed
            {' '}{G.bonusFromLabel} through {G.bonusToLabel} receive double entries. Entries are
            forfeited if the order is cancelled, refunded or charged back.
            <br /><br />
            <em>(b) Free method of entry.</em> Hand-print your full name, complete mailing address,
            email address, telephone number and date of birth on a 3&quot;×5&quot; card and mail it in a
            separate hand-addressed, stamped envelope to: {G.sponsorLegalName}, Cruise Sweepstakes,
            {' '}{G.sponsorAddress}. Limit one entry per outer envelope; each entry must be mailed
            separately. Mail-in entries must be postmarked by the end of the Entry Period and received
            no later than seven (7) days afterwards. Mechanically reproduced, illegible or incomplete
            entries are void. Sponsor is not responsible for lost, late, misdirected or postage-due
            mail. Entries received by this method have the same chance of winning as entries earned
            with a purchase.</p>

          <p style={S.rule}><span style={S.rh}>6. Prize</span>
            One (1) prize: {G.prizeName}. Includes {G.prizeIncludes} Does not include {G.prizeExcludes}
            {' '}Approximate Retail Value (ARV): {G.prizeArv}. The prize is awarded as-is, with no
            substitution, transfer or cash equivalent except at the Sponsor&apos;s sole discretion,
            which reserves the right to substitute a prize of equal or greater value if the stated prize
            becomes unavailable. Travel must be taken on the dates and sailings the Sponsor specifies,
            and all travellers must hold valid travel documents. If the winner cannot travel, the prize
            may be forfeited and an alternate winner selected.</p>

          <p style={S.rule}><span style={S.rh}>7. Odds</span>
            Odds of winning depend on the total number of eligible entries received during the Entry
            Period.</p>

          <p style={S.rule}><span style={S.rh}>8. Winner selection and notification</span>
            One winner will be selected in a random drawing from all eligible entries {G.drawLabel},
            conducted by the Sponsor, whose decisions are final and binding. The winner will be
            notified by email and telephone using the details on the entry, and must respond within
            five (5) days. If the winner cannot be reached, declines, is ineligible, or fails to
            return any required documents, the prize may be forfeited and an alternate winner drawn.</p>

          <p style={S.rule}><span style={S.rh}>9. Conditions of award</span>
            The winner may be required to sign and return an affidavit of eligibility, a liability
            release and, except where prohibited, a publicity release, before the prize is awarded.</p>

          <p style={S.rule}><span style={S.rh}>10. Taxes</span>
            All federal, state and local taxes on the prize are the sole responsibility of the winner.
            Prizes with a value of $600 or more will be reported on IRS Form 1099-MISC, and the winner
            must supply a valid taxpayer identification number before the prize is released.</p>

          <p style={S.rule}><span style={S.rh}>11. Publicity</span>
            Except where prohibited, acceptance of the prize constitutes permission for the Sponsor to
            use the winner&apos;s name, city and state for promotional purposes without further
            compensation.</p>

          <p style={S.rule}><span style={S.rh}>12. Limitation of liability</span>
            By entering, entrants release the Sponsor and its affiliates from any liability for loss,
            harm or damage arising from participation in this sweepstakes or from acceptance, use or
            misuse of the prize. Sponsor is not responsible for entries that are lost, late,
            misdirected, incomplete, or not recorded for technical reasons.</p>

          <p style={S.rule}><span style={S.rh}>13. Not affiliated with Carnival</span>
            This sweepstakes is not sponsored, endorsed, administered by, or associated with Carnival
            Corporation &amp; plc, Carnival Cruise Line, or any of their affiliates. All trademarks are
            the property of their respective owners.</p>

          <p style={S.rule}><span style={S.rh}>14. Not affiliated with any platform</span>
            This sweepstakes is not sponsored, endorsed or administered by, or associated with,
            Instagram, Meta, TikTok, YouTube, X or any other platform on which it may be promoted.</p>

          <p style={S.rule}><span style={S.rh}>15. Winner&apos;s name</span>
            For the name of the winner, send a stamped, self-addressed envelope to the Sponsor address
            above, marked &quot;Cruise Sweepstakes Winner&quot;, within sixty (60) days of the drawing.</p>

          <p style={{ ...S.rule, marginBottom: 0 }}><span style={S.rh}>16. Governing law</span>
            These rules are governed by the laws of the State of Florida, without regard to conflict of
            law principles.</p>
        </div>
      </section>

      <p style={{ ...S.p, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        Products sold by Iron Within Research are for research use only and are not for human
        consumption. See our <Link href="/terms" style={{ color: 'var(--primary-blue)' }}>Terms</Link>{' '}
        and <Link href="/privacy" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}

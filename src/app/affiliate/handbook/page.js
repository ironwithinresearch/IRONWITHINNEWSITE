'use client';
// src/app/affiliate/handbook/page.js
// The Iron Within affiliate handbook — native, gated (lives under /affiliate).
// "Print / Save as PDF" uses window.print(); a print stylesheet isolates the
// handbook so the site chrome is dropped from the printout.

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Printer, ShieldAlert, ShieldCheck, Sparkles, DollarSign,
  Link2, TrendingUp, LifeBuoy, Gift, ScrollText, CheckSquare,
} from 'lucide-react';

const C = {
  cyan: '#00CFFF',
  green: '#34d399',
  pink: '#EC4899',
  card: 'var(--card-dark)',
  cardEl: 'var(--card-elevated)',
  border: 'var(--glass-border)',
  ink: 'var(--text-light)',
  dim: 'var(--text-secondary)',
  muted: 'var(--text-muted)',
};

function Eyebrow({ icon: Icon, children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10, color: C.cyan, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
      {Icon ? <Icon size={14} /> : null}{children}
    </div>
  );
}

function Section({ n, icon, kicker, title, children }) {
  return (
    <section style={{ padding: '30px 0', borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 800, color: C.cyan, letterSpacing: '0.08em' }}>{n}</span>
        <Eyebrow icon={icon}>{kicker}</Eyebrow>
      </div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.55rem', fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{title}</h2>
      <div style={{ color: C.dim, fontSize: '1rem', lineHeight: 1.65 }}>{children}</div>
    </section>
  );
}

function Callout({ tone = 'info', label, children }) {
  const tint = tone === 'rule' ? C.pink : tone === 'tip' ? C.green : C.cyan;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${tint}`, borderRadius: 12, padding: '16px 20px', margin: '18px 0' }}>
      {label ? <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: tint, marginBottom: 8 }}>{label}</div> : null}
      <div style={{ color: C.dim, fontSize: '0.96rem', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function Bullets({ items, tint = C.cyan }) {
  return (
    <ul style={{ listStyle: 'none', margin: '12px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it, i) => (
        <li key={i} style={{ position: 'relative', paddingLeft: 22, color: C.dim, lineHeight: 1.55 }}>
          <span style={{ position: 'absolute', left: 2, top: 9, width: 7, height: 7, background: tint, borderRadius: 2, transform: 'rotate(45deg)' }} />
          {it}
        </li>
      ))}
    </ul>
  );
}

const B = ({ children }) => <strong style={{ color: C.ink, fontWeight: 700 }}>{children}</strong>;
const C2 = ({ children }) => <code style={{ fontFamily: 'var(--font-body)', background: C.cardEl, border: `1px solid ${C.border}`, padding: '1px 7px', borderRadius: 5, color: C.cyan, fontSize: '0.86em', whiteSpace: 'nowrap' }}>{children}</code>;

export default function AffiliateHandbookPage() {
  const print = () => { try { window.print(); } catch { /* noop */ } };

  return (
    <div id="iw-handbook" style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* top actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 26, flexWrap: 'wrap' }}>
        <Link href="/affiliate/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: C.dim, fontSize: '0.9rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to resources
        </Link>
        <button onClick={print} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', color: '#001018', fontWeight: 800, fontSize: '0.9rem', background: 'var(--gradient-primary)', boxShadow: '0 0 18px rgba(0,207,255,0.3)', fontFamily: 'var(--font-body)' }}>
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {/* masthead */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <Image src="/logo-mark.png" alt="Iron Within Research" width={52} height={52} style={{ filter: 'drop-shadow(0 0 12px rgba(0,207,255,0.45))' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.1em', color: '#fff' }}>IRON WITHIN</div>
          <div style={{ fontSize: '0.66rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.cyan, fontWeight: 700 }}>Research · Lab-Tested Peptides</div>
        </div>
      </div>
      <Eyebrow icon={Sparkles}>Affiliate Program</Eyebrow>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.02em' }}>The Affiliate Handbook</h1>
      <p style={{ color: C.dim, fontSize: '1.08rem', lineHeight: 1.6, maxWidth: '54ch' }}>
        Everything you need to promote Iron Within the right way — stay compliant, get customers taken care of fast, and climb from 10% to 20% commission.
      </p>

      <Section n="00" icon={Sparkles} kicker="Welcome" title="Welcome to the team">
        <p>You&apos;re now part of the Iron Within affiliate program — a group of creators and customers who earn real money by putting our research compounds in front of the people looking for them.</p>
        <p>You share your link or code, someone buys, you earn a commission on every order — and the more you drive, the higher your percentage climbs.</p>
        <Callout tone="info" label="The short version">
          Lead with <B>education, not hype</B>. Never make medical claims. Send problems to <B>support@ironwithin.io</B> fast. Stack the offers. Track your numbers in GoAffPro. Do those five things and you&apos;ll succeed here.
        </Callout>
      </Section>

      <Section n="01" icon={ShieldAlert} kicker="Compliance" title="The one rule that protects us all">
        <p>Iron Within sells <B>research-use-only</B> compounds. That single fact drives how we&apos;re allowed to talk about the products. Get this right and you&apos;ll never have a problem.</p>
        <Callout tone="rule" label="Never do this">
          <Bullets tint={C.pink} items={[
            <><B>No medical claims.</B> Don&apos;t say a product treats, cures, prevents, heals, or diagnoses anything.</>,
            <><B>No dosing advice.</B> Don&apos;t tell anyone how much to take or how to use it on themselves.</>,
            <><B>No human before/after claims</B> (&quot;I lost 20 lbs on this&quot;).</>,
            <><B>No &quot;FDA approved,&quot; &quot;safe,&quot; or &quot;prescription alternative&quot;</B> language.</>,
            <><B>No targeting minors</B> — our audience is 21+ only.</>,
          ]} />
        </Callout>
        <Callout tone="tip" label="Do this instead">
          <Bullets tint={C.green} items={[
            'Talk about the compound, its research category, and what studies are exploring — factually.',
            <>Point to our <B>Certificates of Analysis (COAs)</B> and third-party testing. Purity and transparency are our edge.</>,
            <>Use the phrase <B>&quot;for research purposes only&quot;</B> and let the science speak.</>,
            'Compare value, quality, and shipping — all fair game.',
          ]} />
        </Callout>
        <p style={{ color: C.muted, fontSize: '0.92rem' }}>Rule of thumb: if a claim would make sense on a supplement bottle at a pharmacy, don&apos;t make it. Our best affiliates sound like educators, not salespeople.</p>
      </Section>

      <Section n="02" icon={ShieldCheck} kicker="The product" title="What you're promoting">
        <p>Iron Within is a fast, modern store carrying a full catalog of research peptides and related compounds. Worth knowing so you can speak to them:</p>
        <Bullets items={[
          <><B>Tested &amp; transparent</B> — every order ships with a Certificate of Analysis. Always lead here.</>,
          <><B>Account required (21+)</B> — a quick account unlocks rewards, credits, and reorders.</>,
          <><B>Fast, tracked shipping</B> — US, Canada &amp; international, with real tracking on every order.</>,
          <><B>Built-in loyalty</B> — points, store credit, referrals &amp; Research Plans keep customers coming back (see §07).</>,
        ]} />
        <p>Know a handful of hero products well — their COAs, research category, and price — rather than pitching the whole catalog. Depth converts better than breadth.</p>
      </Section>

      <Section n="03" icon={DollarSign} kicker="Commission" title="How you get paid">
        <p>You earn a percentage of every qualifying order placed through your link or with your code. Your rate rises with the sales you drive each month.</p>
        <div style={{ overflowX: 'auto', margin: '18px 0', border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 460 }}>
            <thead>
              <tr>
                {['Level', 'Monthly sales you drive', 'Commission'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, fontWeight: 700, background: C.card, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['Starter', '$0 – $2,499 / mo', '10%'], ['Builder', '$2,500+ / mo', '15%'], ['Elite', '$15,000+ / mo', '20%']].map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: '13px 16px', color: C.ink, fontWeight: 700, borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>{r[0]}</td>
                  <td style={{ padding: '13px 16px', color: C.dim, borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>{r[1]}</td>
                  <td style={{ padding: '13px 16px', color: C.cyan, fontWeight: 800, fontSize: '1.05rem', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout tone="info" label="Get paid 2× — in store credit">
          Instead of cash, take your commission as Iron Within store credit worth <B>double</B> — earn $100, get $200 to spend on the store. Best deal we offer if you use the products yourself. Set it at <Link href="/affiliate/payout" style={{ color: C.cyan }}>/affiliate/payout</Link>.
        </Callout>
        <Callout tone="rule" label="Keep your code active">
          Your personal discount code has to stay in use. To keep it active, you need to drive <B>at least $1,000 in sales at least once every 2 months</B>. If it goes a full 2 months without hitting that mark, it may be paused until you&apos;re producing again — so keep it circulating.
        </Callout>
      </Section>

      <Section n="04" icon={Link2} kicker="Attribution" title="Your links & codes">
        <p>You get two ways to earn credit for a sale, and they both work:</p>
        <Bullets items={[
          <><B>Your referral link</B> — a click sets a tracking cookie that ties the sale to you. Pin it in your bio and captions.</>,
          <><B>Your discount code</B> — entered at checkout, you get credited even if they never clicked your link, and the customer gets a discount. Your most powerful tool.</>,
        ]} />
        <Callout tone="tip" label="Pro move">
          Always give people <B>both</B>: &quot;Shop through my link and use code <B>YOURCODE</B> to save.&quot; The code catches every sale the cookie misses. Find yours in your <a href="https://ironwithin.goaffpro.com/login" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan }}>GoAffPro dashboard</a>.
        </Callout>
      </Section>

      <Section n="05" icon={TrendingUp} kicker="Growth" title="Level up your commission">
        <p>Moving from 10% to 15% to 20% comes down to consistent monthly volume. The playbook our top affiliates run:</p>
        <p style={{ color: C.ink, fontWeight: 700, marginTop: 18 }}>Create like an educator</p>
        <Bullets items={[
          <><B>Explain, don&apos;t hype.</B> &quot;Here&apos;s what this compound is and what studies are looking at&quot; beats &quot;this changed my life&quot; — and keeps you compliant.</>,
          <><B>Show the COAs.</B> A screen recording of a Certificate of Analysis builds more trust than any claim.</>,
          <><B>Comparison content wins.</B> Purity, price, shipping, testing — line Iron Within up honestly.</>,
        ]} />
        <p style={{ color: C.ink, fontWeight: 700, marginTop: 18 }}>Make it easy to buy</p>
        <Bullets items={[
          <><B>Every post has your code.</B> Cut the friction between interested and checkout.</>,
          <><B>Stack the offers</B> (see §07) — Research Plans, the referral credit, rewards. More reasons to buy.</>,
          <><B>Pin and repeat.</B> New followers should hit your offer within seconds.</>,
        ]} />
        <Callout tone="info" label="The math">
          At 10%, driving $2,500/mo earns you $250. Cross that line and everything pays <B>15%</B> — the same effort is now worth $375. Elite (20%) doubles your starting rate on identical volume.
        </Callout>
      </Section>

      <Section n="06" icon={LifeBuoy} kicker="Customer care" title="When a customer has a problem">
        <p>Sometimes a customer comes to <em>you</em> with an issue — a delayed order, a damaged package, an account question. The move is always the same: <B>get them to our support team with the right information</B>, quickly.</p>
        <Callout tone="info" label="Send them here">
          <span style={{ fontSize: '1.05rem', color: C.ink }}><B>Email support@ironwithin.io</B></span> — the fastest, most reliable way to reach us. (They can also use the Contact page at <C2>ironwithin.io/contact</C2>.)
        </Callout>
        <p style={{ color: C.ink, fontWeight: 700, marginTop: 8 }}>What to tell them to include</p>
        <Bullets items={[
          <><B>Order number</B> — on their confirmation email and in their account.</>,
          <><B>The email on their account</B> — so we can find them instantly.</>,
          <><B>Which product</B> the issue is about.</>,
          <><B>What went wrong</B>, in plain language — expected vs. what happened.</>,
          <><B>Photos</B> if anything arrived damaged, wrong, or leaking.</>,
        ]} />
        <p style={{ color: C.ink, fontWeight: 700, marginTop: 8 }}>Hand them this template</p>
        <div style={{ background: 'var(--bg-deeper, #010410)', border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', margin: '12px 0', fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.7, color: C.dim, whiteSpace: 'pre-wrap' }}>
{`To: support@ironwithin.io
Subject: Order #[order number] — [short description]

Hi Iron Within team,

Order number: [#_____]
Account email: [_____]
Product: [_____]
What happened: [describe the issue]
Photos attached: [yes / no]

Thanks!`}
        </div>
        <Callout tone="rule" label="Your boundaries">
          <Bullets tint={C.pink} items={[
            <><B>Don&apos;t promise a refund, replacement, or timeline</B> on our behalf — say &quot;our team will take care of you&quot; and route them to support.</>,
            <><B>Don&apos;t give health or usage advice.</B> Same compliance rule as everywhere else.</>,
            <><B>Don&apos;t collect payment info or passwords.</B> Ever. Support won&apos;t ask for those in a DM either.</>,
          ]} />
        </Callout>
      </Section>

      <Section n="07" icon={Gift} kicker="Loyalty engine" title="The Rewards program">
        <p>Iron Within has a full loyalty stack, and every piece is a reason for a customer to buy through <em>you</em> and come back. Know these cold — they&apos;re your closing arguments.</p>
        <p style={{ color: C.ink, fontWeight: 700, marginTop: 14 }}>IWR Rewards — points on every order</p>
        <Bullets items={[
          <>Customers earn <B>5 points per $1</B> spent.</>,
          <><B>250 bonus points</B> just for creating an account.</>,
          <><B>500 points = $5 off</B>, redeemed right in the cart.</>,
          <>Managed at <C2>ironwithin.io/rewards</C2>.</>,
        ]} />
        <p style={{ color: C.ink, fontWeight: 700, marginTop: 14 }}>VIP tiers — the more they spend, the faster they earn</p>
        <p style={{ margin: '6px 0' }}>As customers climb, their multiplier grows (up to 2× earning): <B>Iron → Steel → Titanium → Black Label</B>.</p>
        <p style={{ color: C.ink, fontWeight: 700, marginTop: 14 }}>More offers to stack</p>
        <Bullets items={[
          <><B>Refer a friend</B> (code REFER25) — give $25, get $25.</>,
          <><B>Research Plans</B> — prepaid 3 &amp; 6-month supply with bonus points; big-ticket orders under your code.</>,
          <><B>Store credit &amp; gift cards</B> — spend like cash and auto-apply at checkout.</>,
        ]} />
        <Callout tone="tip" label="Why this matters to you">
          Every one of these makes a customer <B>buy more and buy again</B> — and repeat orders keep counting toward your monthly volume and commission tier. Point customers at rewards early and often.
        </Callout>
      </Section>

      <Section n="08" icon={ScrollText} kicker="The rules" title="Rules & code of conduct">
        <p>Break these and commissions can be withheld or your account closed. They keep the program — and your income — safe.</p>
        <Bullets items={[
          <><B>Honesty is non-negotiable.</B> No fake reviews, invented results, or screenshots that aren&apos;t yours.</>,
          <><B>No trademark bidding.</B> Don&apos;t run ads on our brand name — it competes with the store for the same customer.</>,
          <><B>No self-dealing.</B> Using your own code on your own orders for commission isn&apos;t allowed (you can still use it as a normal discount — just no commission).</>,
          <><B>Stay active</B> — drive at least $1,000 in sales at least once every 2 months to keep your code (see §03).</>,
          <><B>Disclose that you&apos;re an affiliate</B> and follow FTC + platform rules and local law.</>,
        ]} />
      </Section>

      <Section n="09" icon={CheckSquare} kicker="Get started" title="Your first-week checklist">
        <Bullets items={[
          <>Log into <B>GoAffPro</B> and grab your referral link + discount code.</>,
          <>Add your <B>link + code</B> to your bio / link-in-bio.</>,
          <>Pick <B>2–3 hero products</B> and read their COAs.</>,
          <>Set your <B>payout preference</B> — cash or 2× store credit — at <C2>/affiliate/payout</C2>.</>,
          <>Save the <B>support email + template</B> (§06) for any customer who needs help.</>,
          <>Post your <B>first educational piece</B> — compliant, COA-forward, code in the caption.</>,
          <>Grab ready-made assets from the <Link href="/affiliate/resources" style={{ color: C.cyan }}>swipe pack</Link>.</>,
        ]} />
        <Callout tone="info" label="You've got this">
          Educate, stay compliant, take care of people, and stack the offers. Do that consistently and 15% — then 20% — takes care of itself. Welcome to Iron Within.
        </Callout>
      </Section>

      <p style={{ marginTop: 30, paddingTop: 20, borderTop: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', lineHeight: 1.6 }}>
        Iron Within products are sold for research purposes only and are not for human consumption. Affiliates must not make medical, therapeutic, or dosing claims, and must market only to audiences 21 and older. Commission rates, thresholds, and program terms may be updated by Iron Within. This handbook is for approved affiliates — please don&apos;t republish it publicly.
      </p>

      <style dangerouslySetInnerHTML={{ __html: '@media print{ body *{visibility:hidden!important} #iw-handbook, #iw-handbook *{visibility:visible!important} #iw-handbook{position:absolute;left:0;top:0;width:100%;max-width:100%;padding:0 8px} .no-print{display:none!important} }' }} />
    </div>
  );
}

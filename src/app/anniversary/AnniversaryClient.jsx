'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import {
  annCalendar, annToday, isRevealed, revealAt, ANN_START, ANN_END, FLASH_TIMES_CT,
  PASSPORT_TIERS, PASSPORT_MAX, PASSPORT_MIN_ORDER, HOLD_TIERS, holdTierPrice, hms, ctTime,
} from '@/lib/anniversary';

/* /anniversary — the 31-day calendar for Anniversary Month.

   Everything that depends on the clock is resolved in an effect, never during render: the
   page is statically generated, so a server-side "now" would be baked into the HTML and the
   client would disagree on hydration (React #418). Before the first tick `now` is 0 and the
   page renders a neutral shell — every day locked except the always-shown finale. */

const C = {
  ink: '#F6EDE2', muted: '#CDBCA8', dim: '#9C8A78',
  ember: '#FF7A18', gold: '#FFB020', blood: '#B4121B', green: '#4ADE80',
  card: '#140C06', card2: '#1B1410', line: 'rgba(255,122,24,0.22)', lineHot: 'rgba(255,122,24,0.6)',
};
const HEAD = { fontFamily: 'var(--font-heading, Orbitron, sans-serif)' };
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ICON = {
  sitewide: '🎉', category: '🧪', flash: '⚡', loyalty: '⭐', credit: '💳',
  stack: '📦', passport: '🎟️', finale: '🏆', none: '🎃',
};

function stampSet(me) {
  const out = new Set();
  (me?.stamp_days || []).forEach((v) => {
    if (typeof v === 'number') out.add(v);
    else if (typeof v === 'string') {
      const m = v.match(/-10-(\d{2})/);
      if (m) out.add(Number(m[1]));
    }
  });
  return out;
}

export default function AnniversaryClient() {
  const days = useMemo(() => annCalendar(), []);
  const [now, setNow] = useState(0);
  const [flash, setFlash] = useState(null);
  const [feed, setFeed] = useState(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const tick = setInterval(() => setNow(Date.now()), 1000);

    let live = true;
    const loadFlash = () => fetch('/api/flash', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && d && Array.isArray(d.windows)) setFlash(d); })
      .catch(() => {});
    loadFlash();
    const poll = setInterval(loadFlash, 60000);

    const t = getToken();
    setSignedIn(!!t);
    fetch('/api/anniversary', { cache: 'no-store', headers: t ? { Authorization: `Bearer ${t}` } : {} })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live) setFeed(d || { available: false, me: null }); })
      .catch(() => { if (live) setFeed({ available: false, me: null }); });

    return () => { live = false; clearInterval(tick); clearInterval(poll); };
  }, []);

  const me = feed?.available ? feed.me : null;
  const stamps = stampSet(me);

  return (
    <div className="ann-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* HERO */}
      <section className="ann-wrap ann-hero">
        <div className="ann-kicker">Iron Within Research · Anniversary Month</div>
        <h1 style={{ ...HEAD }} className="ann-h1">
          Iron Within <span className="ann-grad">turns one</span>
        </h1>
        <p className="ann-sub">
          31 days of deals, <strong style={{ color: C.ink }}>October 1–31</strong>. A new deal every day at
          midnight CT — each one revealed the night before at 11pm.
        </p>
      </section>

      {/* TODAY */}
      <section className="ann-wrap" aria-labelledby="ann-today-h">
        <h2 id="ann-today-h" className="ann-label">Today&apos;s deal</h2>
        <TodayCard now={now} days={days} flash={flash} />
      </section>

      {/* CALENDAR */}
      <section className="ann-wrap" aria-labelledby="ann-cal-h">
        <h2 id="ann-cal-h" className="ann-label">The calendar</h2>
        <Calendar now={now} days={days} stamps={stamps} />
        <p className="ann-note">
          Times are Central (CT). Prices change automatically at midnight — no code needed.
          Sale depth applies to in-stock items; products running low may sit out a day.
        </p>
      </section>

      {/* PASSPORT */}
      <section className="ann-wrap" aria-labelledby="ann-pp-h">
        <div className="ann-panel">
          <h2 id="ann-pp-h" style={{ ...HEAD }} className="ann-h2">🎟️ The Anniversary Passport</h2>
          <p className="ann-p">
            Every day in October you place a paid order of <strong>${PASSPORT_MIN_ORDER} or more</strong>, you
            earn a stamp — one per day. Collect stamps and we add store credit to your account:
          </p>
          <div className="ann-tiers">
            {PASSPORT_TIERS.map((t) => (
              <div key={t.stamps} className="ann-tier">
                <div className="ann-tier-n" style={HEAD}>{t.stamps}</div>
                <div className="ann-tier-l">stamps</div>
                <div className="ann-tier-c">+${t.credit} credit</div>
              </div>
            ))}
          </div>
          <p className="ann-p">
            That&apos;s up to <strong>${PASSPORT_MAX} in store credit</strong> across the month. Five stamps also
            makes you a <strong>Passport holder</strong>, which unlocks Early Access on October 29 — 50% off
            sitewide a day before everyone else gets the finale.
          </p>
          <p className="ann-fine">
            A stamp counts the order total before store credit is applied (merch excluded), on a paid order that
            isn&apos;t cancelled or refunded. Days are Central time.
          </p>
          <PassportProgress feed={feed} signedIn={signedIn} />
        </div>
      </section>

      {/* HOLD & SHIP */}
      <section className="ann-wrap" aria-labelledby="ann-hold-h">
        <div className="ann-panel">
          <h2 id="ann-hold-h" style={{ ...HEAD }} className="ann-h2">📦 Hold &amp; Ship Together</h2>
          <p className="ann-p">
            Ordering on more than one day this month? Tick <strong>&ldquo;Hold my order — I&apos;m ordering again
            this month&rdquo;</strong> at checkout. The order is paid as normal with <strong>$0 shipping</strong>,
            and we keep it on the shelf for you.
          </p>
          <p className="ann-p">
            When you place an order <em>without</em> the box ticked, everything you held ships together in one
            box. Shipping on that last order is set by how many different days are in the box:
          </p>
          <div className="ann-table" role="table" aria-label="Hold and Ship shipping prices">
            <div role="row" className="ann-tr ann-th">
              <span role="columnheader">Days in the box</span><span role="columnheader">Shipping, once</span>
            </div>
            {HOLD_TIERS.map((t) => (
              <div role="row" key={t.days} className="ann-tr">
                <span role="cell">{t.days} days</span><span role="cell" className="ann-money">${t.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="ann-fine">
            Holds run to October 31. If anything is still on hold on November 2, we&apos;ll email you once to pay
            the box shipping for your tier, and it ships as soon as that&apos;s paid.
          </p>
          <HoldStatus me={me} />
        </div>
      </section>

      {/* STACKING */}
      <section className="ann-wrap">
        <div className="ann-stack">
          <span aria-hidden style={{ fontSize: '1.4rem' }}>🔗</span>
          <p style={{ margin: 0 }}>
            <strong>Your affiliate code stacks on every day</strong> except Flash Saturday windows — flash items
            take no code.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
          <Link href="/shop" className="ann-cta">Shop the store <span aria-hidden>→</span></Link>
        </div>
        <p className="ann-ruo">
          All products are sold strictly for laboratory research use only. Not for human or veterinary use.
          Must be 21+ to purchase.
        </p>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- today */

function TodayCard({ now, days, flash }) {
  if (!now) return <div className="ann-today ann-skel" aria-hidden />;

  if (now < ANN_START) {
    const first = days[0];
    return (
      <div className="ann-today">
        <div className="ann-today-k">Starts at midnight CT</div>
        <div className="ann-today-name" style={HEAD}>Kicks off in</div>
        <Clock ms={ANN_START - now} />
        {isRevealed(1, now) ? (
          <p className="ann-today-p">Day 1: <strong>{first.name}</strong> — {first.headline}.</p>
        ) : (
          <p className="ann-today-p">Day 1 is revealed tonight at 11pm CT.</p>
        )}
      </div>
    );
  }

  if (now >= ANN_END) {
    return (
      <div className="ann-today">
        <div className="ann-today-name" style={HEAD}>That&apos;s a wrap</div>
        <p className="ann-today-p">Thank you for a great first year. Anniversary Month has ended.</p>
        <Link href="/shop" className="ann-cta">Shop the store <span aria-hidden>→</span></Link>
      </div>
    );
  }

  const today = annToday(now, days);
  const tomorrow = days.find((x) => x.d === today.d + 1);
  const showTomorrow = tomorrow && isRevealed(tomorrow.d, now) && now >= revealAt(tomorrow.d);

  return (
    <div className={`ann-today ann-k-${today.kind}`}>
      <div className="ann-today-k">
        <span className="ann-dot" aria-hidden /> Live now · {WEEKDAYS[today.weekday]}, Oct {today.d}
      </div>
      <div className="ann-today-name" style={HEAD}>
        <span aria-hidden>{ICON[today.kind]} </span>{today.name}
      </div>
      <div className="ann-today-head">{today.headline}</div>
      {today.detail ? <p className="ann-today-p">{today.detail}</p> : null}

      {today.kind === 'flash' ? <FlashWindows now={now} today={today} flash={flash} /> : null}

      <div className="ann-today-row">
        <Link href="/shop" className="ann-cta">Shop today&apos;s deal <span aria-hidden>→</span></Link>
        <div>
          <div className="ann-clock-l">Today&apos;s deal ends in</div>
          <Clock ms={today.end - now} />
        </div>
      </div>

      {showTomorrow ? (
        <p className="ann-tomorrow">
          <strong>Tomorrow:</strong> {tomorrow.name} — {tomorrow.headline}.
        </p>
      ) : null}
    </div>
  );
}

function Clock({ ms }) {
  return (
    <div className="ann-clock" role="timer" aria-live="off" style={HEAD}>{hms(ms)}</div>
  );
}

function FlashWindows({ now, today, flash }) {
  const wins = (flash?.windows || [])
    .map((w) => ({ s: Date.parse(w.start), e: Date.parse(w.end) }))
    .filter((w) => w.s >= today.start && w.s < today.end);

  if (!wins.length) {
    return (
      <ul className="ann-flash">
        {FLASH_TIMES_CT.map((t) => <li key={t} className="ann-fw">{t} CT</li>)}
      </ul>
    );
  }
  const next = wins.find((w) => now < w.e);
  return (
    <>
      <ul className="ann-flash">
        {wins.map((w) => {
          const st = now >= w.e ? 'done' : now >= w.s ? 'live' : 'up';
          return (
            <li key={w.s} className={`ann-fw ann-fw-${st}`}>
              {ctTime(w.s)} CT
              <span className="ann-fw-s">{st === 'done' ? 'Closed' : st === 'live' ? 'LIVE' : '20 min'}</span>
            </li>
          );
        })}
      </ul>
      {next ? (
        <p className="ann-today-p" style={{ marginTop: 10 }}>
          {now >= next.s
            ? <>Flash window <strong>live</strong> — closes in <strong className="ann-mono">{hms(next.e - now)}</strong>.</>
            : <>Next flash window opens in <strong className="ann-mono">{hms(next.s - now)}</strong>.</>}
        </p>
      ) : (
        <p className="ann-today-p" style={{ marginTop: 10 }}>Today&apos;s flash windows are done.</p>
      )}
    </>
  );
}

/* ------------------------------------------------------------- calendar */

function Calendar({ now, days, stamps }) {
  const lead = days[0].weekday; // Oct 1 2026 is a Thursday
  return (
    <div className="ann-cal" role="list">
      {WEEKDAYS.map((w) => <div key={w} className="ann-wd" aria-hidden>{w}</div>)}
      {Array.from({ length: lead }).map((_, i) => <div key={`b${i}`} className="ann-blank" aria-hidden />)}
      {days.map((d) => <DayCell key={d.d} d={d} now={now} stamped={stamps.has(d.d)} />)}
    </div>
  );
}

function DayCell({ d, now, stamped }) {
  const st = !now ? 'locked' : now >= d.end ? 'past' : now >= d.start ? 'today' : 'future';
  const shown = isRevealed(d.d, now || 0);
  const finale = d.kind === 'finale';

  let lockMsg = '';
  if (!shown) {
    if (!now) lockMsg = 'Revealed the night before';
    else {
      const r = revealAt(d.d);
      const sameNight = r - now < 24 * 3600000 && new Date(r - 5 * 3600000).getUTCDate() === new Date(now - 5 * 3600000).getUTCDate();
      lockMsg = sameNight ? 'Revealed tonight, 11pm CT' : `Revealed ${d.d === 1 ? 'Sep 30' : `Oct ${d.d - 1}`}, 11pm CT`;
    }
  }

  return (
    <div
      role="listitem"
      className={`ann-day ann-day-${st}${finale ? ' ann-day-finale' : ''}${shown ? '' : ' ann-day-locked'}`}
      aria-current={st === 'today' ? 'date' : undefined}
    >
      <div className="ann-day-top">
        <span className="ann-day-n" style={HEAD}>{d.d}</span>
        <span className="ann-day-wd">{WEEKDAYS[d.weekday]}</span>
        {st === 'today' ? <span className="ann-badge ann-badge-today">Today</span> : null}
        {st === 'past' ? <span className="ann-badge ann-badge-done">Done</span> : null}
      </div>
      {shown ? (
        <>
          <div className="ann-day-name"><span aria-hidden>{ICON[d.kind]} </span>{d.name}</div>
          <div className="ann-day-head">{d.headline}</div>
        </>
      ) : (
        <div className="ann-day-lock"><span aria-hidden>🔒 </span>{lockMsg}</div>
      )}
      {stamped ? <div className="ann-stamp" title="Passport stamp earned">✓ Stamped</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------- passport */

function PassportProgress({ feed, signedIn }) {
  if (!feed) return <div className="ann-me ann-skel-sm" aria-hidden />;

  if (!signedIn) {
    return (
      <div className="ann-me">
        <p style={{ margin: 0 }}>
          <Link href="/login?redirect=/anniversary" className="ann-link">Sign in</Link> to see your stamps.
        </p>
      </div>
    );
  }

  const me = feed.available ? feed.me : null;
  if (!me) {
    return (
      <div className="ann-me">
        <p style={{ margin: 0 }}>
          Your stamp count will show here once Passport tracking is switched on. Qualifying orders are counted
          from October 1 either way — nothing you do now is missed.
        </p>
      </div>
    );
  }

  const n = Number(me.stamps) || 0;
  const pct = Math.min(100, (n / 20) * 100);
  const next = me.next_tier && me.next_tier.stamps ? me.next_tier : null;
  return (
    <div className="ann-me">
      <div className="ann-me-row">
        <div>
          <div className="ann-me-big" style={HEAD}>{n}<span className="ann-me-of"> / 20 stamps</span></div>
          {me.passport_holder ? <div className="ann-holder">Passport holder ✓</div> : null}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="ann-me-l">Credit earned</div>
          <div className="ann-me-big" style={HEAD}>${Number(me.credit_earned || 0).toFixed(0)}</div>
        </div>
      </div>
      <div className="ann-bar" role="progressbar" aria-valuemin={0} aria-valuemax={20} aria-valuenow={Math.min(n, 20)} aria-label="Passport stamps">
        <div className="ann-bar-fill" style={{ width: `${pct}%` }} />
        {PASSPORT_TIERS.map((t) => (
          <span key={t.stamps} className={`ann-bar-mark${n >= t.stamps ? ' on' : ''}`} style={{ left: `${(t.stamps / 20) * 100}%` }} />
        ))}
      </div>
      <p className="ann-me-next">
        {next
          ? <>{next.stamps - n} more {next.stamps - n === 1 ? 'stamp' : 'stamps'} to unlock <strong>+${next.credit}</strong> credit.</>
          : <>You&apos;ve unlocked every Passport reward. Thank you.</>}
      </p>
    </div>
  );
}

function HoldStatus({ me }) {
  const h = me?.hold;
  if (!h || !h.active) return null;
  const days = Number(h.days) || 0;
  const price = h.tier_price != null ? Number(h.tier_price) : holdTierPrice(days + 1);
  const count = Array.isArray(h.orders) ? h.orders.length : 0;
  return (
    <div className="ann-me">
      <p style={{ margin: 0 }}>
        <strong>Your box:</strong> {count} held {count === 1 ? 'order' : 'orders'} across {days} {days === 1 ? 'day' : 'days'}.
        {price ? <> Ship it with your next order for <strong>${price.toFixed(2)}</strong> shipping.</> : null}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ css */

const CSS = `
.ann-page{min-height:100vh;padding-bottom:80px;color:${C.ink};
  background:radial-gradient(70% 50% at 50% -8%,rgba(255,122,24,0.20),transparent 60%),
             radial-gradient(50% 40% at 95% 25%,rgba(180,18,27,0.18),transparent 60%),#0A0603;}
.ann-wrap{max-width:1120px;margin:0 auto;padding:0 16px;}
.ann-hero{text-align:center;padding-top:48px;padding-bottom:28px;}
.ann-kicker{display:inline-block;padding:6px 14px;border-radius:999px;border:1px solid ${C.line};
  background:rgba(255,176,32,0.08);color:${C.gold};font-weight:800;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;margin-bottom:18px;}
.ann-h1{font-size:clamp(2.1rem,7vw,4.2rem);line-height:1.04;font-weight:900;margin:0 0 14px;letter-spacing:-.01em;color:${C.ink};}
.ann-grad{background:linear-gradient(135deg,#FFD27A 0%,${C.ember} 50%,${C.blood} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ann-sub{color:${C.muted};font-size:clamp(1rem,2.2vw,1.15rem);max-width:56ch;margin:0 auto;line-height:1.55;}
.ann-label{font-size:.74rem;letter-spacing:.18em;text-transform:uppercase;font-weight:800;color:${C.gold};margin:34px 0 12px;}
.ann-today{position:relative;border-radius:20px;padding:clamp(20px,4vw,36px);border:1px solid ${C.lineHot};
  background:radial-gradient(120% 140% at 10% 0%,#2A1405 0%,#140A04 50%,#0A0603 100%);
  box-shadow:0 0 44px rgba(255,106,0,0.18),inset 0 1px 0 rgba(255,176,32,0.18);}
.ann-skel{min-height:300px;opacity:.5}
.ann-skel-sm{min-height:64px;opacity:.4}
.ann-today-k{display:flex;align-items:center;gap:8px;font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:${C.gold};}
.ann-dot{width:9px;height:9px;border-radius:50%;background:${C.green};box-shadow:0 0 10px ${C.green};}
.ann-today-name{font-size:clamp(1.6rem,5vw,2.6rem);font-weight:900;margin:10px 0 6px;line-height:1.08;color:${C.ink};}
.ann-today-head{font-size:clamp(1.15rem,3.4vw,1.6rem);font-weight:800;color:${C.ember};line-height:1.25;}
.ann-today-p{color:${C.muted};margin:10px 0 0;max-width:62ch;line-height:1.55;}
.ann-today-row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:18px;margin-top:22px;}
.ann-clock-l{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:${C.dim};margin-bottom:2px;}
.ann-clock{font-variant-numeric:tabular-nums;font-weight:900;font-size:clamp(1.8rem,6vw,2.8rem);color:${C.gold};line-height:1;}
.ann-mono{font-variant-numeric:tabular-nums;color:${C.gold};}
.ann-tomorrow{margin:20px 0 0;padding-top:14px;border-top:1px dashed ${C.line};color:${C.muted};}
.ann-flash{list-style:none;padding:0;margin:16px 0 0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;}
@media(min-width:640px){.ann-flash{grid-template-columns:repeat(4,minmax(0,1fr));}}
.ann-fw{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:10px 12px;border-radius:12px;border:1px solid ${C.line};background:rgba(255,122,24,0.06);font-weight:700;}
.ann-fw-s{font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:${C.dim};}
.ann-fw-live{border-color:${C.ember};background:rgba(255,106,0,0.18);}
.ann-fw-live .ann-fw-s{color:${C.ember};}
.ann-fw-done{opacity:.5;}
.ann-cta{display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:12px 24px;border-radius:999px;font-weight:800;text-decoration:none;
  color:#170A02;background:linear-gradient(135deg,${C.gold},#FF6A00);box-shadow:0 8px 26px rgba(255,106,0,0.32);}
.ann-cta:focus-visible,.ann-link:focus-visible{outline:3px solid ${C.gold};outline-offset:3px;}
.ann-cal{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;}
.ann-wd,.ann-blank{display:none;}
@media(min-width:900px){
  .ann-cal{grid-template-columns:repeat(7,minmax(0,1fr));}
  .ann-wd{display:block;text-align:center;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:${C.dim};font-weight:800;padding-bottom:4px;}
  .ann-blank{display:block;}
  .ann-day-wd{display:none;}
}
.ann-day{position:relative;min-height:118px;border-radius:14px;padding:10px 11px;border:1px solid ${C.line};background:${C.card};display:flex;flex-direction:column;gap:4px;}
.ann-day-top{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.ann-day-n{font-size:1.15rem;font-weight:900;color:${C.ink};}
.ann-day-wd{font-size:.72rem;color:${C.dim};text-transform:uppercase;letter-spacing:.1em;}
.ann-day-name{font-weight:800;font-size:.86rem;line-height:1.25;color:${C.ink};}
.ann-day-head{font-size:.8rem;line-height:1.3;color:${C.ember};font-weight:700;}
.ann-day-lock{font-size:.76rem;color:${C.dim};line-height:1.35;margin-top:auto;}
.ann-day-locked{background:repeating-linear-gradient(135deg,#100A05 0 10px,#0D0804 10px 20px);}
.ann-day-past{opacity:.55;}
.ann-day-past .ann-day-head{color:${C.muted};}
.ann-day-today{border:2px solid ${C.ember};background:linear-gradient(160deg,#3A1A06,#170B04);box-shadow:0 0 24px rgba(255,106,0,0.35);}
.ann-day-finale{border-color:rgba(255,176,32,0.65);background:linear-gradient(160deg,#2C1607,#1A0707);}
.ann-day-finale .ann-day-head{color:${C.gold};}
.ann-badge{margin-left:auto;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;font-weight:800;padding:2px 7px;border-radius:999px;}
.ann-badge-today{background:${C.ember};color:#170A02;}
.ann-badge-done{background:rgba(255,255,255,0.08);color:${C.muted};}
.ann-stamp{align-self:flex-start;margin-top:auto;font-size:.66rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${C.green};border:1px solid rgba(74,222,128,0.5);padding:2px 7px;border-radius:6px;transform:rotate(-4deg);}
.ann-note{color:${C.dim};font-size:.8rem;margin:12px 0 0;line-height:1.5;}
.ann-panel{margin-top:34px;border-radius:20px;padding:clamp(20px,4vw,34px);border:1px solid ${C.line};background:${C.card};}
.ann-h2{font-size:clamp(1.25rem,3.6vw,1.75rem);font-weight:900;margin:0 0 12px;color:${C.ink};}
.ann-p{color:${C.muted};line-height:1.6;margin:0 0 14px;max-width:70ch;}
.ann-p strong{color:${C.ink};}
.ann-fine{color:${C.dim};font-size:.82rem;line-height:1.5;margin:0 0 4px;max-width:70ch;}
.ann-tiers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:4px 0 16px;max-width:560px;}
.ann-tier{text-align:center;padding:14px 8px;border-radius:14px;border:1px solid ${C.line};background:${C.card2};}
.ann-tier-n{font-size:1.8rem;font-weight:900;color:${C.gold};line-height:1;}
.ann-tier-l{font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:${C.dim};margin-top:4px;}
.ann-tier-c{font-weight:800;margin-top:8px;color:${C.ink};font-size:.92rem;}
.ann-table{max-width:420px;border:1px solid ${C.line};border-radius:14px;overflow:hidden;margin:0 0 14px;}
.ann-tr{display:flex;justify-content:space-between;padding:11px 14px;border-top:1px solid ${C.line};}
.ann-tr:first-child{border-top:0;}
.ann-th{background:${C.card2};font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:${C.dim};font-weight:800;}
.ann-money{font-weight:800;font-variant-numeric:tabular-nums;color:${C.ink};}
.ann-me{margin-top:16px;padding:14px 16px;border-radius:14px;border:1px dashed ${C.lineHot};background:rgba(255,122,24,0.05);color:${C.muted};line-height:1.5;}
.ann-me-row{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;}
.ann-me-big{font-size:1.8rem;font-weight:900;color:${C.ink};line-height:1;}
.ann-me-of{font-size:.8rem;color:${C.dim};font-weight:700;font-family:inherit;}
.ann-me-l{font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:${C.dim};margin-bottom:4px;}
.ann-holder{margin-top:6px;font-size:.72rem;font-weight:800;color:${C.green};letter-spacing:.06em;text-transform:uppercase;}
.ann-bar{position:relative;height:10px;border-radius:999px;background:rgba(255,255,255,0.08);margin:16px 0 10px;}
.ann-bar-fill{position:absolute;inset:0 auto 0 0;border-radius:999px;background:linear-gradient(90deg,${C.gold},${C.ember});}
.ann-bar-mark{position:absolute;top:-4px;width:4px;height:18px;margin-left:-2px;border-radius:2px;background:${C.dim};}
.ann-bar-mark.on{background:${C.green};}
.ann-me-next{margin:0;font-size:.9rem;}
.ann-link{color:${C.gold};font-weight:800;text-decoration:underline;text-underline-offset:3px;}
.ann-stack{margin-top:34px;display:flex;gap:12px;align-items:center;padding:16px 18px;border-radius:16px;border:1px solid rgba(255,176,32,0.4);background:rgba(255,176,32,0.07);color:${C.ink};line-height:1.5;}
.ann-ruo{text-align:center;color:${C.dim};font-size:.76rem;margin:28px auto 0;max-width:60ch;line-height:1.5;}
@media (prefers-reduced-motion: reduce){.ann-page *{transition:none!important;animation:none!important;}}
`;

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchRewards, redeemRewards, TIER_STYLE } from '@/lib/rewards';
import { Gift, ShoppingBag, TrendingUp, Cake, Sparkles, Copy, Check } from 'lucide-react';

const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
const nf = (n) => (n || 0).toLocaleString('en-US');

export default function RewardsPage() {
  const { isLoggedIn, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(0);
  const [redeemed, setRedeemed] = useState(null); // {code, dollars}
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    const r = await fetchRewards();
    setData(r);
    setLoading(false);
  };
  useEffect(() => { if (isLoggedIn) load(); else setLoading(false); }, [isLoggedIn]);

  const doRedeem = async (dollars) => {
    setErr(''); setRedeeming(dollars);
    const res = await redeemRewards(dollars);
    setRedeeming(0);
    if (res?.success) { setRedeemed({ code: res.code, dollars: res.dollars }); load(); }
    else setErr(res?.error || 'Could not redeem.');
  };

  const copy = (code) => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  const points = data?.points || 0;
  const value = data?.value || 0;
  const tier = data?.tier;
  const cur = tier?.current;
  const next = tier?.next;
  const tStyle = cur ? (TIER_STYLE[cur.key] || TIER_STYLE.iron) : TIER_STYLE.iron;
  const redeemStep = data?.redeem_dollars || 10;
  const redeemPts = data?.redeem_points || 500;
  const maxRedeem = Math.floor(points / redeemPts) * redeemStep;
  const options = [];
  for (let d = redeemStep; d <= maxRedeem && options.length < 5; d += redeemStep) options.push(d);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '60px 24px 90px' }}>
      <div className="container" style={{ maxWidth: 940 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ display: 'inline-block', padding: '5px 16px', background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.3)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary-blue)', marginBottom: 16 }}>Loyalty Program</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, color: '#fff', margin: '0 0 12px' }}>IWR Rewards</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto' }}>
            Earn points on every order, climb the ranks, and cash in for real money off. The more you research with us, the more you get back.
          </p>
        </div>

        {/* Balance / tier card OR join pitch */}
        {!isLoggedIn ? (
          <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 22, padding: '38px 28px', textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>Join free &amp; get 100 points</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 22px' }}>Create an account to start earning — it&apos;s free, and you&apos;ll get a 100-point welcome bonus instantly.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/account" style={{ padding: '13px 30px', background: 'var(--gradient-primary)', borderRadius: 10, color: '#fff', fontWeight: 800, textDecoration: 'none', boxShadow: 'var(--glow-blue)' }}>Create account</Link>
              <Link href="/account" style={{ padding: '13px 30px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text-light)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading your rewards…</div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg, var(--card-dark), var(--card-elevated))', border: `1px solid ${tStyle.glow}`, borderRadius: 22, padding: '32px', marginBottom: '40px', boxShadow: `0 0 40px -16px ${tStyle.glow}` }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Your balance</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{nf(points)}</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>points</span>
                </div>
                <div style={{ color: '#34d399', fontWeight: 700, marginTop: 6 }}>= {money(value)} to spend</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 92, height: 92, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', background: `radial-gradient(circle, ${tStyle.glow}, transparent 70%)`, border: `2px solid ${tStyle.color}` }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.95rem', color: tStyle.color, textAlign: 'center', lineHeight: 1.1 }}>{cur?.name}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Your tier</div>
              </div>
            </div>
            {next && (
              <div style={{ marginTop: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 7 }}>
                  <span><strong style={{ color: 'var(--text-light)' }}>{nf(tier.to_next)}</strong> pts to {next.name}</span>
                  <span style={{ color: TIER_STYLE[next.key]?.color }}>{next.name} ⟶</span>
                </div>
                <div style={{ height: 9, borderRadius: 999, background: 'var(--bg-dark)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${tier.progress}%`, borderRadius: 999, background: 'var(--gradient-primary)', transition: 'width .5s' }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Redeem */}
        {isLoggedIn && !loading && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={sectionH}>Cash in your points</h2>
            {redeemed ? (
              <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 16, padding: '22px', textAlign: 'center' }}>
                <Check size={22} color="#34d399" />
                <p style={{ color: 'var(--text-light)', fontWeight: 700, margin: '8px 0 4px' }}>You redeemed {money(redeemed.dollars)} off!</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 14px' }}>Apply this code at checkout — it&apos;s reserved for your account.</p>
                <button onClick={() => copy(redeemed.code)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'var(--card-elevated)', border: '1px dashed var(--primary-blue)', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.04em' }}>
                  {redeemed.code} {copied ? <Check size={15} color="#34d399" /> : <Copy size={15} />}
                </button>
              </div>
            ) : maxRedeem >= redeemStep ? (
              <>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 16px' }}>{nf(redeemPts)} points = {money(redeemStep)} off. Pick an amount:</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {options.map((d) => (
                    <button key={d} disabled={redeeming > 0} onClick={() => doRedeem(d)} style={{ flex: '1 1 130px', padding: '18px', background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 14, cursor: redeeming ? 'wait' : 'pointer', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{redeeming === d ? '…' : `${money(d)} off`}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 3 }}>{nf(d / redeemStep * redeemPts)} points</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 14, padding: '22px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                You&apos;re <strong style={{ color: 'var(--text-light)' }}>{nf(Math.max(0, redeemPts - points))} points</strong> from your first {money(redeemStep)} reward. Keep going!
              </div>
            )}
            {err && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: 12 }}>{err}</p>}
          </section>
        )}

        {/* Ways to earn */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={sectionH}>Ways to earn</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { icon: Gift, t: 'Create an account', d: 'Get a 100-point welcome bonus instantly — free to join.' },
              { icon: ShoppingBag, t: 'Shop', d: 'Earn 1 point for every $1 spent on every order.' },
              { icon: TrendingUp, t: 'Climb the tiers', d: 'Level up to earn up to 2× points on everything you buy.' },
              { icon: Cake, t: 'Birthday bonus', d: 'Black Label members get bonus points on their birthday.' },
            ].map((c, i) => (
              <div key={i} style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '22px' }}>
                <c.icon size={22} color="var(--primary-blue)" />
                <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '12px 0 6px' }}>{c.t}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tier ladder */}
        <section style={{ marginBottom: '20px' }}>
          <h2 style={sectionH}>VIP tiers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
            {(data?.tiers || DEFAULT_TIERS).map((t) => {
              const st = TIER_STYLE[t.key] || TIER_STYLE.iron;
              const isCur = cur?.key === t.key;
              return (
                <div key={t.key} style={{ background: 'var(--card-dark)', border: `1px solid ${isCur ? st.color : 'var(--glass-border)'}`, borderRadius: 16, padding: '22px', position: 'relative', boxShadow: isCur ? `0 0 30px -12px ${st.glow}` : 'none' }}>
                  {isCur && <span style={{ position: 'absolute', top: 14, right: 14, fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', color: st.color, textTransform: 'uppercase' }}>You</span>}
                  <Sparkles size={18} color={st.color} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: st.color, fontSize: '1.15rem', fontWeight: 900, margin: '10px 0 2px' }}>{t.name}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', marginBottom: 12 }}>{t.min === 0 ? 'Starting tier' : `${nf(t.min)}+ lifetime points`}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {t.perks.map((p, i) => (
                      <li key={i} style={{ display: 'flex', gap: 7, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        <Check size={14} color={st.color} style={{ flexShrink: 0, marginTop: 2 }} />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* History */}
        {isLoggedIn && data?.ledger?.length > 0 && (
          <section style={{ marginTop: '40px' }}>
            <h2 style={sectionH}>Recent activity</h2>
            <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, overflow: 'hidden' }}>
              {data.ledger.slice(0, 12).map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderTop: i ? '1px solid var(--glass-border)' : 'none' }}>
                  <div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 600 }}>{row.note}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>{(row.created_at || '').split(' ')[0]}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: row.points >= 0 ? '#34d399' : 'var(--text-muted)' }}>{row.points >= 0 ? '+' : ''}{nf(row.points)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

const sectionH = { fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '18px' };

const DEFAULT_TIERS = [
  { key: 'iron', name: 'Iron', min: 0, perks: ['1 point per $1 spent', '100-point welcome bonus'] },
  { key: 'steel', name: 'Steel', min: 500, perks: ['1.25× points per $1', 'Free U.S. shipping'] },
  { key: 'titanium', name: 'Titanium', min: 1500, perks: ['1.5× points per $1', 'Free U.S. shipping', 'Early access to restocks & drops'] },
  { key: 'black', name: 'Black Label', min: 4000, perks: ['2× points per $1', 'Free U.S. shipping', 'Early access to drops', 'Birthday bonus points'] },
];

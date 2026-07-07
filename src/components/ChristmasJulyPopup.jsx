'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// First-visit-per-day modal during the 12 Days of Christmas in July (Jul 14–25 CT).
// Reminds shoppers to scratch today's card; once per calendar day per visitor.
const XJ_START = Date.parse('2026-07-14T05:00:00Z');
const XJ_END = Date.parse('2026-07-26T05:00:00Z');

function ctDate() {
  const d = new Date(Date.now() - 5 * 3600000);
  return d.toISOString().slice(0, 10);
}
function dayNum() {
  const t = new Date(Date.now() - 5 * 3600000); t.setUTCHours(0, 0, 0, 0);
  return Math.min(12, Math.max(1, Math.round((t.getTime() - Date.parse('2026-07-14T00:00:00Z')) / 86400000) + 1));
}

export default function ChristmasJulyPopup() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const now = Date.now();
    if (now < XJ_START || now >= XJ_END) return;
    const key = 'iw_xj_popup_' + ctDate();
    if (localStorage.getItem(key)) return;
    const t = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  const close = () => { try { localStorage.setItem('iw_xj_popup_' + ctDate(), '1'); } catch {} setShow(false); };

  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: 400, width: '100%', borderRadius: 22, padding: '34px 26px 26px', textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(200,16,46,0.35), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(15,81,50,0.4), transparent 60%), #0e1420',
        border: '1px solid rgba(245,197,66,0.5)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={close} aria-label="Close" style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>×</button>
        <div style={{ fontSize: '2.6rem', lineHeight: 1 }}>🎄</div>
        <div style={{ marginTop: 8, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f5c542' }}>Day {dayNum()} of 12 is live</div>
        <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.55rem', fontWeight: 900, color: '#fff', margin: '4px 0 8px' }}>
          12 Days of <span style={{ background: 'linear-gradient(90deg,#ff5a6e,#f5c542,#3ddc84)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Christmas in July</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 6px' }}>
          Scratch today's card to reveal a brand-new deal — a different one every day through July 25. 🎟️
        </p>
        <p style={{ color: '#f5c542', fontSize: '0.88rem', fontWeight: 700, margin: '0 0 18px' }}>
          🏆 Shop all 12 days → win 1 of 5 <b style={{ color: '#fff' }}>$1,000 credits</b>
        </p>
        <Link href="/christmas-in-july" onClick={close} style={{ display: 'block', padding: '14px', borderRadius: 12, background: 'linear-gradient(90deg,#c8102e,#e63946)', color: '#fff', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 8px 26px rgba(200,16,46,0.45)' }}>
          Scratch Today's Card →
        </Link>
        <button onClick={close} style={{ marginTop: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>Maybe later</button>
      </div>
    </div>
  );
}

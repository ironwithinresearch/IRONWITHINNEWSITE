'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Advent scratch card. state: 'past' (revealed), 'live' (scratchable today), 'up' (locked).
// Future days carry NO deal content — only their date — so upcoming deals stay hidden.
export default function ScratchCard({ day, date, state, emoji, badge, sub, code }) {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(state === 'past');
  const canvasRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (state === 'live' && mounted && typeof window !== 'undefined') {
      if (localStorage.getItem('xj_scratched_' + day)) setRevealed(true);
    }
  }, [state, mounted, day]);

  useEffect(() => {
    if (state !== 'live' || revealed || !mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, '#c8102e'); g.addColorStop(0.5, '#0f5132'); g.addColorStop(1, '#c8102e');
    ctx.fillStyle = g; ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '800 13px -apple-system, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', rect.width / 2, rect.height / 2);
    ctx.globalCompositeOperation = 'destination-out';

    let down = false;
    const at = (e) => { const r = canvas.getBoundingClientRect(); const t = e.touches && e.touches[0]; return { x: (t ? t.clientX : e.clientX) - r.left, y: (t ? t.clientY : e.clientY) - r.top }; };
    const check = () => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0; for (let i = 3; i < d.length; i += 4) if (d[i] === 0) clear++;
      if (clear / (d.length / 4) > 0.45) { try { localStorage.setItem('xj_scratched_' + day, '1'); } catch {} setRevealed(true); }
    };
    const move = (e) => { if (!down) return; if (e.cancelable) e.preventDefault(); const { x, y } = at(e); ctx.beginPath(); ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.fill(); check(); };
    const start = () => { down = true; };
    const stop = () => { down = false; };
    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', start, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', stop);
    return () => {
      canvas.removeEventListener('mousedown', start); canvas.removeEventListener('mousemove', move); window.removeEventListener('mouseup', stop);
      canvas.removeEventListener('touchstart', start); canvas.removeEventListener('touchmove', move); window.removeEventListener('touchend', stop);
    };
  }, [state, revealed, mounted, day]);

  const border = state === 'live' ? '2px solid #f5c542' : state === 'past' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.14)';
  const dateStr = date ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  // Locked future card — no deal shown, can't scratch.
  if (state === 'up') {
    return (
      <div style={{ position: 'relative', borderRadius: 16, padding: 18, border, minHeight: 172, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', position: 'absolute', top: 14, left: 18 }}>DAY {day}</div>
        <div style={{ fontSize: '1.9rem' }}>🔒</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800, marginTop: 6 }}>Opens {dateStr}</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.76rem', marginTop: 2 }}>Come back to scratch it</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', borderRadius: 16, padding: 18, border, minHeight: 172, overflow: 'hidden',
      background: state === 'live' ? 'linear-gradient(135deg, rgba(200,16,46,0.22), rgba(42,157,92,0.18))' : 'rgba(255,255,255,0.03)',
      opacity: state === 'past' ? 0.6 : 1, boxShadow: state === 'live' ? '0 0 30px rgba(245,197,66,0.25)' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.55)' }}>DAY {day}</span>
        {state === 'live' && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0a1f14', background: '#3ddc84', padding: '2px 8px', borderRadius: 999 }}>TODAY</span>}
        {state === 'past' && <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>ended ✓</span>}
      </div>
      <div style={{ fontSize: '1.7rem', lineHeight: 1 }}>{emoji}</div>
      <div style={{ fontFamily: 'var(--font-heading, inherit)', fontWeight: 900, color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>{badge}</div>
      <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.82rem', lineHeight: 1.45 }}>{sub}</div>
      {code && <div style={{ marginTop: 10, display: 'inline-block', padding: '5px 12px', borderRadius: 8, background: state === 'live' ? '#fff' : 'rgba(255,255,255,0.1)', color: state === 'live' ? '#0f1729' : 'rgba(255,255,255,0.7)', fontWeight: 800, letterSpacing: '0.06em', fontSize: '0.82rem' }}>{code}</div>}
      {state === 'live' && revealed && <div style={{ marginTop: 10 }}><Link href="/shop" style={{ display: 'inline-block', padding: '9px 16px', borderRadius: 10, background: 'linear-gradient(90deg,#c8102e,#e63946)', color: '#fff', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>Shop now →</Link></div>}
      {/* scratch overlay — only today's card, until scratched */}
      {state === 'live' && !revealed && (
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'grab', touchAction: 'none', borderRadius: 16 }} />
      )}
    </div>
  );
}

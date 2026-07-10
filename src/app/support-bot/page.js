'use client';
// src/app/support-bot/page.js — preview page for the Iron Within support agent.
// Standalone so it doesn't touch the live layout or Re:amaze. Chats with /api/chat.

import { useState, useRef, useEffect } from 'react';

const CY = '#37c8ff', NAVY = '#0e1a30', BG = '#050c1c';

function Bub({ role, text, image }) {
  const bot = role !== 'user';
  return (
    <div style={{ display: 'flex', gap: 9, maxWidth: '88%', alignSelf: bot ? 'flex-start' : 'flex-end', flexDirection: bot ? 'row' : 'row-reverse' }}>
      {bot && <div style={{ width: 26, height: 26, borderRadius: '50%', flex: 'none', overflow: 'hidden', border: `1px solid ${CY}`, background: '#06101f', alignSelf: 'flex-end' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" style={{ width: '112%', height: '112%', objectFit: 'cover', mixBlendMode: 'screen' }} />
      </div>}
      <div style={{ padding: '11px 14px', borderRadius: 15, fontSize: 14.5, lineHeight: 1.5, whiteSpace: 'pre-wrap',
        ...(bot
          ? { background: '#122a4c', border: '1px solid rgba(120,180,235,.16)', borderBottomLeftRadius: 5, color: '#eef6fd' }
          : { background: `linear-gradient(135deg,#1f8fd6,${CY})`, color: '#03121f', fontWeight: 600, borderBottomRightRadius: 5 }) }}>
        {image && <img src={image} alt="attachment" style={{ maxWidth: 180, borderRadius: 8, marginBottom: text ? 8 : 0, display: 'block' }} />}
        <span dangerouslySetInnerHTML={{ __html: (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
          .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
          .replace(/\b(www\.[a-z0-9.-]+\.[a-z]{2,}|ironwithin\.io(?:\/[a-z-]+)?|peptideparadigm\.com)\b/g, (m) => `<a href="https://${m}" target="_blank" rel="noopener" style="color:#93e2ff;font-weight:600">${m}</a>`) }} />
      </div>
    </div>
  );
}

export default function SupportBot() {
  const [msgs, setMsgs] = useState([{ role: 'bot', text: "Hey there — I'm the **Iron Within** assistant. 👋\nI can check your order, help with a missing or damaged item, and answer questions about COAs, shipping, and your account. What can I do for you?" }]);
  const [val, setVal] = useState('');
  const [img, setImg] = useState(null);
  const [busy, setBusy] = useState(false);
  const scroller = useRef(null), fileRef = useRef(null);

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [msgs, busy]);

  const send = async (textArg) => {
    const text = (textArg ?? val).trim();
    if ((!text && !img) || busy) return;
    const userMsg = { role: 'user', text: text || '(photo)', image: img };
    const next = [...msgs, userMsg];
    setMsgs(next); setVal(''); const sentImg = img; setImg(null); setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
          image: sentImg || undefined,
        }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: 'bot', text: data.reply || 'Sorry, please try again.' }]);
    } catch {
      setMsgs((m) => [...m, { role: 'bot', text: 'Connection hiccup — please try again, or email support@ironwithin.io.' }]);
    }
    setBusy(false);
  };

  const pickImg = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setImg(r.result); r.readAsDataURL(f);
  };

  const chips = ['Track my order', 'A vial was missing', 'Do you have COAs?', 'How do I dose this?'];

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '22px 14px 30px', color: '#eef6fd',
      background: `radial-gradient(80% 45% at 50% -8%, rgba(55,200,255,.14), transparent 60%), linear-gradient(160deg,#0a1730 0%, ${BG} 55%, #061024 100%)`, backgroundAttachment: 'fixed', fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 14, maxWidth: 440 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: '#e2a24c', border: '1px solid rgba(226,162,76,.4)', background: 'rgba(226,162,76,.08)', padding: '4px 11px', borderRadius: 999, display: 'inline-block' }}>Preview · live on your store data</div>
      </div>

      <div style={{ width: '100%', maxWidth: 440, height: 'min(640px, 82dvh)', display: 'flex', flexDirection: 'column', background: NAVY, border: '1px solid rgba(120,180,235,.16)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 80px -28px rgba(0,0,0,.7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 18px', borderBottom: '1px solid rgba(120,180,235,.16)', background: 'linear-gradient(180deg, rgba(55,200,255,.06), transparent)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', overflow: 'hidden', border: `2px solid ${CY}`, background: '#06101f', position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" style={{ width: '110%', height: '110%', objectFit: 'cover', mixBlendMode: 'screen' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Iron Within Assistant</div>
            <div style={{ fontSize: 12, color: '#5fbf93', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5fbf93', boxShadow: '0 0 8px #5fbf93' }} /> Online · replies instantly
            </div>
          </div>
        </div>

        <div ref={scroller} style={{ flex: 1, overflowY: 'auto', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {msgs.map((m, i) => <Bub key={i} {...m} />)}
          {busy && <div style={{ display: 'flex', gap: 4, padding: '13px 15px', alignSelf: 'flex-start' }}>
            {[0, 1, 2].map((n) => <span key={n} style={{ width: 7, height: 7, borderRadius: '50%', background: '#728aa8', animation: `iwb 1.2s ${n * 0.2}s infinite` }} />)}
          </div>}
        </div>

        {msgs.length <= 1 && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '0 16px 10px' }}>
          {chips.map((c) => <button key={c} onClick={() => send(c)} style={{ fontSize: 12.5, color: '#93e2ff', border: '1px solid rgba(120,180,235,.16)', background: 'rgba(55,200,255,.06)', padding: '7px 12px', borderRadius: 999, cursor: 'pointer' }}>{c}</button>)}
        </div>}

        {img && <div style={{ padding: '0 14px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={img} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
          <span style={{ fontSize: 12, color: '#a4bad4' }}>Photo attached</span>
          <button onClick={() => setImg(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#728aa8', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>}

        <div style={{ display: 'flex', gap: 9, padding: '12px 14px', borderTop: '1px solid rgba(120,180,235,.16)', background: BG }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={pickImg} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} title="Attach a photo" style={{ width: 42, flex: 'none', border: '1px solid rgba(120,180,235,.16)', borderRadius: 12, background: '#06101f', color: '#93e2ff', cursor: 'pointer', fontSize: 18 }}>📎</button>
          <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask about your order, a missing item…" style={{ flex: 1, background: '#06101f', border: '1px solid rgba(120,180,235,.16)', borderRadius: 12, padding: '12px 14px', color: '#eef6fd', fontSize: 14.5, outline: 'none' }} />
          <button onClick={() => send()} disabled={busy} style={{ width: 44, flex: 'none', border: 'none', borderRadius: 12, cursor: busy ? 'default' : 'pointer', color: '#03121f', fontWeight: 800, fontSize: 18, opacity: busy ? 0.5 : 1, background: `linear-gradient(135deg,${CY},#1f8fd6)` }}>➤</button>
        </div>
      </div>

      <div style={{ maxWidth: 440, marginTop: 14, color: '#728aa8', fontSize: 12.5, textAlign: 'center', lineHeight: 1.6 }}>
        Try: <b style={{ color: '#a4bad4' }}>“has order 839 shipped? email ccartwright64@gmail.com”</b> · a dosing question · or “a vial was missing” + a photo.
      </div>

      <style dangerouslySetInnerHTML={{ __html: '@keyframes iwb{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}' }} />
    </div>
  );
}

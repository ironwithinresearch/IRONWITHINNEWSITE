'use client';
// Iron Within support chat — floating bubble + panel, mounted site-wide (replaces Re:amaze).
// Talks to /api/chat (Claude agent: order lookup + live delivery status + replacements + escalation).

import { useState, useRef, useEffect } from 'react';

const CY = '#37c8ff', NAVY = '#0e1a30', BG = '#050c1c', HAIR = 'rgba(120,180,235,.16)';

function render(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\b(www\.[a-z0-9.-]+\.[a-z]{2,}|ironwithin\.io(?:\/[a-z-]+)?|peptideparadigm\.com)\b/g,
      (m) => `<a href="https://${m}" target="_blank" rel="noopener" style="color:#93e2ff;font-weight:600">${m}</a>`);
}

function Bub({ role, text, image }) {
  const bot = role !== 'user';
  return (
    <div style={{ display: 'flex', gap: 8, maxWidth: '90%', alignSelf: bot ? 'flex-start' : 'flex-end', flexDirection: bot ? 'row' : 'row-reverse' }}>
      {bot && <div style={{ width: 24, height: 24, borderRadius: '50%', flex: 'none', overflow: 'hidden', border: `1px solid ${CY}`, background: '#06101f', alignSelf: 'flex-end' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" style={{ width: '112%', height: '112%', objectFit: 'cover', mixBlendMode: 'screen' }} />
      </div>}
      <div style={{ padding: '10px 13px', borderRadius: 14, fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap',
        ...(bot ? { background: '#122a4c', border: `1px solid ${HAIR}`, borderBottomLeftRadius: 4, color: '#eef6fd' }
                : { background: `linear-gradient(135deg,#1f8fd6,${CY})`, color: '#03121f', fontWeight: 600, borderBottomRightRadius: 4 }) }}>
        {image && <img src={image} alt="" style={{ maxWidth: 160, borderRadius: 8, marginBottom: text ? 7 : 0, display: 'block' }} />}
        <span dangerouslySetInnerHTML={{ __html: render(text) }} />
      </div>
    </div>
  );
}

export default function IWChatWidget({ autoOpen = false }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: 'bot', text: "Hey there — I'm the **Iron Within** assistant. 👋\nI can check your order & delivery status, help with a missing or damaged item, and answer questions about COAs, shipping, and your account. What can I do for you?" }]);
  const [val, setVal] = useState('');
  const [img, setImg] = useState(null);
  const [busy, setBusy] = useState(false);
  const scroller = useRef(null), fileRef = useRef(null);

  useEffect(() => { if (open && scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [msgs, busy, open]);

  // Proactively pop open (once per session) — used on the Contact page to catch
  // the customer before they fill out the form.
  useEffect(() => {
    if (!autoOpen) return;
    try { if (sessionStorage.getItem('iw_chat_autoopened')) return; } catch { /* noop */ }
    const t = setTimeout(() => { setOpen(true); try { sessionStorage.setItem('iw_chat_autoopened', '1'); } catch { /* noop */ } }, 1200);
    return () => clearTimeout(t);
  }, [autoOpen]);

  const send = async (textArg) => {
    const text = (textArg ?? val).trim();
    if ((!text && !img) || busy) return;
    const userMsg = { role: 'user', text: text || '(photo)', image: img };
    const next = [...msgs, userMsg];
    setMsgs(next); setVal(''); const sentImg = img; setImg(null); setBusy(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })), image: sentImg || undefined }) });
      const data = await res.json();
      setMsgs((m) => [...m, { role: 'bot', text: data.reply || 'Sorry, please try again.' }]);
    } catch {
      setMsgs((m) => [...m, { role: 'bot', text: 'Connection hiccup — please try again, or email support@ironwithin.io.' }]);
    }
    setBusy(false);
  };
  const pickImg = (e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setImg(r.result); r.readAsDataURL(f); };
  const chips = ['Track my order', 'A vial was missing', 'Do you have COAs?'];

  return (
    <>
      {/* launcher bubble */}
      <button onClick={() => setOpen((o) => !o)} aria-label="Chat with support"
        style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 9998, width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg,${CY},#1f8fd6)`, boxShadow: '0 10px 30px -6px rgba(55,200,255,.5), 0 0 0 1px rgba(55,200,255,.3)',
          display: open ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: '#03121f', fontSize: 26 }}>
        <span style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: '#5fbf93', border: '2px solid #050c1c' }} />
        💬
      </button>

      {/* panel */}
      {open && (
        <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999, width: 'min(390px, 100vw)', height: 'min(600px, 100dvh)', margin: 'clamp(0px, 2vw, 22px)',
          display: 'flex', flexDirection: 'column', background: NAVY, border: `1px solid ${HAIR}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 80px -24px rgba(0,0,0,.75)', fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderBottom: `1px solid ${HAIR}`, background: 'linear-gradient(180deg, rgba(55,200,255,.06), transparent)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flex: 'none', overflow: 'hidden', border: `2px solid ${CY}`, background: '#06101f' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.png" alt="" style={{ width: '110%', height: '110%', objectFit: 'cover', mixBlendMode: 'screen' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff' }}>Iron Within Assistant</div>
              <div style={{ fontSize: 11.5, color: '#5fbf93', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5fbf93', boxShadow: '0 0 8px #5fbf93' }} /> Online · replies instantly
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', color: '#728aa8', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
          </div>

          <div ref={scroller} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {msgs.map((m, i) => <Bub key={i} {...m} />)}
            {busy && <div style={{ display: 'flex', gap: 4, padding: '12px 14px', alignSelf: 'flex-start' }}>
              {[0, 1, 2].map((n) => <span key={n} style={{ width: 6, height: 6, borderRadius: '50%', background: '#728aa8', animation: `iwc 1.2s ${n * 0.2}s infinite` }} />)}
            </div>}
          </div>

          {msgs.length <= 1 && <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', padding: '0 14px 9px' }}>
            {chips.map((c) => <button key={c} onClick={() => send(c)} style={{ fontSize: 12, color: '#93e2ff', border: `1px solid ${HAIR}`, background: 'rgba(55,200,255,.06)', padding: '6px 11px', borderRadius: 999, cursor: 'pointer' }}>{c}</button>)}
          </div>}

          {img && <div style={{ padding: '0 13px 7px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={img} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
            <span style={{ fontSize: 12, color: '#a4bad4' }}>Photo attached</span>
            <button onClick={() => setImg(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#728aa8', cursor: 'pointer', fontSize: 15 }}>×</button>
          </div>}

          <div style={{ display: 'flex', gap: 8, padding: '11px 13px', borderTop: `1px solid ${HAIR}`, background: BG }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={pickImg} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} title="Attach a photo" style={{ width: 40, flex: 'none', border: `1px solid ${HAIR}`, borderRadius: 11, background: '#06101f', color: '#93e2ff', cursor: 'pointer', fontSize: 17 }}>📎</button>
            <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask about your order…" style={{ flex: 1, background: '#06101f', border: `1px solid ${HAIR}`, borderRadius: 11, padding: '11px 13px', color: '#eef6fd', fontSize: 14, outline: 'none' }} />
            <button onClick={() => send()} disabled={busy} style={{ width: 42, flex: 'none', border: 'none', borderRadius: 11, cursor: busy ? 'default' : 'pointer', color: '#03121f', fontWeight: 800, fontSize: 17, opacity: busy ? 0.5 : 1, background: `linear-gradient(135deg,${CY},#1f8fd6)` }}>➤</button>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: '@keyframes iwc{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}' }} />
    </>
  );
}

'use client';

// Flash-sale countdown bar (mu-plugin iw-flash.php via /api/flash).
// Renders nothing until the schedule has loaded (no SSR markup → no hydration mismatch) and
// nothing once the last window has closed, so it needs no cleanup after the event.
// Shown: from 3 hours before a window ("next flash in …") through the window ("ends in …").

import { useEffect, useState } from 'react';
import Link from 'next/link';

const LEAD_MS = 3 * 60 * 60 * 1000;

function clock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}:${sec}`;
}

function ctTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' });
}

export default function FlashBar() {
  const [data, setData] = useState(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let live = true;
    const load = () => fetch('/api/flash', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && d) setData(d); })
      .catch(() => {});
    load();
    const poll = setInterval(load, 60000);
    setNow(Date.now());
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => { live = false; clearInterval(poll); clearInterval(tick); };
  }, []);

  if (!data || !now || !Array.isArray(data.windows)) return null;
  const w = data.windows.find((x) => new Date(x.end).getTime() > now);
  if (!w) return null;
  const start = new Date(w.start).getTime();
  const end = new Date(w.end).getTime();
  const isLive = now >= start;
  if (!isLive && start - now > LEAD_MS) return null;

  return (
    <Link
      href="/shop"
      style={{
        display: 'block', textAlign: 'center', padding: '9px 14px', textDecoration: 'none',
        background: isLive ? 'linear-gradient(90deg,#b91c1c,#ef4444,#b91c1c)' : 'linear-gradient(90deg,#111827,#1f2937,#111827)',
        color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.4,
        borderBottom: isLive ? 'none' : '1px solid rgba(239,68,68,0.5)',
      }}
    >
      {isLive ? (
        <>⚡ <strong>FLASH SALE LIVE — up to 75% off RT-3 &amp; more</strong> · ends in <strong>{clock(end - now)}</strong> · Zelle, Venmo &amp; Cash App only →</>
      ) : (
        <>⚡ <strong>Flash sale at {ctTime(w.start)} CT</strong> — up to 75% off RT-3 &amp; more — 20 minutes only · starts in <strong>{clock(start - now)}</strong></>
      )}
    </Link>
  );
}

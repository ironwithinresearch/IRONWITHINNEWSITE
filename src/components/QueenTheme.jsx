'use client';
import { useEffect, useState } from 'react';

// "Whole-site dedicated to her" — Maleficent theme for the Birthday Bash window. Recolors the
// site accent to Maleficent's signature purple + poison-green so every CTA, link, and glow reads
// dark-fairy. Injected client-side, self-removes after the window; accent variables only.
const QB_START = Date.parse('2026-07-29T23:00:00Z');
const QB_END   = Date.parse('2026-08-03T05:00:00Z');

const CSS = `
  :root, :root[data-theme="light"], :root[data-theme="dark"] {
    --primary-blue: #22c55e;
    --secondary-blue: #a855f7;
    --gradient-primary: linear-gradient(135deg,#7c3aed 0%,#22c55e 55%,#4ade80 100%);
    --gradient-blue: linear-gradient(135deg,#a855f7 0%,#22c55e 100%);
    --glow-blue: 0 0 22px rgba(34,197,94,0.5);
    --glow-sm: 0 0 10px rgba(34,197,94,0.3);
  }
`;

export default function QueenTheme() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const now = Date.now();
    setOn(now >= QB_START && now < QB_END);
  }, []);
  if (!on) return null;
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

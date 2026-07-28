'use client';
import { useEffect, useState } from 'react';

// "Whole-site dedicated to her" — during the Birthday Bash window, recolor the site's accent
// from cyan to royal purple/gold so every CTA, link, and glow leans into her birthday. Injected
// client-side and self-removes after the window; touches only accent variables, not layout.
const QB_START = Date.parse('2026-07-29T23:00:00Z');
const QB_END   = Date.parse('2026-08-03T05:00:00Z');

const CSS = `
  :root, :root[data-theme="light"], :root[data-theme="dark"] {
    --primary-blue: #a855f7;
    --secondary-blue: #c084fc;
    --gradient-primary: linear-gradient(135deg,#a855f7 0%,#7c3aed 50%,#c026d3 100%);
    --gradient-blue: linear-gradient(135deg,#c084fc 0%,#a855f7 100%);
    --glow-blue: 0 0 20px rgba(168,85,247,0.45);
    --glow-sm: 0 0 10px rgba(168,85,247,0.28);
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

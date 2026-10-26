// src/lib/coaPage.js
//
// The page a scanned vial-label QR code lands on. Served as standalone HTML straight
// from a route handler (src/app/coas/[file]/route.js and src/app/C/[code]/route.js):
// no React, no site chrome, no pop-ups and no JavaScript, so it opens instantly in any
// phone camera's browser, including in-app ones that can't show a PDF. Every batch gets
// its own button, and multi-batch products also get the combined "all batches" PDF.
//
// Public on purpose (see /coas and /C in src/lib/gate.js): this is printed on product
// already in customers' hands and can never sit behind the age gate or account wall.

import { getCoaByFile, getBatches, getAllBatchesPdf } from '@/data/coas';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// batchDate is free text like "10/9/2026 · Lot IWR-1010-AOD" or just "8/2/2026".
function parseBatch(batchDate) {
  const [first, ...rest] = String(batchDate || '').split('·').map((s) => s.trim());
  const m = first.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const date = m ? `${MONTHS[+m[1] - 1]} ${+m[2]}, ${m[3]}` : first;
  const lot = rest.join(' · ').replace(/^Lot\s+/i, '');
  return { date, lot };
}

function shell(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | Iron Within Research</title>
<meta name="description" content="Certificates of analysis for Iron Within Research products.">
<link rel="icon" href="/icon.svg">
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0b0f17; color: #e6ebf2; font: 16px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  main { max-width: 520px; margin: 0 auto; padding: 24px 16px 40px; }
  .brand { display: flex; align-items: center; gap: 10px; color: #9aa6b8; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; text-decoration: none; }
  .brand img { width: 32px; height: 32px; }
  h1 { font-size: 28px; line-height: 1.15; margin: 22px 0 4px; }
  .sub { color: #9aa6b8; margin: 0 0 22px; }
  .card { background: #131a26; border: 1px solid #222c3d; border-radius: 14px; padding: 16px; margin-bottom: 12px; }
  .card.latest { border-color: #00a8d6; }
  .tag { display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #00a8d6; margin-bottom: 6px; }
  .row { display: flex; justify-content: space-between; gap: 12px; color: #9aa6b8; font-size: 14px; }
  .row b { color: #e6ebf2; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; word-break: break-all; text-align: right; }
  .btn { display: block; text-align: center; margin-top: 14px; padding: 14px; border-radius: 10px; font-weight: 700; text-decoration: none; background: #00a8d6; color: #04121a; }
  .btn.ghost { background: transparent; color: #e6ebf2; border: 1px solid #2c3850; }
  h2 { font-size: 15px; color: #9aa6b8; font-weight: 600; margin: 26px 0 10px; }
  .foot { margin-top: 30px; color: #6f7b8f; font-size: 12px; text-align: center; }
  .foot a { color: #9aa6b8; }
</style>
</head>
<body>
<main>
<a class="brand" href="https://www.ironwithin.io/"><img src="/logo-mark.png" alt="">Iron Within Research</a>
${body}
<p class="foot">Each certificate covers the batch tested. For laboratory research use only.<br>Questions? <a href="https://www.ironwithin.io/contact">Contact support</a></p>
</main>
</body>
</html>`;
}

function batchCard(b, i) {
  const { date, lot } = parseBatch(b.batchDate);
  return `<div class="card${i === 0 ? ' latest' : ''}">
  ${i === 0 ? '<span class="tag">Latest batch</span>' : ''}
  ${lot ? `<div class="row"><span>Lot</span><b>${esc(lot)}</b></div>` : ''}
  <div class="row"><span>Tested</span><b>${esc(date)}</b></div>
  <a class="btn${i === 0 ? '' : ' ghost'}" href="${esc(b.coaFile)}">View certificate (PDF)</a>
</div>`;
}

/** Response for a scanned label: the product's COA page, or a friendly not-found page. */
export function coaPageResponse(file) {
  const coa = getCoaByFile(file);
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400',
  };

  if (!coa) {
    const html = shell('Certificate not found', `<h1>We couldn't find that certificate</h1>
<p class="sub">This code doesn't match a report on file. Reply to your order email or contact support with the lot number printed on your vial and we'll send it to you.</p>
<a class="btn" href="https://www.ironwithin.io/contact">Contact support</a>`);
    return new Response(html, { status: 404, headers });
  }

  const batches = getBatches(coa.slug);
  const all = batches.length > 1 ? getAllBatchesPdf(coa.slug) : null;
  const html = shell(`${coa.productName} certificate of analysis`, `<h1>${esc(coa.productName)}</h1>
<p class="sub">Certificate of analysis${batches.length > 1 ? ` · ${batches.length} batches tested` : ''}</p>
${batchCard(batches[0], 0)}
${batches.length > 1 ? `<h2>Earlier batches</h2>\n${batches.slice(1).map((b, i) => batchCard(b, i + 1)).join('\n')}` : ''}
${all ? `<a class="btn ghost" href="${esc(all)}">Download every batch in one PDF</a>` : ''}`);
  return new Response(html, { status: 200, headers });
}

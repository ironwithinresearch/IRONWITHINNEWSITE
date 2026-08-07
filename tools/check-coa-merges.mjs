/* Build guard: a vial-label QR resolves to public/coa-pdf/<slug>-all-batches.pdf,
   which is generated from src/data/coas.js by tools/merge-coas.py. Adding a batch
   to coas.js without re-running the merge would leave every already-printed label
   pointing at an out-of-date report — silently. This fails `npm run build` instead.

   Fix: python3 tools/merge-coas.py  (then commit the PDFs + manifest) */

import { existsSync, readFileSync } from 'node:fs';
import { coaBySlug, getBatches } from '../src/data/coas.js';

const MANIFEST = 'public/coa-pdf/merged-manifest.json';

const expected = Object.fromEntries(
  Object.keys(coaBySlug)
    .map((slug) => [slug, getBatches(slug).map((b) => b.coaFile.split('/').pop())])
    .filter(([, files]) => files.length > 1),
);

const current = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const problems = [];

for (const slug of new Set([...Object.keys(expected), ...Object.keys(current)])) {
  const a = JSON.stringify(expected[slug] ?? null);
  const b = JSON.stringify(current[slug] ?? null);
  if (a !== b) problems.push(`  ${slug}: merged from ${b}, coas.js now lists ${a}`);
  else if (!existsSync(`public/coa-pdf/${slug}-all-batches.pdf`)) {
    problems.push(`  ${slug}: ${slug}-all-batches.pdf is missing`);
  }
}

if (problems.length) {
  console.error(
    `\nMerged COA PDFs are stale — vial-label QR codes would serve an out-of-date report.\n` +
      `Run: python3 tools/merge-coas.py\n\n${problems.join('\n')}\n`,
  );
  process.exit(1);
}

console.log(`COA merges OK (${Object.keys(expected).length} multi-batch products).`);

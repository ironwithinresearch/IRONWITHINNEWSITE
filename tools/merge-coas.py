#!/usr/bin/env python3
"""Merge every batch COA for a product into ONE PDF.

A vial label's QR code is printed once and can never be recalled, so it must
resolve to *all* of that product's testing, not the single batch that happened
to be current at print time. /coas/<file> redirects to the file this script
builds: public/coa-pdf/<slug>-all-batches.pdf — every batch, newest first,
with a bookmark per batch.

Products with a single batch are NOT merged (their one PDF already is the
complete record); the route sends those straight to it.

Run after adding a batch to src/data/coas.js:

    python3 tools/merge-coas.py          # rebuild, then commit the PDFs
    python3 tools/merge-coas.py --check  # exit 1 if anything is stale

`npm run build` runs the --check form (via tools/check-coa-merges.mjs) so a
new batch can never ship with a stale merged PDF.
"""

import json
import subprocess
import sys
from pathlib import Path

from pypdf import PdfWriter, PdfReader

ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = ROOT / "public" / "coa-pdf"
MANIFEST = PDF_DIR / "merged-manifest.json"

DUMP = """
import { coaBySlug, getBatches } from './src/data/coas.js';
const out = {};
for (const [slug, coa] of Object.entries(coaBySlug)) {
  out[slug] = { productName: coa.productName, batches: getBatches(slug) };
}
console.log(JSON.stringify(out));
"""


def load_coas():
    """Read the batch map straight out of src/data/coas.js — single source of truth."""
    res = subprocess.run(
        ["node", "--input-type=module", "-e", DUMP],
        cwd=ROOT, capture_output=True, text=True, check=True,
    )
    return json.loads(res.stdout.strip().splitlines()[-1])


def expected_manifest(coas):
    return {
        slug: [b["coaFile"].split("/")[-1] for b in v["batches"]]
        for slug, v in coas.items()
        if len(v["batches"]) > 1
    }


def merge(slug, product_name, batches):
    out_path = PDF_DIR / f"{slug}-all-batches.pdf"
    writer = PdfWriter()
    for b in batches:
        src = PDF_DIR / b["coaFile"].split("/")[-1]
        if not src.exists():
            raise SystemExit(f"missing source PDF for {slug}: {src}")
        start = len(writer.pages)
        writer.append(PdfReader(str(src)))
        writer.add_outline_item(b["batchDate"], start)
    # Batches from the same lab share fonts/logos/colour profiles — deduping the
    # identical objects and re-deflating the content streams is lossless and
    # cuts roughly a third off the merged file. Nothing is re-sampled.
    try:
        writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
    except TypeError:  # pypdf < 6
        writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    for page in writer.pages:
        try:
            page.compress_content_streams()
        except Exception:
            pass  # a page that won't re-deflate is left byte-for-byte as-is
    writer.add_metadata({
        "/Title": f"{product_name} — Certificates of Analysis ({len(batches)} batches)",
        "/Author": "Iron Within Research",
        "/Subject": "Independent third-party purity and endotoxin testing, newest batch first",
    })
    with open(out_path, "wb") as fh:
        writer.write(fh)
    return out_path


def main():
    check_only = "--check" in sys.argv
    coas = load_coas()
    expected = expected_manifest(coas)
    current = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}

    if check_only:
        problems = []
        if current != expected:
            for slug in sorted(set(expected) | set(current)):
                if expected.get(slug) != current.get(slug):
                    problems.append(f"  {slug}: manifest {current.get(slug)} != coas.js {expected.get(slug)}")
        for slug in expected:
            if not (PDF_DIR / f"{slug}-all-batches.pdf").exists():
                problems.append(f"  {slug}: {slug}-all-batches.pdf is missing")
        if problems:
            print("Merged COA PDFs are stale. Run: python3 tools/merge-coas.py\n" + "\n".join(problems))
            return 1
        print(f"Merged COA PDFs up to date ({len(expected)} multi-batch products).")
        return 0

    for slug, v in sorted(expected.items()):
        path = merge(slug, coas[slug]["productName"], coas[slug]["batches"])
        print(f"{slug:24} {len(v)} batches -> {path.name} ({path.stat().st_size / 1e6:.1f} MB)")

    # Sweep merged files for products that dropped back to a single batch.
    for stale in PDF_DIR.glob("*-all-batches.pdf"):
        if stale.name[: -len("-all-batches.pdf")] not in expected:
            stale.unlink()
            print(f"removed stale {stale.name}")

    MANIFEST.write_text(json.dumps(expected, indent=2, sort_keys=True) + "\n")
    print(f"\n{len(expected)} merged PDFs; manifest written to {MANIFEST.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

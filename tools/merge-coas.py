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

import io
import re

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


# Strengths a customer might be holding, e.g. "30mg". Deliberately narrow: 1-3 digits
# followed by mg/ml/mcg, so lot numbers and instrument readings are not mistaken for a
# vial size. Sorted numerically because "5mg" must not sort after "30mg".
STRENGTH_RE = re.compile(r"\b(\d{1,3})\s?(mg|ml|mcg)\b", re.I)
# A certificate is full of numbers followed by "mg" — assay results, recovery figures,
# instrument readings. Only a handful are vial sizes we actually sell, so match against
# the real ones rather than trying to blocklist the noise. RT-3's report alone yields
# 23mg, 31mg, 76mg, 93mg; printing those in the index would be its own kind of wrong.
VIAL_SIZES = {
    "1mg", "2mg", "3mg", "5mg", "6mg", "10mg", "15mg", "20mg", "25mg", "30mg",
    "40mg", "50mg", "60mg", "70mg", "80mg", "100mg", "120mg", "150mg", "200mg",
    "250mg", "500mg", "600mg", "1000mg", "1200mg", "1500mg",
    "1ml", "2ml", "5ml", "10ml", "30ml",
    "250mcg", "500mcg", "1000mcg",
}


def strengths_in(reader):
    """Which vial strengths a certificate appears to cover."""
    text = " ".join((page.extract_text() or "") for page in reader.pages)
    found = set()
    for num, unit in STRENGTH_RE.findall(text):
        v = f"{int(num)}{unit.lower()}"
        if v in VIAL_SIZES:
            found.add(v)
    return sorted(found, key=lambda x: int(re.match(r"\d+", x).group()))


def cover_page(product_name, rows):
    """
    A one-page index: which batch is on which page, and what strength it covers.

    This page exists because of a real customer complaint. The merged file is ordered
    newest batch first, so someone holding a 30mg vial scanned their QR, landed on a
    10mg certificate from a more recent batch, and reasonably concluded the label
    pointed at the wrong product. The certificates for their vial were on page 14. The
    QR could not be changed — labels are already on vials in customers' hands — so the
    document has to answer "which page is mine" the moment it opens.
    """
    from reportlab.lib.pagesizes import LETTER
    from reportlab.lib.units import inch
    from reportlab.pdfgen import canvas

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)
    w, h = LETTER
    y = h - 0.9 * inch

    c.setFillColorRGB(0, 0.66, 0.84)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(0.9 * inch, y, "IRON WITHIN RESEARCH")
    y -= 26
    c.setFillColorRGB(0.07, 0.1, 0.11)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(0.9 * inch, y, f"{product_name} — Certificates of Analysis")
    y -= 20
    c.setFont("Helvetica", 10.5)
    c.setFillColorRGB(0.35, 0.42, 0.45)
    c.drawString(0.9 * inch, y, "Every batch we have tested for this product, newest first.")
    y -= 16
    c.drawString(0.9 * inch, y, "Match the strength on your vial to the rows below and turn to that page.")
    y -= 26

    c.setStrokeColorRGB(0.8, 0.85, 0.87)
    c.line(0.9 * inch, y, w - 0.9 * inch, y)
    y -= 16
    c.setFont("Helvetica-Bold", 9)
    c.setFillColorRGB(0.2, 0.25, 0.27)
    c.drawString(0.9 * inch, y, "PAGE")
    c.drawString(1.75 * inch, y, "STRENGTH")
    c.drawString(3.35 * inch, y, "BATCH / LOT")
    y -= 6
    c.line(0.9 * inch, y, w - 0.9 * inch, y)
    y -= 18

    c.setFont("Helvetica", 11)
    c.setFillColorRGB(0.07, 0.1, 0.11)
    for first, last, label, strs in rows:
        page_txt = str(first) if first == last else f"{first}\u2013{last}"
        c.setFont("Helvetica-Bold", 11)
        c.drawString(0.9 * inch, y, page_txt)
        c.setFont("Helvetica", 11)
        c.drawString(1.75 * inch, y, ", ".join(strs) if strs else "see certificate")
        c.drawString(3.35 * inch, y, label[:52])
        y -= 19
        if y < 1.2 * inch:
            break

    c.setFont("Helvetica", 8.5)
    c.setFillColorRGB(0.45, 0.5, 0.53)
    c.drawString(0.9 * inch, 0.85 * inch,
                 "Page numbers include this index page. Testing is per production batch; "
                 "one batch can cover several vial sizes.")
    c.showPage()
    c.save()
    buf.seek(0)
    return PdfReader(buf)


def merge(slug, product_name, batches):
    out_path = PDF_DIR / f"{slug}-all-batches.pdf"

    # Read every batch first so the index can be built before anything is written.
    parts = []
    for b in batches:
        src = PDF_DIR / b["coaFile"].split("/")[-1]
        if not src.exists():
            raise SystemExit(f"missing source PDF for {slug}: {src}")
        reader = PdfReader(str(src))
        parts.append((b, reader, strengths_in(reader)))

    rows, page = [], 2  # page 1 is the index
    for b, reader, strs in parts:
        n = len(reader.pages)
        rows.append((page, page + n - 1, b["batchDate"], strs))
        page += n

    writer = PdfWriter()
    writer.append(cover_page(product_name, rows))
    writer.add_outline_item("Index — which page is my batch?", 0)

    for (b, reader, strs), (first, last, _label, _s) in zip(parts, rows):
        start = len(writer.pages)
        writer.append(reader)
        # Strength goes in the bookmark, not just the date. A date alone cannot tell a
        # customer whether the batch in front of them is the one in their hand.
        title = b["batchDate"]
        if strs:
            title = f"{', '.join(strs)} — {title}"
        writer.add_outline_item(title, start)
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

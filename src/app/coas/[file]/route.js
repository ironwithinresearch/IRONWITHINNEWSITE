import { coaPageResponse } from '@/lib/coaPage';

/* ── Vial-label QR destination ───────────────────────────────
   Every printed vial label carries a QR to this route. Two forms exist in the
   field and both must keep working forever, because printed labels can never
   be recalled:

     /coas/rt-3-5859103.pdf   older labels — whichever single batch PDF was
                              current at print time
     /coas/rt-3               bare product slug

   Labels printed from 26 Oct 2026 use the shorter /C/<SLUG> form instead
   (src/app/C/[code]/route.js); all three land on the same page.

   Either way the scan answers with a light, phone-friendly page listing EVERY
   batch for that product, newest first, each with its own PDF button (plus the
   merged all-batches PDF). A label can therefore never go stale: add the batch
   to src/data/coas.js, re-run tools/merge-coas.py, and the same old QR now
   shows the new report too. See src/lib/coaPage.js. */

export function GET(request, { params }) {
  return coaPageResponse(decodeURIComponent(params.file));
}

import { getCoaByFile, getAllBatchesPdf } from '@/data/coas';

/* ── Vial-label QR destination ───────────────────────────────
   Every printed vial label carries a QR to this route. Two forms exist in the
   field and both must keep working forever, because printed labels can never
   be recalled:

     /coas/rt-3-5859103.pdf   older labels — whichever single batch PDF was
                              current at print time
     /coas/rt-3               what the generator prints now (bare product slug)

   Either way the scan answers with ONE PDF holding EVERY batch COA for that
   product, newest first, bookmarked per batch. A label can therefore never go
   stale: add the batch to src/data/coas.js, re-run tools/merge-coas.py, and
   the same old QR now returns the new report too.

   Unknown filename (retired PDF, typo) → the full lab-report index rather than
   a dead end. */

export function GET(request, { params }) {
  const coa = getCoaByFile(decodeURIComponent(params.file));
  const target = (coa && getAllBatchesPdf(coa.slug)) || '/lab-reports';

  // 302, not 308: the destination filename is ours to change (a re-merge, a
  // renamed slug) and a permanently-cached redirect in a customer's browser
  // would outlive it. A relative Location keeps the redirect host-agnostic.
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400',
    },
  });
}

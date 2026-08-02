/* Certificate of Analysis (COA) data - one entry per product, keyed by Woo slug.
   PDFs live in /public/coa-pdf/<slug>.pdf (self-hosted on this site so they
   survive the old ironwithinlabs.com store being retired). */

export const coaBySlug = {
  'tb-500': { coaFile: '/coa-pdf/tb-500-5928420.pdf', batchDate: '5/15/2026', productName: 'TB-500' },
  'dsip-10mg': { coaFile: '/coa-pdf/dsip-10mg-4349569.pdf', batchDate: '6/24/2026', productName: 'DSIP' },
  'mt-2': { coaFile: '/coa-pdf/mt-2-3295184.pdf', batchDate: '6/24/2026', productName: 'MT-2' },
  'l-glutathione': { coaFile: '/coa-pdf/l-glutathione-2768697.pdf', batchDate: '6/24/2026', productName: 'L-Glutathione' },
  // `batches` (newest first) shows continued batch-over-batch testing. The top-level
  // coaFile/batchDate mirror the latest batch (kept for back-compat with single-COA UI).
  'ss-31': {
    coaFile: '/coa-pdf/ss-31.pdf', batchDate: '6/29/2026', productName: 'SS-31',
    batches: [
      { coaFile: '/coa-pdf/ss-31.pdf', batchDate: '6/29/2026' },
      { coaFile: '/coa-pdf/ss-31-2026-06-08.pdf', batchDate: '6/8/2026' },
    ],
  },
  'igf-1-lr3': { coaFile: '/coa-pdf/igf-1-lr3.pdf', batchDate: '6/29/2026', productName: 'IGF-1 LR3' },
  'thymosin-alpha-1': {
    coaFile: '/coa-pdf/thymosin-alpha-1-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063', productName: 'Thymosin Alpha 1',
    batches: [
      { coaFile: '/coa-pdf/thymosin-alpha-1-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063' },
      { coaFile: '/coa-pdf/thymosin-alpha-1.pdf', batchDate: '5/6/2026' },
    ],
  },
  'bpc-157': {
    coaFile: '/coa-pdf/bpc-157-7317226.pdf', batchDate: '6/24/2026', productName: 'BPC-157',
    batches: [
      { coaFile: '/coa-pdf/bpc-157-7317226.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coa-pdf/bpc-157.pdf', batchDate: '4/16/2026' },
    ],
  },
  'iwr-h2o': { coaFile: '/coa-pdf/iwr-h2o.pdf', batchDate: '1/09/2026', productName: 'IWR H2O' },
  'semax': { coaFile: '/coa-pdf/semax.pdf', batchDate: '2/16/2026', productName: 'Semax' },
  'selank': { coaFile: '/coa-pdf/selank.pdf', batchDate: '4/16/26', productName: 'Selank' },
  'pt-141': { coaFile: '/coa-pdf/pt-141.pdf', batchDate: '4/16/2026', productName: 'PT-141' },
  'kisspeptin': {
    coaFile: '/coa-pdf/kisspeptin-6437017.pdf', batchDate: '6/24/2026', productName: 'Kisspeptin',
    batches: [
      { coaFile: '/coa-pdf/kisspeptin-6437017.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coa-pdf/kisspeptin.pdf', batchDate: '5/6/2026' },
    ],
  },
  'trz-2': {
    coaFile: '/coa-pdf/trz-2-9109868.pdf', batchDate: '6/24/2026', productName: 'TRZ-2',
    batches: [
      { coaFile: '/coa-pdf/trz-2-9109868.pdf', batchDate: '6/24/2026 · Lot IWR-9109868' },
      { coaFile: '/coa-pdf/trz-2-6878731.pdf', batchDate: '6/24/2026 · Lot IWR-6878731' },
      { coaFile: '/coa-pdf/trz-2.pdf', batchDate: '04/16/2026' },
    ],
  },
  'thymalin': { coaFile: '/coa-pdf/thymalin.pdf', batchDate: '5/6/2026', productName: 'Thymalin' },
  'tesamorelin': { coaFile: '/coa-pdf/tesamorelin.pdf', batchDate: '4/16/2026', productName: 'Tesamorelin' },
  'slu-pp-332': { coaFile: '/coa-pdf/slu-pp-332.pdf', batchDate: '2/22/2026', productName: 'SLU-PP-332' },
  'sermorelin': { coaFile: '/coa-pdf/sermorelin.pdf', batchDate: '2/22/2026', productName: 'Sermorelin' },
  'rt-3': {
    coaFile: '/coa-pdf/rt-3-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063', productName: 'RT-3',
    batches: [
      { coaFile: '/coa-pdf/rt-3-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063' },
      { coaFile: '/coa-pdf/rt-3-5859103.pdf', batchDate: '6/24/2026 · Lot IWR-5859103' },
      { coaFile: '/coa-pdf/rt-3-4862753.pdf', batchDate: '6/24/2026 · Lot IWR-4862753' },
      { coaFile: '/coa-pdf/rt-3-1764133.pdf', batchDate: '6/24/2026 · Lot IWR-1764133' },
      { coaFile: '/coa-pdf/rt-3.pdf', batchDate: '4/16/2026' },
    ],
  },
  'mots-c': { coaFile: '/coa-pdf/mots-c.pdf', batchDate: '5/6/2026', productName: 'MOTS-C' },
  'lipo-c': { coaFile: '/coa-pdf/lipo-c.pdf', batchDate: '5/6/2026', productName: 'Lipo-C' },
  'klow': {
    coaFile: '/coa-pdf/klow-7626298.pdf', batchDate: '6/24/2026', productName: 'KLOW',
    batches: [
      { coaFile: '/coa-pdf/klow-7626298.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coa-pdf/klow.pdf', batchDate: '4/16/2026' },
    ],
  },
  'ipa': {
    coaFile: '/coa-pdf/ipa-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063', productName: 'Ipa',
    batches: [
      { coaFile: '/coa-pdf/ipa-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063' },
      { coaFile: '/coa-pdf/ipa-2026-04-16.pdf', batchDate: '4/16/2026 · Lot IWR-6499787' },
      { coaFile: '/coa-pdf/ipa.pdf', batchDate: '2/22/2026' },
    ],
  },
  'cjc-w-o-dac': { coaFile: '/coa-pdf/cjc-w-o-dac.pdf', batchDate: '2/22/2026', productName: 'CJC w/o DAC' },
  'cjc-ipa': { coaFile: '/coa-pdf/cjc-ipa.pdf', batchDate: '2/22/2026', productName: 'CJC / IPA' },
  'cagrillintide': { coaFile: '/coa-pdf/cagrillintide.pdf', batchDate: '4/16/2026', productName: 'Cagrillintide' },
  'aod-9604-10mg': { coaFile: '/coa-pdf/aod-9604-10mg.pdf', batchDate: '2/22/2026', productName: 'AOD 9604' },
  '5-amino-1mq-50mg': { coaFile: '/coa-pdf/5-amino-1mq-50mg.pdf', batchDate: '2/22/2026', productName: '5-Amino-1MQ' },
  'nad': {
    coaFile: '/coa-pdf/nad-6384965.pdf', batchDate: '6/24/2026', productName: 'NAD+',
    batches: [
      { coaFile: '/coa-pdf/nad-6384965.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coa-pdf/nad.pdf', batchDate: '2/22/2026' },
    ],
  },
  'kpv': {
    coaFile: '/coa-pdf/kpv-4451178.pdf', batchDate: '6/24/2026', productName: 'KPV',
    batches: [
      { coaFile: '/coa-pdf/kpv-4451178.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coa-pdf/kpv.pdf', batchDate: '5/6/2026' },
    ],
  },
  'epitalon-10mg': { coaFile: '/coa-pdf/epitalon-10mg.pdf', batchDate: '5/6/2026', productName: 'Epitalon' },
  'glow-bundle': {
    coaFile: '/coa-pdf/glow-bundle-6055127.pdf', batchDate: '6/24/2026', productName: 'GLOW',
    batches: [
      { coaFile: '/coa-pdf/glow-bundle-6055127.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coa-pdf/glow-bundle.pdf', batchDate: '4/16/2026' },
    ],
  },
  'ghk-cu': { coaFile: '/coa-pdf/ghk-cu.pdf', batchDate: '4/16/2026', productName: 'GHK-Cu' },
  'vip': { coaFile: '/coa-pdf/vip-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063', productName: 'VIP' },
  // 10mg Thymosin Alpha-1 (product 2084) — same BATCH-0063 peptide as the 3mg SKU.
  'thymosin-alpha-1-10mg': { coaFile: '/coa-pdf/thymosin-alpha-1-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063', productName: 'Thymosin Alpha-1 10mg' },
  'bpc-157-tb500-10mg': {
    coaFile: '/coa-pdf/bpc-157-tb500-10mg-8833606.pdf', batchDate: '6/24/2026', productName: 'BPC-157 / TB500',
    batches: [
      { coaFile: '/coa-pdf/bpc-157-tb500-10mg-8833606.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coa-pdf/bpc-157-tb500-10mg.pdf', batchDate: '02/22/2026' },
    ],
  },
};

export function getCoa(slug) {
  if (!slug) return null;
  return coaBySlug[slug] || null;
}

export const coaList = Object.entries(coaBySlug).map(([slug, v]) => ({ slug, ...v }));

/* Every batch for a product, newest first. Products without a `batches`
   array have exactly one batch (the top-level coaFile). */
export function getBatches(slug) {
  const coa = coaBySlug[slug];
  if (!coa) return [];
  if (coa.batches?.length) return coa.batches;
  return [{ coaFile: coa.coaFile, batchDate: coa.batchDate }];
}

/* Vial-label QR codes are printed with the URL of whichever single batch PDF
   was current at print time (https://ironwithin.io/coas/<file>.pdf). Labels
   already in the field can never be reprinted, so /coas/<file> is served by
   src/app/coas/[file] — a page listing EVERY batch for that product. This map
   resolves any batch filename (current or historical) back to its product. */
export const coaSlugByFile = (() => {
  const map = {};
  for (const [slug, coa] of Object.entries(coaBySlug)) {
    for (const b of getBatches(slug)) {
      const file = b.coaFile.split('/').pop();
      if (file && !map[file]) map[file] = slug;
    }
    const top = coa.coaFile?.split('/').pop();
    if (top && !map[top]) map[top] = slug;
  }
  return map;
})();

export function getCoaByFile(file) {
  if (!file) return null;
  const bare = file.replace(/\.pdf$/i, '');
  // Accept a bare product slug too (/coas/rt-3) — that's the stable form new
  // vial labels should be printed with, since it never goes stale.
  const slug = coaBySlug[bare] ? bare : (coaSlugByFile[file] || coaSlugByFile[bare + '.pdf']);
  return slug ? { slug, ...coaBySlug[slug] } : null;
}

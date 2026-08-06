/* Certificate of Analysis (COA) data - one entry per product, keyed by Woo slug.
   PDFs live in /public/coa-pdf/<slug>.pdf (self-hosted on this site so they
   survive the old ironwithinlabs.com store being retired).

   `batches` (newest first) shows continued batch-over-batch testing. The top-level
   coaFile/batchDate mirror the latest batch (kept for back-compat with single-COA UI).
   Never repoint a label at /coa-pdf/... directly - the QR must resolve to /coas/<slug>,
   which renders every batch. */

export const coaBySlug = {
  '5-amino-1mq-50mg': {
    coaFile: '/coa-pdf/5-amino-1mq-50mg.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-5AMINO50',
    productName: '5-Amino-1MQ',
  },
  'adamax-10mg': {
    coaFile: '/coa-pdf/adamax-10mg.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-ADA10L',
    productName: 'Adamax',
  },
  'ahk-cu-100mg': {
    coaFile: '/coa-pdf/ahk-cu-100mg.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-AHKL',
    productName: 'AHK-Cu',
  },
  'aod-9604-10mg': {
    coaFile: '/coa-pdf/aod-9604-10mg.pdf',
    batchDate: '8/2/2026',
    productName: 'AOD 9604',
  },
  'ara-290': {
    coaFile: '/coa-pdf/ara-290.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-ARA290L',
    productName: 'ARA-290',
  },
  'bpc-157': {
    coaFile: '/coa-pdf/bpc-157-7317226.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-BPC10L',
    productName: 'BPC-157',
    batches: [
      { coaFile: '/coa-pdf/bpc-157-7317226.pdf', batchDate: '8/2/2026 · Lot IWR-2607-BPC10L' },
      { coaFile: '/coa-pdf/bpc-157.pdf', batchDate: '4/16/2026' },
    ],
  },
  'bpc-157-tb500-10mg': {
    coaFile: '/coa-pdf/bpc-157-tb500-10mg-8833606.pdf',
    batchDate: '8/2/2026',
    productName: 'BPC-157 / TB500',
    batches: [
      { coaFile: '/coa-pdf/bpc-157-tb500-10mg-8833606.pdf', batchDate: '8/2/2026' },
      { coaFile: '/coa-pdf/bpc-157-tb500-10mg.pdf', batchDate: '02/22/2026' },
    ],
  },
  'cagrillintide': {
    coaFile: '/coa-pdf/cagrillintide.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-CAGL',
    productName: 'Cagrillintide',
  },
  'cerebrolysin': {
    coaFile: '/coa-pdf/cerebrolysin.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-CER60L',
    productName: 'Cerebrolysin',
  },
  'cjc-ipa': {
    coaFile: '/coa-pdf/cjc-ipa.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-IPACJC10',
    productName: 'CJC / IPA',
  },
  'cjc-w-o-dac': {
    coaFile: '/coa-pdf/cjc-w-o-dac.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-CJCWO10',
    productName: 'CJC w/o DAC',
  },
  'dsip-10mg': {
    coaFile: '/coa-pdf/dsip-10mg-4349569.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-DSIP10L',
    productName: 'DSIP',
  },
  'epitalon-10mg': {
    coaFile: '/coa-pdf/epitalon-10mg.pdf',
    batchDate: '8/2/2026',
    productName: 'Epitalon',
  },
  'foxo4': {
    coaFile: '/coa-pdf/foxo4.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-FOX0410L',
    productName: 'FoxO4',
  },
  'ghk-cu': {
    coaFile: '/coa-pdf/ghk-cu.pdf',
    batchDate: '8/2/2026',
    productName: 'GHK-Cu',
  },
  'glow-bundle': {
    coaFile: '/coa-pdf/glow-bundle-6055127.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-GLOWL',
    productName: 'GLOW',
    batches: [
      { coaFile: '/coa-pdf/glow-bundle-6055127.pdf', batchDate: '8/2/2026 · Lot IWR-2607-GLOWL' },
      { coaFile: '/coa-pdf/glow-bundle.pdf', batchDate: '4/16/2026' },
    ],
  },
  'igf-1-lr3': {
    coaFile: '/coa-pdf/igf-1-lr3.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-IGFL',
    productName: 'IGF-1 LR3',
  },
  'ipa': {
    coaFile: '/coa-pdf/ipa-batch0063.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-IPA10L',
    productName: 'Ipa',
    batches: [
      { coaFile: '/coa-pdf/ipa-batch0063.pdf', batchDate: '8/2/2026 · Lot IWR-2607-IPA10L' },
      { coaFile: '/coa-pdf/ipa-2026-04-16.pdf', batchDate: '4/16/2026 · Lot IWR-6499787' },
      { coaFile: '/coa-pdf/ipa.pdf', batchDate: '2/22/2026' },
    ],
  },
  'iwr-h2o': {
    coaFile: '/coa-pdf/iwr-h2o.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-H2OL',
    productName: 'IWR H2O',
  },
  'kisspeptin': {
    coaFile: '/coa-pdf/kisspeptin-6437017.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-KS10L',
    productName: 'Kisspeptin',
    batches: [
      { coaFile: '/coa-pdf/kisspeptin-6437017.pdf', batchDate: '8/2/2026 · Lot IWR-2607-KS10L' },
      { coaFile: '/coa-pdf/kisspeptin.pdf', batchDate: '5/6/2026' },
    ],
  },
  'klow': {
    coaFile: '/coa-pdf/klow-7626298.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-KLOWL',
    productName: 'KLOW',
    batches: [
      { coaFile: '/coa-pdf/klow-7626298.pdf', batchDate: '8/2/2026 · Lot IWR-2607-KLOWL' },
      { coaFile: '/coa-pdf/klow.pdf', batchDate: '4/16/2026' },
    ],
  },
  'kpv': {
    coaFile: '/coa-pdf/kpv-4451178.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-KPV10L',
    productName: 'KPV',
    batches: [
      { coaFile: '/coa-pdf/kpv-4451178.pdf', batchDate: '8/2/2026 · Lot IWR-2607-KPV10L' },
      { coaFile: '/coa-pdf/kpv.pdf', batchDate: '5/6/2026' },
    ],
  },
  'l-glutathione': {
    coaFile: '/coa-pdf/l-glutathione-2768697.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-L',
    productName: 'L-Glutathione',
  },
  'lemon-bottle': {
    coaFile: '/coa-pdf/lemon-bottle.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-L',
    productName: 'Lemon Bottle',
  },
  'lipo-c': {
    coaFile: '/coa-pdf/lipo-c.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-LIPOCL',
    productName: 'Lipo-C',
  },
  'll-37': {
    coaFile: '/coa-pdf/ll-37.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-LL5L',
    productName: 'LL-37',
  },
  'mots-c': {
    coaFile: '/coa-pdf/mots-c.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-MOTSC40L',
    productName: 'MOTS-C',
  },
  'mt-2': {
    coaFile: '/coa-pdf/mt-2-3295184.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-MT2L',
    productName: 'MT-2',
  },
  'nad': {
    coaFile: '/coa-pdf/nad-6384965.pdf',
    batchDate: '8/2/2026',
    productName: 'NAD+',
    batches: [
      { coaFile: '/coa-pdf/nad-6384965.pdf', batchDate: '8/2/2026' },
      { coaFile: '/coa-pdf/nad.pdf', batchDate: '2/22/2026' },
    ],
  },
  'oxytocin': {
    coaFile: '/coa-pdf/oxytocin.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-O',
    productName: 'Oxytocin',
  },
  'pe-22-28': {
    coaFile: '/coa-pdf/pe-22-28.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-PE5L',
    productName: 'PE-22-28',
  },
  'pinealon': {
    coaFile: '/coa-pdf/pinealon.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-PIN10L',
    productName: 'Pinealon',
  },
  'pt-141': {
    coaFile: '/coa-pdf/pt-141.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-PT14110L',
    productName: 'PT-141',
  },
  'rt-3': {
    coaFile: '/coa-pdf/rt-3-batch0063.pdf',
    batchDate: '8/2/2026',
    productName: 'RT-3',
    batches: [
      { coaFile: '/coa-pdf/rt-3-batch0063.pdf', batchDate: '8/2/2026' },
      { coaFile: '/coa-pdf/rt-3-5859103.pdf', batchDate: '6/24/2026 · Lot IWR-5859103' },
      { coaFile: '/coa-pdf/rt-3-4862753.pdf', batchDate: '6/24/2026 · Lot IWR-4862753' },
      { coaFile: '/coa-pdf/rt-3-1764133.pdf', batchDate: '6/24/2026 · Lot IWR-1764133' },
      { coaFile: '/coa-pdf/rt-3.pdf', batchDate: '4/16/2026' },
    ],
  },
  'selank': {
    coaFile: '/coa-pdf/selank.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-S',
    productName: 'Selank',
  },
  'semax': {
    coaFile: '/coa-pdf/semax.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-S',
    productName: 'Semax',
  },
  'sermorelin': {
    coaFile: '/coa-pdf/sermorelin.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-S55L',
    productName: 'Sermorelin',
  },
  'slu-pp-332': {
    coaFile: '/coa-pdf/slu-pp-332.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-SLU5L',
    productName: 'SLU-PP-332',
  },
  'ss-31': {
    coaFile: '/coa-pdf/ss-31.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-SS50L',
    productName: 'SS-31',
    batches: [
      { coaFile: '/coa-pdf/ss-31.pdf', batchDate: '8/2/2026 · Lot IWR-2607-SS50L' },
      { coaFile: '/coa-pdf/ss-31-2026-06-08.pdf', batchDate: '6/8/2026' },
    ],
  },
  'tb-500': {
    coaFile: '/coa-pdf/tb-500-5928420.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-TB50010L',
    productName: 'TB-500',
  },
  'tesamorelin': {
    coaFile: '/coa-pdf/tesamorelin.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-TSM10L',
    productName: 'Tesamorelin',
  },
  'tesamorelin-ipamorelin-5-5': {
    coaFile: '/coa-pdf/tesamorelin-ipamorelin-5-5.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-TSMIPA10',
    productName: 'Tesamorelin / Ipamorelin',
  },
  'thrive': {
    coaFile: '/coa-pdf/thrive.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-THRIVEL',
    productName: 'Thrive',
  },
  'thymalin': {
    coaFile: '/coa-pdf/thymalin.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-THY10L',
    productName: 'Thymalin',
  },
  'thymosin-alpha-1': {
    coaFile: '/coa-pdf/thymosin-alpha-1-batch0063.pdf',
    batchDate: '7/24/2026 · BATCH-0063',
    productName: 'Thymosin Alpha 1',
    batches: [
      { coaFile: '/coa-pdf/thymosin-alpha-1-batch0063.pdf', batchDate: '7/24/2026 · BATCH-0063' },
      { coaFile: '/coa-pdf/thymosin-alpha-1.pdf', batchDate: '5/6/2026' },
    ],
  },
  'thymosin-alpha-1-10mg': {
    coaFile: '/coa-pdf/thymosin-alpha-1-batch0063.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-TA110L',
    productName: 'Thymosin Alpha-1 10mg',
  },
  'trz-2': {
    coaFile: '/coa-pdf/trz-2-9109868.pdf',
    batchDate: '8/2/2026',
    productName: 'TRZ-2',
    batches: [
      { coaFile: '/coa-pdf/trz-2-9109868.pdf', batchDate: '8/2/2026' },
      { coaFile: '/coa-pdf/trz-2-6878731.pdf', batchDate: '6/24/2026 · Lot IWR-6878731' },
      { coaFile: '/coa-pdf/trz-2.pdf', batchDate: '04/16/2026' },
    ],
  },
  'vip': {
    coaFile: '/coa-pdf/vip-batch0063.pdf',
    batchDate: '8/2/2026 · Lot IWR-2607-VIP10L',
    productName: 'VIP',
  },
}

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

/* Certificate of Analysis (COA) data - one entry per product, keyed by Woo slug.
   PDFs live in /public/coas/<slug>.pdf (self-hosted on this site so they
   survive the old ironwithinlabs.com store being retired). */

export const coaBySlug = {
  'tb-500': { coaFile: '/coas/tb-500-5928420.pdf', batchDate: '5/15/2026', productName: 'TB-500' },
  'dsip-10mg': { coaFile: '/coas/dsip-10mg-4349569.pdf', batchDate: '6/24/2026', productName: 'DSIP' },
  'mt-2': { coaFile: '/coas/mt-2-3295184.pdf', batchDate: '6/24/2026', productName: 'MT-2' },
  'l-glutathione': { coaFile: '/coas/l-glutathione-2768697.pdf', batchDate: '6/24/2026', productName: 'L-Glutathione' },
  // `batches` (newest first) shows continued batch-over-batch testing. The top-level
  // coaFile/batchDate mirror the latest batch (kept for back-compat with single-COA UI).
  'ss-31': {
    coaFile: '/coas/ss-31.pdf', batchDate: '6/29/2026', productName: 'SS-31',
    batches: [
      { coaFile: '/coas/ss-31.pdf', batchDate: '6/29/2026' },
      { coaFile: '/coas/ss-31-2026-06-08.pdf', batchDate: '6/8/2026' },
    ],
  },
  'igf-1-lr3': { coaFile: '/coas/igf-1-lr3.pdf', batchDate: '6/29/2026', productName: 'IGF-1 LR3' },
  'thymosin-alpha-1': { coaFile: '/coas/thymosin-alpha-1.pdf', batchDate: '5/6/2026', productName: 'Thymosin Alpha 1' },
  'bpc-157': {
    coaFile: '/coas/bpc-157-7317226.pdf', batchDate: '6/24/2026', productName: 'BPC-157',
    batches: [
      { coaFile: '/coas/bpc-157-7317226.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coas/bpc-157.pdf', batchDate: '4/16/2026' },
    ],
  },
  'iwr-h2o': { coaFile: '/coas/iwr-h2o.pdf', batchDate: '1/09/2026', productName: 'IWR H2O' },
  'semax': { coaFile: '/coas/semax.pdf', batchDate: '2/16/2026', productName: 'Semax' },
  'selank': { coaFile: '/coas/selank.pdf', batchDate: '4/16/26', productName: 'Selank' },
  'pt-141': { coaFile: '/coas/pt-141.pdf', batchDate: '4/16/2026', productName: 'PT-141' },
  'kisspeptin': {
    coaFile: '/coas/kisspeptin-6437017.pdf', batchDate: '6/24/2026', productName: 'Kisspeptin',
    batches: [
      { coaFile: '/coas/kisspeptin-6437017.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coas/kisspeptin.pdf', batchDate: '5/6/2026' },
    ],
  },
  'trz-2': {
    coaFile: '/coas/trz-2-9109868.pdf', batchDate: '6/24/2026', productName: 'TRZ-2',
    batches: [
      { coaFile: '/coas/trz-2-9109868.pdf', batchDate: '6/24/2026 · Lot IWR-9109868' },
      { coaFile: '/coas/trz-2-6878731.pdf', batchDate: '6/24/2026 · Lot IWR-6878731' },
      { coaFile: '/coas/trz-2.pdf', batchDate: '04/16/2026' },
    ],
  },
  'thymalin': { coaFile: '/coas/thymalin.pdf', batchDate: '5/6/2026', productName: 'Thymalin' },
  'tesamorelin': { coaFile: '/coas/tesamorelin.pdf', batchDate: '4/16/2026', productName: 'Tesamorelin' },
  'slu-pp-332': { coaFile: '/coas/slu-pp-332.pdf', batchDate: '2/22/2026', productName: 'SLU-PP-332' },
  'sermorelin': { coaFile: '/coas/sermorelin.pdf', batchDate: '2/22/2026', productName: 'Sermorelin' },
  'rt-3': {
    coaFile: '/coas/rt-3-5859103.pdf', batchDate: '6/24/2026', productName: 'RT-3',
    batches: [
      { coaFile: '/coas/rt-3-5859103.pdf', batchDate: '6/24/2026 · Lot IWR-5859103' },
      { coaFile: '/coas/rt-3-4862753.pdf', batchDate: '6/24/2026 · Lot IWR-4862753' },
      { coaFile: '/coas/rt-3-1764133.pdf', batchDate: '6/24/2026 · Lot IWR-1764133' },
      { coaFile: '/coas/rt-3.pdf', batchDate: '4/16/2026' },
    ],
  },
  'mots-c': { coaFile: '/coas/mots-c.pdf', batchDate: '5/6/2026', productName: 'MOTS-C' },
  'lipo-c': { coaFile: '/coas/lipo-c.pdf', batchDate: '5/6/2026', productName: 'Lipo-C' },
  'klow': {
    coaFile: '/coas/klow-7626298.pdf', batchDate: '6/24/2026', productName: 'KLOW',
    batches: [
      { coaFile: '/coas/klow-7626298.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coas/klow.pdf', batchDate: '4/16/2026' },
    ],
  },
  'ipa': {
    coaFile: '/coas/ipa-2026-04-16.pdf', batchDate: '4/16/2026', productName: 'Ipa',
    batches: [
      { coaFile: '/coas/ipa-2026-04-16.pdf', batchDate: '4/16/2026 · Lot IWR-6499787' },
      { coaFile: '/coas/ipa.pdf', batchDate: '2/22/2026' },
    ],
  },
  'cjc-w-o-dac': { coaFile: '/coas/cjc-w-o-dac.pdf', batchDate: '2/22/2026', productName: 'CJC w/o DAC' },
  'cjc-ipa': { coaFile: '/coas/cjc-ipa.pdf', batchDate: '2/22/2026', productName: 'CJC / IPA' },
  'cagrillintide': { coaFile: '/coas/cagrillintide.pdf', batchDate: '4/16/2026', productName: 'Cagrillintide' },
  'aod-9604-10mg': { coaFile: '/coas/aod-9604-10mg.pdf', batchDate: '2/22/2026', productName: 'AOD 9604' },
  '5-amino-1mq-50mg': { coaFile: '/coas/5-amino-1mq-50mg.pdf', batchDate: '2/22/2026', productName: '5-Amino-1MQ' },
  'nad': {
    coaFile: '/coas/nad-6384965.pdf', batchDate: '6/24/2026', productName: 'NAD+',
    batches: [
      { coaFile: '/coas/nad-6384965.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coas/nad.pdf', batchDate: '2/22/2026' },
    ],
  },
  'kpv': {
    coaFile: '/coas/kpv-4451178.pdf', batchDate: '6/24/2026', productName: 'KPV',
    batches: [
      { coaFile: '/coas/kpv-4451178.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coas/kpv.pdf', batchDate: '5/6/2026' },
    ],
  },
  'epitalon-10mg': { coaFile: '/coas/epitalon-10mg.pdf', batchDate: '5/6/2026', productName: 'Epitalon' },
  'glow-bundle': {
    coaFile: '/coas/glow-bundle-6055127.pdf', batchDate: '6/24/2026', productName: 'GLOW',
    batches: [
      { coaFile: '/coas/glow-bundle-6055127.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coas/glow-bundle.pdf', batchDate: '4/16/2026' },
    ],
  },
  'ghk-cu': { coaFile: '/coas/ghk-cu.pdf', batchDate: '4/16/2026', productName: 'GHK-Cu' },
  'bpc-157-tb500-10mg': {
    coaFile: '/coas/bpc-157-tb500-10mg-8833606.pdf', batchDate: '6/24/2026', productName: 'BPC-157 / TB500',
    batches: [
      { coaFile: '/coas/bpc-157-tb500-10mg-8833606.pdf', batchDate: '6/24/2026' },
      { coaFile: '/coas/bpc-157-tb500-10mg.pdf', batchDate: '02/22/2026' },
    ],
  },
};

export function getCoa(slug) {
  if (!slug) return null;
  return coaBySlug[slug] || null;
}

export const coaList = Object.entries(coaBySlug).map(([slug, v]) => ({ slug, ...v }));

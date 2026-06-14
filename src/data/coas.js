/* Certificate of Analysis (COA) data - one entry per product, keyed by Woo slug.
   PDFs live in /public/coas/<slug>.pdf (self-hosted on this site so they
   survive the old ironwithinlabs.com store being retired). */

export const coaBySlug = {
  'thymosin-alpha-1': { coaFile: '/coas/thymosin-alpha-1.pdf', batchDate: '5/6/2026', productName: 'Thymosin Alpha 1' },
  'bpc-157': { coaFile: '/coas/bpc-157.pdf', batchDate: '4/16/2026', productName: 'BPC-157' },
  'dsip-10mg': { coaFile: '/coas/dsip-10mg.pdf', batchDate: '2/22/2026', productName: 'DSIP' },
  'iwr-h2o': { coaFile: '/coas/iwr-h2o.pdf', batchDate: '1/09/2026', productName: 'IWR H2O' },
  'semax': { coaFile: '/coas/semax.pdf', batchDate: '2/16/2026', productName: 'Semax' },
  'selank': { coaFile: '/coas/selank.pdf', batchDate: '4/16/26', productName: 'Selank' },
  'pt-141': { coaFile: '/coas/pt-141.pdf', batchDate: '4/16/2026', productName: 'PT-141' },
  'kisspeptin': { coaFile: '/coas/kisspeptin.pdf', batchDate: '5/6/2026', productName: 'Kisspeptin' },
  'trz-2': { coaFile: '/coas/trz-2.pdf', batchDate: '04/16/2026', productName: 'TRZ-2' },
  'thymalin': { coaFile: '/coas/thymalin.pdf', batchDate: '5/6/2026', productName: 'Thymalin' },
  'tesamorelin': { coaFile: '/coas/tesamorelin.pdf', batchDate: '4/16/2026', productName: 'Tesamorelin' },
  'slu-pp-332': { coaFile: '/coas/slu-pp-332.pdf', batchDate: '2/22/2026', productName: 'SLU-PP-332' },
  'sermorelin': { coaFile: '/coas/sermorelin.pdf', batchDate: '2/22/2026', productName: 'Sermorelin' },
  'rt-3': { coaFile: '/coas/rt-3.pdf', batchDate: '4/16/2026', productName: 'RT-3' },
  'mt-2': { coaFile: '/coas/mt-2.pdf', batchDate: '5/6/2026', productName: 'MT-2' },
  'mots-c': { coaFile: '/coas/mots-c.pdf', batchDate: '5/6/2026', productName: 'MOTS-C' },
  'lipo-c': { coaFile: '/coas/lipo-c.pdf', batchDate: '5/6/2026', productName: 'Lipo-C' },
  'klow': { coaFile: '/coas/klow.pdf', batchDate: '4/16/2026', productName: 'KLOW' },
  'ipa': { coaFile: '/coas/ipa.pdf', batchDate: '2/22/2026', productName: 'Ipa' },
  'cjc-w-o-dac': { coaFile: '/coas/cjc-w-o-dac.pdf', batchDate: '2/22/2026', productName: 'CJC w/o DAC' },
  'cjc-ipa': { coaFile: '/coas/cjc-ipa.pdf', batchDate: '2/22/2026', productName: 'CJC / IPA' },
  'cagrillintide': { coaFile: '/coas/cagrillintide.pdf', batchDate: '4/16/2026', productName: 'Cagrillintide' },
  'aod-9604-10mg': { coaFile: '/coas/aod-9604-10mg.pdf', batchDate: '2/22/2026', productName: 'AOD 9604' },
  '5-amino-1mq-50mg': { coaFile: '/coas/5-amino-1mq-50mg.pdf', batchDate: '2/22/2026', productName: '5-Amino-1MQ' },
  'nad': { coaFile: '/coas/nad.pdf', batchDate: '2/22/2026', productName: 'NAD+' },
  'kpv': { coaFile: '/coas/kpv.pdf', batchDate: '5/6/2026', productName: 'KPV' },
  'epitalon-10mg': { coaFile: '/coas/epitalon-10mg.pdf', batchDate: '5/6/2026', productName: 'Epitalon' },
  'glow-bundle': { coaFile: '/coas/glow-bundle.pdf', batchDate: '4/16/2026', productName: 'GLOW' },
  'ghk-cu': { coaFile: '/coas/ghk-cu.pdf', batchDate: '4/16/2026', productName: 'GHK-Cu' },
  'bpc-157-tb500-10mg': { coaFile: '/coas/bpc-157-tb500-10mg.pdf', batchDate: '02/22/2026', productName: 'BPC-157 / TB500' },
};

export function getCoa(slug) {
  if (!slug) return null;
  return coaBySlug[slug] || null;
}

export const coaList = Object.entries(coaBySlug).map(([slug, v]) => ({ slug, ...v }));

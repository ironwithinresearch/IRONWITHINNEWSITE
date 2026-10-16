// 360-degree turntable videos of each vial (Blender renders, 15 Oct 2026), keyed by Woo product slug
// then dose ('' = simple product). Files live in /public/spins/<label>.mp4. Generated from
// ~/iw-labels/blender/site/plan.json — regenerate rather than hand-edit.
const SPINS = {
  "5-amino-1mq-50mg": {
    "50mg": "5-amino-1mq-50mg"
  },
  "adamax-10mg": {
    "10mg": "adamax-10mg"
  },
  "ahk-cu-100mg": {
    "100mg": "ahk-cu-100mg"
  },
  "aod-9604-10mg": {
    "10mg": "aod-9604-10mg",
    "5mg": "aod-9604-5mg"
  },
  "ara-290": {
    "10mg": "ara-290-10mg"
  },
  "bpc-157": {
    "10mg": "bpc-157-10mg"
  },
  "bpc-157-tb-500-nasal": {
    "": "bpc-tb-nasal-20mg"
  },
  "bpc-157-tb500-10mg": {
    "10mg + 10mg": "bpc-157-tb500-10mg-10mg",
    "5mg + 5mg": "bpc-157-tb500-5mg-5mg"
  },
  "cagrillintide": {
    "10mg": "cagrillintide-10mg"
  },
  "cerebrolysin": {
    "60mg": "cerebrolysin-60mg"
  },
  "cjc-ipa": {
    "5mg + 5mg": "cjc-ipa-5mg-5mg"
  },
  "cjc-w-o-dac": {
    "10mg": "cjc-w-o-dac-10mg"
  },
  "dsip-10mg": {
    "10mg": "dsip-10mg",
    "5mg": "dsip-5mg"
  },
  "dsip-nasal": {
    "": "dsip-nasal-10mg"
  },
  "eloralintide": {
    "5mg": "eloralintide-5mg"
  },
  "epitalon-10mg": {
    "10mg": "epitalon-10mg",
    "50mg": "epitalon-50mg"
  },
  "foxo4": {
    "10mg": "foxo4-10mg"
  },
  "ghk-cu": {
    "100mg": "ghk-cu-100mg",
    "50mg": "ghk-cu-50mg"
  },
  "ghk-cu-kpv": {
    "50mg + 10mg": "ghk-cu-kpv-50mg-10mg"
  },
  "ghk-cu-nasal": {
    "": "ghk-cu-nasal-100mg"
  },
  "glow-bundle": {
    "70mg": "glow-70mg"
  },
  "igf-1-lr3": {
    "1mg": "igf-1-lr3-1mg"
  },
  "ipa": {
    "10mg": "ipa-10mg"
  },
  "iron-energy": {
    "": "iron-energy-10ml"
  },
  "iron-f-bomb": {
    "": "iron-f-bomb-10ml"
  },
  "iron-healthy-blend": {
    "": "iron-healthy-blend-10ml"
  },
  "iron-pm-dreams": {
    "": "iron-pm-dreams-10ml"
  },
  "iron-regen": {
    "48mg": "iron-regen-48mg"
  },
  "iron-superman-blend": {
    "": "iron-superman-blend-10ml"
  },
  "iwr-h2o": {
    "30ml": "iwr-h2o-30ml"
  },
  "kisspeptin": {
    "10mg": "kisspeptin-10mg",
    "5mg": "kisspeptin-5mg"
  },
  "klow": {
    "80mg": "klow-80mg"
  },
  "kpv": {
    "10mg": "kpv-10mg",
    "20mg": "kpv-20mg",
    "30mg": "kpv-30mg"
  },
  "kpv-nasal": {
    "": "kpv-nasal-10mg"
  },
  "l-glutathione": {
    "1500mg": "l-glutathione-1500mg"
  },
  "lemon-bottle": {
    "10ml": "lemon-bottle-10ml"
  },
  "lipo-c": {
    "10ml": "lipo-c-10ml"
  },
  "ll-37": {
    "5mg": "ll-37-5mg"
  },
  "mots-c": {
    "40mg": "mots-c-40mg"
  },
  "mt-2": {
    "10mg": "mt-2-10mg"
  },
  "mt-2-nasal": {
    "": "mt-2-nasal-10mg"
  },
  "nad": {
    "1000mg": "nad-1000mg",
    "500mg": "nad-500mg"
  },
  "nad-nasal": {
    "": "nad-nasal-500mg"
  },
  "oxytocin": {
    "10mg": "oxytocin-10mg"
  },
  "pe-22-28": {
    "5mg": "pe-22-28-5mg"
  },
  "pinealon": {
    "10mg": "pinealon-10mg"
  },
  "pnc-27": {
    "10mg": "pnc-27-10mg"
  },
  "pt-141": {
    "10mg": "pt-141-10mg"
  },
  "pt-141-nasal": {
    "": "pt-141-nasal-20mg"
  },
  "rt-3": {
    "10mg": "rt-3-10mg",
    "20mg": "rt-3-20mg",
    "30mg": "rt-3-30mg",
    "60mg": "rt-3-60mg"
  },
  "selank": {
    "10mg": "selank-10mg"
  },
  "selank-nasal": {
    "": "selank-nasal-10mg"
  },
  "semax": {
    "10mg": "semax-10mg"
  },
  "semax-nasal": {
    "": "semax-nasal-10mg"
  },
  "sermorelin": {
    "5mg": "s-5-5mg"
  },
  "slu-pp-332": {
    "5mg": "slu-pp-332-5mg"
  },
  "snap-8": {
    "10mg": "snap-8-10mg"
  },
  "ss-31": {
    "50mg": "ss-31-50mg"
  },
  "tb-500": {
    "10mg": "tb-500-10mg"
  },
  "tesamorelin": {
    "10mg": "tsm-6-10mg"
  },
  "tesamorelin-ipamorelin-5-5": {
    "5mg + 5mg": "tsm-6-ipa-5mg-5mg"
  },
  "thrive": {
    "120mg": "thrive-120mg"
  },
  "thymalin": {
    "10mg": "thymalin-10mg"
  },
  "thymosin-alpha-1": {
    "10mg": "thymosin-alpha-1-10mg"
  },
  "trz-2": {
    "10mg": "trz-2-10mg",
    "30mg": "trz-2-30mg",
    "60mg": "trz-2-60mg"
  },
  "vip": {
    "10mg": "vip-10mg"
  }
};

export function getSpin(slug, dose) {
  const p = SPINS[slug];
  if (!p) return null;
  // Dose values can arrive as the term name ("5mg + 5mg") or its slug ("5mg-5mg").
  const key = (d) => String(d ?? '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  const hit = Object.keys(p).find((d) => key(d) === key(dose));
  // No dose (simple product) -> its single entry; a dose we have no render for -> no spin.
  const label = hit !== undefined ? p[hit] : dose == null ? p[''] ?? Object.values(p)[0] : null;
  return label ? `/spins/${label}.mp4` : null;
}

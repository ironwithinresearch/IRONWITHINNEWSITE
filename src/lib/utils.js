// src/lib/utils.js
// Utility functions for the frontend

/**
 * Cleans WooCommerce price strings that contain HTML entities
 * e.g. "Rs&nbsp;18" → "Rs 18"  |  "₨&nbsp;18" → "₨18"
 * Also strips HTML tags entirely for plain text use
 */
export function cleanPrice(price) {
  if (!price) return '';
  // Decode common HTML entities
  return price
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '') // strip any HTML tags
    .trim();
}

/**
 * Use this in dangerouslySetInnerHTML when you want to render
 * WooCommerce price HTML (preserves currency symbols + formatting)
 * but need to fix the &nbsp; showing as text
 */
export function decodePriceHtml(price) {
  if (!price) return '';
  return price
    .replace(/&nbsp;/g, '\u00A0') // actual non-breaking space
    .replace(/&amp;/g, '&');
}

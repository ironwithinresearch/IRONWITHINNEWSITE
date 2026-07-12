// Lux Me by Axion — the beauty line sold via the standalone luxmebyaxion.com
// storefront, which deep-links buyers into these Iron Within product pages.
// Those pages are exempt from the research-compound framing (age gate,
// research-use disclaimers) so beauty buyers get a clean skincare experience.
//
// Keep LUXME_SLUGS in sync with the `lux-me` WooCommerce category as the
// lineup grows.
export const LUXME_SLUGS = ['elixir-of-youth', 'radiant-renewal'];

// Client-only: is the current URL a Lux Me product page or the Lux Me shop view?
export function isLuxMePath() {
  if (typeof window === 'undefined') return false;
  const { pathname, search } = window.location;
  const m = pathname.match(/^\/product\/([^/]+)\/?$/);
  if (m && LUXME_SLUGS.includes(m[1])) return true;
  if (pathname.replace(/\/$/, '') === '/shop' && /(?:^|[?&])category=lux-me(?:&|$)/.test(search)) return true;
  return false;
}

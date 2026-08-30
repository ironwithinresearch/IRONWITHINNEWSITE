const SITE = "https://www.ironwithin.io";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/cart", "/checkout", "/orders", "/wishlist", "/search", "/api/"],
    },
    // Restored 2026-08-30: the route generates again (63 URLs, verified in the build), so the
    // reason it was pulled — a sitemap URL that 404d — no longer applies. Advertising a sitemap
    // that 404s is worse than advertising none, so if sitemap.js is ever disabled again, this
    // line must come out with it.
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}

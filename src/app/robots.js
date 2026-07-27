const SITE = "https://www.ironwithin.io";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/cart", "/checkout", "/orders", "/wishlist", "/search", "/api/"],
    },
    // Sitemap disabled 2026-07-27 (app/sitemap.js.disabled). Advertising a sitemap URL
    // that 404s is worse than advertising none, so the reference comes out with it.
    host: SITE,
  };
}

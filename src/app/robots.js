const SITE = "https://www.ironwithin.io";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/cart", "/checkout", "/orders", "/wishlist", "/search", "/api/"],
    },
    // Sitemap OFF by operator decision (2026-08-30). app/sitemap.js is renamed .disabled, so
    // the route does not exist — and the reference comes out with it, because advertising a
    // sitemap URL that 404s is worse than advertising none. The generator itself is untouched;
    // restoring is a rename plus this line. It was briefly re-enabled during a site check and
    // turned straight back off; do not "fix" it again without asking.
    host: SITE,
  };
}

/** @type {import('next').NextConfig} */

// Content-Security-Policy built from the site's actual origins:
//  - self + Next chunks
//  - GoAffPro affiliate loader/tracking (api.goaffpro.com, api2.goaffpro.com)
//  - Google Fonts (fonts.googleapis.com stylesheet, fonts.gstatic.com woff2)
//  - WooCommerce backend (bhidasowgm.onrocket.site): GraphQL + product images
// 'unsafe-inline' is required for Next's inline bootstrap + the app's inline
// styles (a nonce-based strict CSP would need middleware — future hardening).
// The payment-rail handoff is a top-level window.location navigation, which CSP
// does not restrict, so checkout is unaffected.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://api.goaffpro.com https://api2.goaffpro.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self'",
  "connect-src 'self' https://bhidasowgm.onrocket.site https://api.goaffpro.com https://api2.goaffpro.com",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  images: {
    domains: ["bhidasowgm.onrocket.site"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Apple Pay domain association. The file deliberately has NO extension, so without
        // this it is served as application/octet-stream. Apple's verifier fetches it over
        // HTTPS at this exact path and casing — no redirect, no auth, no rename.
        source: "/.well-known/apple-developer-merchantid-domain-association",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
    ];
  },
  // Continuity / Research Plans are delisted for now (the six plan products are
  // drafted in WooCommerce, so /continuity would render an empty offer page).
  // Redirect rather than 404: the URL is printed in the affiliate handbook and
  // swipe copy, and affiliates have been linking it. TEMPORARY (307) on purpose —
  // deleting this block and republishing the products restores the page as-is.
  // The 10 active prepaid plans keep shipping; iw-continuity.php is untouched.
  async redirects() {
    return [
      { source: "/continuity", destination: "/shop", permanent: false },
    ];
  },
};

module.exports = nextConfig;

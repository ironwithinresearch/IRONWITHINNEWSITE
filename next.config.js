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
    ];
  },
};

module.exports = nextConfig;

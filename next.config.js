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
// PeptidesPayment / SellAbroad card rail.
//   app.sellabroad.com  — the widget script and the payment iframe
//   oms.sellabroad.com  — the API the widget posts carts and charges to
//   *.basistheory.com   — their card vault; it renders the card fields in its own
//                         iframe, so it needs script AND frame, not just connect
// A missing host here does not error — the payment form simply renders as an empty
// box. That is exactly why Route's widget was never usable on this site, and it is
// the failure mode to check first if the card form ever goes blank. The browser
// console names the blocked host; add it here.
const PAY_HOSTS = {
  script: ["https://app.sellabroad.com", "https://js.basistheory.com"],
  frame: ["https://app.sellabroad.com", "https://*.basistheory.com"],
  connect: [
    "https://app.sellabroad.com",
    "https://oms.sellabroad.com",
    "https://api.basistheory.com",
  ],
};

// VerifyPass — teacher / military / first-responder verification on /heroes.
//   *.verifypass.com  — the widget script and the verification iframe
// Their exact host is not published; if the widget renders as an empty box, the browser
// console names the blocked origin and it goes here. Same failure mode as the card form
// above, and the same first thing to check.
const VERIFY_HOSTS = {
  script: ["https://*.verifypass.com", "https://verifypass.com"],
  frame: ["https://*.verifypass.com", "https://verifypass.com"],
  connect: ["https://*.verifypass.com", "https://verifypass.com"],
};

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://api.goaffpro.com https://api2.goaffpro.com ${PAY_HOSTS.script.join(" ")} ${VERIFY_HOSTS.script.join(" ")}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self'",
  `connect-src 'self' https://bhidasowgm.onrocket.site https://api.goaffpro.com https://api2.goaffpro.com ${PAY_HOSTS.connect.join(" ")} ${VERIFY_HOSTS.connect.join(" ")}`,
  `frame-src 'self' ${PAY_HOSTS.frame.join(" ")} ${VERIFY_HOSTS.frame.join(" ")}`,
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

// src/middleware.js
//
// Two gates, both enforced on the SERVER so a direct link or a no-JavaScript fetch can't
// see past them:
//
// 1. 21+ age gate (every page except the public list in src/lib/gate.js).
//    A visitor without the `iw_age21` cookie gets a standalone "Are you 21 or older?"
//    page instead of the content they asked for. The cookie is set when they confirm
//    21+ on that page (/api/age-confirm), log in, or register. Signed-in customers who
//    pre-date this gate carry a JWT in localStorage but no cookie — the gate page's
//    inline script spots the token, sets the cookie and reloads, so nobody is kicked out.
//    Gated pages are sent with `X-Robots-Tag: noindex` and never appear in search.
//    (Behind this, SiteGate.jsx still requires an ACCOUNT to browse — Brian's wall at
//    the door — and the backend still refuses orders from unapproved accounts.)
//
// 2. Affiliate section password (/affiliate, /affiliate/*, /affiliate-assets/*).
//    The password lives in AFFILIATE_ACCESS_PASSWORD (Vercel). Visitors without a valid
//    gate cookie are redirected to /affiliate-access to enter it.
//
// Runs on the Edge runtime → use Web Crypto (crypto.subtle), not node:crypto.

import { NextResponse } from 'next/server';
import { AGE_COOKIE, isPublicPath } from './lib/gate';

const AFF_COOKIE = 'iw_aff_gate';

// SHA-256 hex of a namespaced password. MUST match tokenFor() in
// src/app/api/affiliate-access/route.js so the cookie set there validates here.
async function tokenFor(pw) {
  const data = new TextEncoder().encode('iwaff:v1:' + pw);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Returns a redirect when the affiliate password is required, otherwise null. */
async function affiliateGate(req) {
  const pw = process.env.AFFILIATE_ACCESS_PASSWORD;
  // Fail open if unconfigured — never brick the affiliate section on a missing env.
  if (!pw) return null;
  const token = req.cookies.get(AFF_COOKIE)?.value;
  if (token && token === (await tokenFor(pw))) return null;

  const nextPath = req.nextUrl.pathname + (req.nextUrl.search || '');
  const url = req.nextUrl.clone();
  url.pathname = '/affiliate-access';
  url.search = '';
  url.searchParams.set('next', nextPath);
  return NextResponse.redirect(url);
}

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function gatePage(nextPath) {
  const enc = encodeURIComponent(nextPath);
  const yesRegister = `/api/age-confirm?next=${encodeURIComponent(`/register?redirect=${enc}`)}`;
  const yesLogin = `/api/age-confirm?next=${encodeURIComponent(`/login?redirect=${enc}`)}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Age verification required | Iron Within Research</title>
<meta name="description" content="Iron Within Research is restricted to researchers aged 21 and over. Products are for laboratory research use only.">
<script>
/* Signed-in customer from before the server gate existed: they hold a valid JWT in
   localStorage (they confirmed 21+ when they signed up) but no cookie yet. */
try {
  var t = localStorage.getItem('jwt_token');
  if (t) {
    var p = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!p.exp || p.exp * 1000 > Date.now()) {
      document.cookie = '${AGE_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
      document.documentElement.style.visibility = 'hidden';
      location.reload();
    }
  }
} catch (e) {}
</script>
<style>
:root{--bg:#f4f6fb;--card:#fff;--ink:#0b1220;--muted:#4a5568;--line:#dfe4ee;--accent:#0a84b8;--accent2:#6d3fd6;--btn-ink:#fff;--soft:#eef3fa}
@media (prefers-color-scheme:dark){:root{--bg:#070b14;--card:#0e1524;--ink:#eef2f8;--muted:#a3afc2;--line:#22304a;--accent:#38bdf8;--accent2:#8b5cf6;--btn-ink:#04121a;--soft:#122036}}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;-webkit-text-size-adjust:100%}
main{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px}
.card{width:100%;max-width:460px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:32px 24px;text-align:center;box-shadow:0 20px 50px rgba(10,20,40,.08)}
.brand{display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;letter-spacing:.04em;font-size:.95rem;margin-bottom:22px}
.brand img{width:34px;height:34px;border-radius:8px}
.eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin:0 0 8px}
h1{font-size:1.6rem;line-height:1.2;margin:0 0 12px}
p{color:var(--muted);line-height:1.6;margin:0 0 18px;font-size:.95rem}
.note{background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:.84rem;text-align:left}
.btns{display:flex;flex-direction:column;gap:10px;margin-top:6px}
a.btn{display:flex;align-items:center;justify-content:center;min-height:48px;padding:12px 16px;border-radius:12px;font-weight:700;font-size:1rem;text-decoration:none}
a.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:var(--btn-ink)}
a.secondary{border:1px solid var(--line);color:var(--ink)}
a.exit{color:var(--muted);font-weight:600;font-size:.92rem}
a.btn:focus-visible,.legal a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.legal{margin-top:22px;font-size:.78rem;color:var(--muted);display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center}
.legal a{color:var(--muted);text-decoration:underline;text-underline-offset:2px;padding:4px 0}
</style>
</head>
<body>
<main>
  <div class="card" role="dialog" aria-labelledby="h" aria-describedby="d">
    <div class="brand"><img src="/logo-mark.png" alt="" width="34" height="34">IRON WITHIN RESEARCH</div>
    <p class="eyebrow">Age verification</p>
    <h1 id="h">Are you 21 or older?</h1>
    <p id="d">This site is restricted to researchers aged 21 and over. You will need a researcher account to view the catalog.</p>
    <p class="note">All products are sold for <strong>laboratory research use only</strong>. They are not for human or veterinary use, diagnosis, treatment or consumption.</p>
    <div class="btns">
      <a class="btn primary" href="${esc(yesRegister)}">Yes, I am 21+ &mdash; create an account</a>
      <a class="btn secondary" href="${esc(yesLogin)}">Yes, I am 21+ &mdash; sign in</a>
      <a class="btn exit" href="https://www.google.com/" rel="noopener">No, I am under 21 &mdash; leave this site</a>
    </div>
    <nav class="legal" aria-label="Policies">
      <a href="/ruo-policy">Research Use Only Policy</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/disclaimer">Disclaimer</a>
    </nav>
  </div>
</main>
</body>
</html>`;
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  // Affiliate section: its own password first.
  if (pathname === '/affiliate' || pathname.startsWith('/affiliate/') || pathname.startsWith('/affiliate-assets/')) {
    const redirect = await affiliateGate(req);
    if (redirect) return redirect;
    // Swipe images are behind the password; they are not pages, so no age interstitial.
    if (pathname.startsWith('/affiliate-assets/')) return NextResponse.next();
  }

  if (isPublicPath(pathname)) return NextResponse.next();

  if (req.cookies.get(AGE_COOKIE)?.value === '1') {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }

  return new NextResponse(gatePage(pathname + (search || '')), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
}

// Every page route; static files (anything with an extension), Next internals and API
// routes are skipped. The affiliate swipe graphics are listed separately because they
// are .png files that must still be password-gated.
export const config = {
  matcher: [
    '/((?!_next/|_vercel/|api/|.*\\.[A-Za-z0-9]{2,5}$).*)',
    '/affiliate-assets/:path*',
  ],
};

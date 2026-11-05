// Service worker for the installable app (app.ironwithin.io only — 404 elsewhere, and
// the page only registers it on the app host).
//
// What it does, deliberately little:
//   - pages always come from the network; if the network is gone, show /offline.html;
//   - caches ONLY immutable static assets (/_next/static, app icons, the logo);
//   - NEVER caches API, GraphQL (a different origin, so it is never even intercepted),
//     cart, checkout or account responses — those requests pass straight through;
//   - shows push notifications and opens the right page when one is tapped.
// The cache name carries the deploy's commit, so each deploy starts a clean cache.
import { isAppHost } from '@/lib/appHost';

export const dynamic = 'force-dynamic';

const VERSION = (process.env.VERCEL_GIT_COMMIT_SHA || 'dev').slice(0, 12);

const SW = `/* Iron Within Research app service worker ${VERSION} */
const CACHE = 'iwa-${VERSION}';
const OFFLINE = '/offline.html';
const PRECACHE = [OFFLINE, '/app-icons/icon-192.png', '/logo-mark.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('iwa-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function isStatic(url) {
  return url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/app-icons/') ||
    url.pathname === '/logo-mark.png' || url.pathname === '/offline.html' || /\\.woff2?$/.test(url.pathname);
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // GraphQL, images CDN, chat: untouched
  if (url.pathname.startsWith('/api/')) return;               // never cached, never intercepted

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match(OFFLINE)));
    return;
  }
  if (isStatic(url)) {
    e.respondWith(caches.open(CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === 'basic') c.put(req, res.clone());
      return res;
    }))));
  }
});

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  const title = d.title || 'Iron Within Research';
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || '',
    icon: '/app-icons/icon-192.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: { url: d.url || '/alerts' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  let target = '/alerts';
  try {
    const u = new URL((e.notification.data && e.notification.data.url) || '/alerts', self.location.origin);
    if (u.origin === self.location.origin) target = u.pathname + u.search;   // only ever open our own pages
  } catch (_) {}
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) {
      if ('focus' in c) { c.navigate(target).catch(() => {}); return c.focus(); }
    }
    return self.clients.openWindow(target);
  }));
});
`;

export function GET(request) {
  if (!isAppHost(request.headers.get('host'))) return new Response('Not found', { status: 404 });
  return new Response(SW, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Service-Worker-Allowed': '/',
    },
  });
}

// Web app manifest for the installable app. Served ONLY on the app host
// (app.ironwithin.io / app.localhost); www gets a 404 so it never becomes installable.
import { isAppHost, APP_NAME, APP_SHORT_NAME } from '@/lib/appHost';

export const dynamic = 'force-dynamic';

export function GET(request) {
  if (!isAppHost(request.headers.get('host'))) return new Response('Not found', { status: 404 });
  const manifest = {
    id: '/shop',
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: 'Shop Iron Within Research products, get back-in-stock alerts and message support. For research use only. Not for human or veterinary use.',
    start_url: '/shop?source=app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F5F8FD',
    theme_color: '#ffffff',
    categories: ['shopping'],
    icons: [
      { src: '/app-icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/app-icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/app-icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/app-icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Cart', url: '/cart', icons: [{ src: '/app-icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Back-in-stock alerts', short_name: 'Alerts', url: '/alerts', icons: [{ src: '/app-icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Help', url: '/help', icons: [{ src: '/app-icons/icon-192.png', sizes: '192x192' }] },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

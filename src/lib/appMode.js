// src/lib/appMode.js
//
// "App mode" = the same storefront served on app.ironwithin.io as an installable app
// (bottom tab bar, no marketing chrome, push restock alerts, in-app support chat).
// www.ironwithin.io must look and behave exactly as before, so EVERYTHING app-specific
// keys off the host:
//   - an inline script in layout.js sets <html data-app="1"> before first paint, and CSS
//     in app.css shows/hides the two chromes (no flash, product pages stay static);
//   - React code reads that attribute through useAppMode();
//   - the manifest and service-worker routes 404 on any other host.
// app.localhost is accepted so the app can be tested locally (http://app.localhost:3000).

import { useEffect, useState } from 'react';

export { APP_ORIGIN, APP_NAME, APP_SHORT_NAME, RUO_LINE, isAppHost, APP_BOOT_SCRIPT } from './appHost';

/** Browser-side, synchronous: true once the pre-paint script has flagged the page. */
export function inAppMode() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-app') === '1';
}

/** True when launched from the home screen (installed). */
export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

/** React: false on the server and first render (matches the static HTML), then the truth. */
export function useAppMode() {
  const [app, setApp] = useState(false);
  useEffect(() => { setApp(inAppMode()); }, []);
  return app;
}

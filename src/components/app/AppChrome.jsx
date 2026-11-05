'use client';
// src/components/app/AppChrome.jsx
//
// The app's own chrome (app.ironwithin.io only): compact top bar (logo + cart, with a back
// button off the main tabs, because an installed app has no browser back button), the
// bottom tab bar, the install prompts and service-worker registration.
//
// It is server-rendered inside .iw-app-only, which CSS hides unless <html data-app="1">,
// so on www it is invisible and every effect below returns before doing anything.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Store, Search, ShoppingCart, Bell, LifeBuoy, User, ChevronLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { APP_NAME, inAppMode, isStandalone } from '@/lib/appMode';
import { syncPush, isIOS } from '@/lib/push';

const TABS = [
  { href: '/shop',    label: 'Shop',    Icon: Store,        match: ['/shop', '/product', '/categories', '/deals', '/merch', '/gift-cards', '/lab-reports', '/coas'] },
  { href: '/search',  label: 'Search',  Icon: Search,       match: ['/search'] },
  { href: '/cart',    label: 'Cart',    Icon: ShoppingCart, match: ['/cart', '/checkout'] },
  { href: '/alerts',  label: 'Alerts',  Icon: Bell,         match: ['/alerts'] },
  { href: '/help',    label: 'Help',    Icon: LifeBuoy,     match: ['/help', '/contact', '/faq', '/claims', '/shipping', '/refund'] },
  { href: '/account', label: 'Account', Icon: User,         match: ['/account', '/orders', '/login', '/register', '/wishlist', '/rewards', '/forgot-password', '/reset-password'] },
];
const ROOTS = TABS.map((t) => t.href);

const within = (path, prefixes) => prefixes.some((p) => path === p || path.startsWith(p + '/'));

const DISMISS_KEY = 'iwa_install_dismissed';
const IOS_KEY = 'iwa_ios_sheet_shown';

/** iPhone/iPad Safari itself — not Chrome/Firefox/Edge on iOS, not an in-app browser. */
function isIOSSafari() {
  if (!isIOS()) return false;
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA|Instagram|FBAN|FBAV/.test(ua);
}

export function IOSInstallSheet({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div className="iwa-sheet-back" onClick={onClose} aria-hidden="true" />
      <div className="iwa-sheet" role="dialog" aria-modal="true" aria-labelledby="iwa-ios-h">
        <h2 id="iwa-ios-h">Add {APP_NAME} to your Home Screen</h2>
        <p>Install the app to shop in one tap and get back-in-stock alerts on your iPhone.</p>
        <ol>
          <li>Tap the <strong>Share</strong> button in Safari (the square with an arrow pointing up).</li>
          <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
          <li>Tap <strong>Add</strong>, then open the app from your Home Screen.</li>
        </ol>
        <button type="button" className="iwa-btn" style={{ width: '100%' }} onClick={onClose}>Got it</button>
      </div>
    </>
  );
}

export default function AppChrome() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const { itemCount } = useCart();
  const { isLoggedIn } = useAuth();
  const [installEvt, setInstallEvt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [iosSheet, setIosSheet] = useState(false);
  const evtRef = useRef(null);

  // Service worker + install prompts — app host only.
  useEffect(() => {
    if (!inAppMode()) return undefined;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    }
    if (isStandalone()) return undefined;

    let dismissed = 0;
    try { dismissed = Number(localStorage.getItem(DISMISS_KEY) || 0); } catch {}
    const recentlyDismissed = Date.now() - dismissed < 14 * 864e5;

    const onPrompt = (e) => {
      e.preventDefault();
      setInstallEvt(e);
      evtRef.current = e;
      if (!recentlyDismissed) setShowBanner(true);
    };
    const onInstalled = () => { setShowBanner(false); setInstallEvt(null); evtRef.current = null; };
    // The Alerts tab's "Install the app" button asks here (the browser's prompt event lives in this component).
    const onAsk = () => {
      if (evtRef.current) { evtRef.current.prompt(); evtRef.current = null; setInstallEvt(null); setShowBanner(false); }
      else if (isIOS()) setIosSheet(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('iwa:install-help', onAsk);

    // iPhone: one-time instructions sheet, Safari only.
    let t;
    if (isIOSSafari()) {
      let shown = false;
      try { shown = !!localStorage.getItem(IOS_KEY); } catch {}
      if (!shown) {
        t = setTimeout(() => {
          setIosSheet(true);
          try { localStorage.setItem(IOS_KEY, '1'); } catch {}
        }, 2500);
      }
    }
    return () => {
      clearTimeout(t);
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('iwa:install-help', onAsk);
    };
  }, []);

  // Keep this device's push subscription registered to whoever is signed in.
  useEffect(() => {
    if (inAppMode() && isLoggedIn) syncPush();
  }, [isLoggedIn]);

  const install = async () => {
    if (!installEvt) return;
    installEvt.prompt();
    try { await installEvt.userChoice; } catch {}
    setInstallEvt(null);
    evtRef.current = null;
    setShowBanner(false);
  };
  const dismiss = () => {
    setShowBanner(false);
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
  };

  const atRoot = ROOTS.includes(pathname);
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/shop');
  };

  return (
    <>
      <header className="iwa-top">
        <div className="iwa-top-inner">
          {atRoot ? (
            <Link href="/shop" className="iwa-brand" aria-label={`${APP_NAME} — shop`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.png" alt="" width={32} height={32} />
              <span>{APP_NAME}</span>
            </Link>
          ) : (
            <button type="button" onClick={goBack} className="iwa-brand" aria-label="Back"
              style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }}>
              <ChevronLeft size={24} aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.png" alt="" width={32} height={32} />
            </button>
          )}
          <Link href="/cart" className="iwa-cart" aria-label={`Cart${itemCount ? `, ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}>
            <ShoppingCart size={22} aria-hidden="true" />
            {itemCount > 0 && <span className="iwa-badge">{itemCount > 99 ? '99+' : itemCount}</span>}
          </Link>
        </div>
      </header>

      <nav className="iwa-tabs" aria-label="App">
        <ul>
          {TABS.map(({ href, label, Icon, match }) => {
            const active = within(pathname, match);
            return (
              <li key={href}>
                <Link href={href} className="iwa-tab" aria-current={active ? 'page' : undefined}>
                  <Icon size={21} aria-hidden="true" />
                  {label}
                  {href === '/cart' && itemCount > 0 && <span className="iwa-dot" aria-hidden="true">{itemCount > 9 ? '9+' : itemCount}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {showBanner && installEvt && (
        <div className="iwa-install" role="region" aria-label="Install the app">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app-icons/icon-192.png" alt="" width={40} height={40} style={{ borderRadius: 10 }} />
          <p>Install the {APP_NAME} app for one-tap shopping and back-in-stock alerts.</p>
          <button type="button" className="iwa-btn" onClick={install}>Install</button>
          <button type="button" className="iwa-x" onClick={dismiss} aria-label="Not now">×</button>
        </div>
      )}

      <IOSInstallSheet open={iosSheet} onClose={() => setIosSheet(false)} />
    </>
  );
}

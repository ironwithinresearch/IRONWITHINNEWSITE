// src/lib/push.js
//
// Browser side of the app's restock push alerts. Subscriptions and the watch list live
// on the WordPress backend (mu-plugin iw-app-push.php); the browser reaches it through
// the same-origin proxy /api/push/<action>, authenticated with the customer's JWT.

import { getToken } from './auth';

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

export function pushSupported() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && !!VAPID;
}

/** iPhone/iPad: Web Push only works once the app is added to the Home Screen (iOS 16.4+). */
export function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export async function api(action, body) {
  const t = getToken();
  if (!t) return { ok: false, status: 401, data: { error: 'Please sign in first.' } };
  try {
    const res = await fetch(`/api/push/${action}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { Authorization: `Bearer ${t}`, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'No connection — please try again.' } };
  }
}

function b64ToBytes(s) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function registration() {
  const reg = await navigator.serviceWorker.getRegistration('/');
  return reg || navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

/** Current state of THIS device: 'unsupported' | 'denied' | 'on' | 'off'. */
export async function pushState() {
  if (!pushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const reg = await navigator.serviceWorker.getRegistration('/');
    const sub = reg && (await reg.pushManager.getSubscription());
    return sub && Notification.permission === 'granted' ? 'on' : 'off';
  } catch { return 'off'; }
}

/** Ask permission (must run from a tap), subscribe, and register the device. */
export async function enablePush() {
  if (!pushSupported()) return { ok: false, error: 'This browser cannot receive notifications.' };
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') {
    return { ok: false, error: perm === 'denied'
      ? 'Notifications are blocked for this app. Turn them on in your phone settings, then try again.'
      : 'Notifications were not turned on.' };
  }
  try {
    const reg = await registration();
    await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID) });
    const r = await api('subscribe', { ...sub.toJSON(), ua: navigator.userAgent.slice(0, 200) });
    if (!r.ok) return { ok: false, error: r.data.error || 'Could not turn on notifications. Please try again.' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not turn on notifications on this device.' };
  }
}

export async function disablePush() {
  try {
    const reg = await navigator.serviceWorker.getRegistration('/');
    const sub = reg && (await reg.pushManager.getSubscription());
    if (sub) {
      await api('unsubscribe', { endpoint: sub.endpoint });
      await sub.unsubscribe();
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not turn notifications off. Please try again.' };
  }
}

/** Keep the backend's copy fresh (the browser can rotate a subscription). Silent. */
export async function syncPush() {
  try {
    if (!pushSupported() || Notification.permission !== 'granted' || !getToken()) return;
    const reg = await navigator.serviceWorker.getRegistration('/');
    const sub = reg && (await reg.pushManager.getSubscription());
    if (sub) await api('subscribe', { ...sub.toJSON(), ua: navigator.userAgent.slice(0, 200) });
  } catch { /* best effort */ }
}

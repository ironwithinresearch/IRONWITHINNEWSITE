// src/app/api/push/[action]/route.js
//
// Same-origin proxy from the app to the backend's push endpoints (mu-plugin
// iw-app-push.php, /wp-json/iw/v1/push/*). The customer's JWT rides along unchanged and
// the backend decides who they are — nothing here trusts the browser about identity.
// Only the listed actions pass; the operator test and the sender are not reachable here.

import { NextResponse } from 'next/server';

const WP_URL = 'https://api.ironwithin.io';
const ALLOWED = {
  status: 'GET', watches: 'GET',
  subscribe: 'POST', unsubscribe: 'POST', watch: 'POST', unwatch: 'POST', 'test-self': 'POST',
};

export const dynamic = 'force-dynamic';

async function forward(request, action, method) {
  if (ALLOWED[action] !== method) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
  try {
    const body = method === 'POST' ? JSON.stringify(await request.json().catch(() => ({}))) : undefined;
    const res = await fetch(`${WP_URL}/wp-json/iw/v1/push/${action}`, {
      method,
      headers: { Authorization: auth, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body,
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ error: 'Your session has expired — please sign in again.' }, { status: 401 });
    }
    return NextResponse.json(data, { status: res.status, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not reach the store — please try again.' }, { status: 502 });
  }
}

export function GET(request, { params }) { return forward(request, params.action, 'GET'); }
export function POST(request, { params }) { return forward(request, params.action, 'POST'); }

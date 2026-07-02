'use client';
// Re:amaze Shoutbox (live chat + contact + FAQ + order/shopper apps).
// Account: iron-within-research. DEFERRED — the Re:amaze loader pulls in Pusher and
// is ~heavy, and nobody needs chat in the first seconds, so we hold it until the
// user first interacts (scroll/pointer/key/touch) or the browser goes idle (6s
// fallback). This keeps it off the critical path. CSP for *.reamaze.* is in next.config.js.

import { useEffect, useState } from 'react';

const REAMAZE_CONFIG = `
  var _support = _support || { 'ui': {}, 'user': {} };
  _support['account'] = 'iron-within-research';
  _support['ui']['contactMode'] = 'mixed';
  _support['ui']['enableKb'] = 'true';
  _support['ui']['styles'] = {
    widgetColor: 'rgba(16, 162, 197, 1)',
    gradient: true,
  };
  _support['ui']['shoutboxFacesMode'] = 'default';
  _support['ui']['shoutboxHeaderLogo'] = true;
  _support['ui']['widget'] = {
    displayOn: 'all',
    fontSize: 'default',
    allowBotProcessing: true,
    slug: 'iron-within-research-chat-slash-contact-form-shoutbox',
    label: {
      text: 'Let us know if you have any questions! &#128522;',
      mode: "notification",
      delay: 3,
      duration: 30,
      primary: 'I have a question',
      secondary: 'No, thanks',
      sound: true,
    },
    position: 'bottom-right',
    mobilePosition: 'bottom-right'
  };
  _support['apps'] = {
    faq: {"enabled":true},
    recentConversations: {},
    orders: {},
    shopper: {}
  };
  _support['ui']['appOrder'] = ["faq","orders","shopper","recentConversations"];
`;

export default function ReamazeChat() {
  const [load, setLoad] = useState(false);

  // Trigger loading on first interaction or when the browser is idle.
  useEffect(() => {
    let done = false;
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'mousemove'];
    let idleId;
    const trigger = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, trigger));
      if ('cancelIdleCallback' in window && typeof idleId === 'number') window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      setLoad(true);
    };
    events.forEach((e) => window.addEventListener(e, trigger, { once: true, passive: true }));
    idleId = 'requestIdleCallback' in window
      ? window.requestIdleCallback(trigger, { timeout: 6000 })
      : setTimeout(trigger, 6000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, trigger));
      if ('cancelIdleCallback' in window && typeof idleId === 'number') window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, []);

  // Inject the config (inline, runs immediately) then the async loader (reads _support).
  useEffect(() => {
    if (!load || window.__iwReamazeLoaded) return;
    window.__iwReamazeLoaded = true;
    const cfg = document.createElement('script');
    cfg.type = 'text/javascript';
    cfg.text = REAMAZE_CONFIG;
    document.body.appendChild(cfg);
    const loader = document.createElement('script');
    loader.src = 'https://cdn.reamaze.com/assets/reamaze-loader.js';
    loader.async = true;
    document.body.appendChild(loader);
  }, [load]);

  return null;
}

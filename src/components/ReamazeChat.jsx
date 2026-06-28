'use client';
// Re:amaze Shoutbox (live chat + contact + FAQ + order/shopper apps).
// Account: iron-within-research. Loads after the page is interactive so it
// never blocks first paint. CSP for *.reamaze.com is whitelisted in next.config.js.

import Script from 'next/script';

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
  return (
    <>
      <Script id="reamaze-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: REAMAZE_CONFIG }} />
      <Script id="reamaze-loader" src="https://cdn.reamaze.com/assets/reamaze-loader.js" strategy="afterInteractive" />
    </>
  );
}

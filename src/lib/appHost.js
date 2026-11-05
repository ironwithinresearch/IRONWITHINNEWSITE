// src/lib/appHost.js
// Pure host helpers for app mode (no React), safe for Edge middleware and route handlers.
// See src/lib/appMode.js for the full explanation.

export const APP_ORIGIN = 'https://app.ironwithin.io';
export const APP_NAME = 'Iron Within Research';
export const APP_SHORT_NAME = 'Iron Within';
export const RUO_LINE = 'For research use only. Not for human or veterinary use.';

export function isAppHost(host) {
  const h = String(host || '').toLowerCase().split(':')[0];
  return h === 'app.ironwithin.io' || h === 'app.localhost';
}

// Runs inline in <body> before anything paints. Kept tiny and dependency-free.
// On the app host it flags <html>, adds the manifest + iOS home-screen tags, and colours
// the browser chrome to match. On every other host it does nothing at all.
export const APP_BOOT_SCRIPT = `try{var h=location.hostname;if(h==='app.ironwithin.io'||h==='app.localhost'){var d=document,e=d.documentElement;e.setAttribute('data-app','1');var hd=d.head,m=function(t,a){var x=d.createElement(t);for(var k in a)x.setAttribute(k,a[k]);hd.appendChild(x)};m('link',{rel:'manifest',href:'/manifest.webmanifest'});m('meta',{name:'theme-color',content:'#ffffff'});m('meta',{name:'apple-mobile-web-app-capable',content:'yes'});m('meta',{name:'mobile-web-app-capable',content:'yes'});m('meta',{name:'apple-mobile-web-app-title',content:'${APP_SHORT_NAME}'});m('meta',{name:'apple-mobile-web-app-status-bar-style',content:'default'});var v=d.querySelector('meta[name=viewport]');if(v&&v.content.indexOf('viewport-fit')<0)v.content+=', viewport-fit=cover';if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone)e.setAttribute('data-standalone','1')}}catch(_){}`;

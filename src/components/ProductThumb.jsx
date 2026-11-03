'use client';
import Image from 'next/image';

/* Small product thumbnail for lists (cart, checkout summary, search, categories, orders).
 *
 * Product photos are 600x1280 WebP, about 50 kB each. A 32-70px thumbnail drawn from the
 * full file downloads all of that; through the image optimizer it is about 4 kB.
 * Fills its box exactly like the <img style="width:100%;height:100%"> it replaces.
 *
 * Only api.ironwithin.io is allowlisted in next.config.js images.remotePatterns, and
 * next/image throws on any other host. Old orders can still carry an image URL from a
 * previous backend, so anything off that host falls back to a plain <img>. */
const OPTIMIZABLE = /^https:\/\/api\.ironwithin\.io\//;

export default function ProductThumb({ src, alt = '', size = 64, fit = 'contain' }) {
  if (!OPTIMIZABLE.test(src || '')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: fit }} />;
  }
  return (
    <span style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
      <Image src={src} alt={alt} fill sizes={`${size}px`} style={{ objectFit: fit }} />
    </span>
  );
}

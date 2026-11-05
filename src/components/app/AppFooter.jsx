// src/components/app/AppFooter.jsx
// Slim footer for the app (replaces the big marketing footer there). Keeps the
// research-use-only line and the policy links on every app screen.
import Link from 'next/link';
import { RUO_LINE } from '@/lib/appHost';

const LINKS = [
  ['Terms', '/terms'], ['Privacy', '/privacy'], ['Research Use Only Policy', '/ruo-policy'],
  ['Shipping', '/shipping'], ['Refunds & store credit', '/refund'], ['Contact', '/contact'],
];

export default function AppFooter() {
  return (
    <footer className="iwa-foot">
      <strong>{RUO_LINE}</strong>
      <nav aria-label="Policies">
        {LINKS.map(([label, href]) => <Link key={href} href={href} className="iwa-link">{label}</Link>)}
      </nav>
    </footer>
  );
}

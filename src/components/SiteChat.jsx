'use client';
import { usePathname } from 'next/navigation';
import IWChatWidget from './IWChatWidget';

/* Support chat on every page (teammate feedback, 17 Oct: "we have chat support but there is
   no pop up for that feature"). It was only mounted on /contact. Still opens itself there. */
export default function SiteChat() {
  const path = usePathname() || '/';
  return <IWChatWidget key={path === '/contact' ? 'contact' : 'site'} autoOpen={path === '/contact'} />;
}

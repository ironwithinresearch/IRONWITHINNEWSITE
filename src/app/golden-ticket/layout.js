// Public and indexed: the Golden Ticket explainer, the FREE entry form and the rules must be reachable without an
// account or a purchase, so /golden-ticket is in PUBLIC_PREFIXES (src/lib/gate.js). Keep it there.
export const metadata = {
  title: 'Golden Tickets: 25 daily store-credit drawings | Iron Within Research',
  description: 'One Golden Ticket drawn every day, December 1–25, 2026. No purchase necessary: enter free each day, or with a paid order. Open to US residents 21+. Official rules on the site.',
  alternates: { canonical: 'https://www.ironwithin.io/golden-ticket' },
  openGraph: {
    title: 'Golden Tickets: one store-credit prize drawn every day, Dec 1–25',
    description: 'No purchase necessary. One chance per person per day. Open to US residents 21+.',
    url: 'https://www.ironwithin.io/golden-ticket',
    type: 'website',
  },
};
export default function GoldenTicketLayout({ children }) { return children; }

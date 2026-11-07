// Public and indexed. The Official Rules and the free entry form must be reachable without an
// account or a purchase — /giveaway is in PUBLIC_PREFIXES (src/lib/gate.js) for exactly that
// reason, and it needs to stay there. The cruise sweepstakes rules moved to /giveaway/cruise.
export const metadata = {
  title: 'Black Friday Giveaway: win up to $3,000 in store credit — Iron Within Research',
  description:
    'No purchase necessary. Enter free with the form, or with $450+ in paid orders. One entry per person. ' +
    'Open to US residents 21+. Entries close November 27, 2026. Official rules on the page.',
  alternates: { canonical: 'https://www.ironwithin.io/giveaway' },
  openGraph: {
    title: 'Black Friday Giveaway: up to $3,000 in store credit',
    description: 'No purchase necessary. One entry per person. Entries close November 27, 2026.',
    url: 'https://www.ironwithin.io/giveaway',
    type: 'website',
  },
};

export default function GiveawayLayout({ children }) {
  return children;
}

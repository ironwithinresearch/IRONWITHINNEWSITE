// Public and indexed as of 2026-09-05 (Brian's call). The Official Rules and the free mail-in
// address must stay reachable without an account — /giveaway is in SiteGate's PUBLIC_PREFIXES
// for exactly that reason, and it needs to stay there.
export const metadata = {
  title: 'Win a Carnival Cruise for Two — Iron Within Research',
  description:
    'No purchase necessary. One entry for every $100 spent, or enter free by mail. ' +
    'Open to US residents 21+. Ends November 30, 2026. Official rules on the page.',
  alternates: { canonical: 'https://www.ironwithin.io/giveaway' },
  openGraph: {
    title: 'Win a Carnival Cruise for Two',
    description: 'No purchase necessary. Every $100 spent is another entry. Ends November 30, 2026.',
    url: 'https://www.ironwithin.io/giveaway',
    type: 'website',
  },
};

export default function GiveawayLayout({ children }) {
  return children;
}

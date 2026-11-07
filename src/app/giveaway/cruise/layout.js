// The Carnival cruise sweepstakes (5 Sep -> 30 Nov 2026). Moved here from /giveaway on 7 Nov 2026 when
// /giveaway became the Black Friday Giveaway; the Official Rules and the free mail-in route stay
// public (/giveaway is a prefix in PUBLIC_PREFIXES, so this path is public too) and linked from
// /giveaway and /deals until the cruise drawing is done.
export const metadata = {
  title: 'Win a Carnival Cruise for Two — Iron Within Research',
  description:
    'No purchase necessary. One entry for every $100 spent, or enter free by mail. ' +
    'Open to US residents 21+. Ends November 30, 2026. Official rules on the page.',
  alternates: { canonical: 'https://www.ironwithin.io/giveaway/cruise' },
  openGraph: {
    title: 'Win a Carnival Cruise for Two',
    description: 'No purchase necessary. Every $100 spent is another entry. Ends November 30, 2026.',
    url: 'https://www.ironwithin.io/giveaway/cruise',
    type: 'website',
  },
};

export default function CruiseLayout({ children }) {
  return children;
}

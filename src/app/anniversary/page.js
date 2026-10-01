import AnniversaryClient from './AnniversaryClient';

// Static shell; every date-dependent piece (today's deal, which days are revealed, countdowns,
// Passport progress) resolves on the client so nothing time-sensitive is baked into the HTML.

export const metadata = {
  title: 'Anniversary Month — 31 Days of Deals | Iron Within Research',
  description:
    'Iron Within turns one. A new deal every day, October 1–31: daily sales, Flash Saturdays, ' +
    'Loyalty Sundays, the Anniversary Passport and a Grand Slam finale.',
  alternates: { canonical: 'https://www.ironwithin.io/anniversary' },
  openGraph: {
    title: 'Iron Within turns one — 31 days of deals',
    description: 'A new deal every day, October 1–31. Each day is revealed the night before.',
    url: 'https://www.ironwithin.io/anniversary',
  },
};

export default function AnniversaryPage() {
  return <AnniversaryClient />;
}

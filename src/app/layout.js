import "./globals.css";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AgeVerification from "../components/AgeVerification";
import AffiliateTracker from "../components/AffiliateTracker";
import ReferralCapture from "../components/ReferralCapture";
import LeadCapture from "../components/LeadCapture";
import ApolloWrapper from "../lib/ApolloWrapper";

const SITE_NAME = "Iron Within Research";
const SITE_DESC =
  "Research-grade peptides for laboratory research, independently third-party lab-tested with a Certificate of Analysis for every product. For research use only — not for human consumption.";

export const metadata = {
  metadataBase: new URL("https://www.ironwithin.io"),
  title: {
    default: "Iron Within Research — Premium Research Peptides",
    template: "%s | Iron Within Research",
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: ["research peptides", "research compounds", "lab-tested peptides", "certificate of analysis", "peptides for research"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "https://www.ironwithin.io",
    title: "Iron Within Research — Premium Research Peptides",
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: "Iron Within Research — Premium Research Peptides",
    description: SITE_DESC,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <AffiliateTracker />
          <ReferralCapture />
          <AgeVerification />
          <AnnouncementBar />
          <Navbar />
          <main style={{ minHeight: '100vh', paddingTop: 'calc(var(--navbar-height, 68px) + 36px)' }}>
            {children}
          </main>
          <Footer />
          <LeadCapture />
        </ApolloWrapper>
      </body>
    </html>
  );
}
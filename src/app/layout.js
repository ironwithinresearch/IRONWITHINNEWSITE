import "./globals.css";
import "./app.css";
import AnnouncementBar from "../components/AnnouncementBar";
import FlashBar from "../components/FlashBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SiteGate from "../components/SiteGate";
import AffiliateTracker from "../components/AffiliateTracker";
import ReferralCapture from "../components/ReferralCapture";
import LeadCapture from "../components/LeadCapture";
import GiftPromoPopup from "../components/GiftPromoPopup";
import QueenTheme from "../components/QueenTheme";
import ShippingPauseNotice from "../components/ShippingPauseNotice";
import SiteChat from "../components/SiteChat";
import ApolloWrapper from "../lib/ApolloWrapper";
import AppChrome from "../components/app/AppChrome";
import AppFooter from "../components/app/AppFooter";
import { APP_BOOT_SCRIPT } from "../lib/appHost";
// Vercel Web Analytics. Added 2026-08-26 — the store had NO analytics at all, so traffic
// had to be estimated by counting unique IPs in the Apache log. Serves its script and
// beacons from /_vercel/insights on this same origin, so the CSP needs no new host.
import { Analytics } from "@vercel/analytics/react";

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
  // The store sits behind a server-side 21+ gate, so its pages are kept out of search
  // (middleware also sends X-Robots-Tag). Public policy pages opt back in via their layouts.
  robots: { index: false, follow: false },
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
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        {/* Land in light by default; honor a returning visitor's saved choice
            BEFORE first paint so dark users don't see a flash of light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('iwr-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}`,
          }}
        />
        {/* App mode (app.ironwithin.io only): flags <html data-app> before first paint so the
            app chrome shows and the website chrome hides with no flash. No-op on www. */}
        <script dangerouslySetInnerHTML={{ __html: APP_BOOT_SCRIPT }} />
        <QueenTheme />
        <ApolloWrapper>
          <AffiliateTracker />
          <ReferralCapture />
          {/* Account wall (carries the 21+ confirmation). The standalone age pop-up
              is retired — age is confirmed on the register form's 21+ checkbox. */}
          <SiteGate />
          {/* Website chrome. The wrapper is display:contents on www (no layout change) and
              hidden in the app, which has its own top bar + tab bar below. */}
          <div className="iw-www-only">
            <FlashBar />
            <AnnouncementBar />
            <Navbar />
          </div>
          <div className="iw-app-only">
            <AppChrome />
          </div>
          <main style={{ minHeight: '100vh', paddingTop: 'calc(var(--navbar-height, 68px) + 36px)' }}>
            {children}
          </main>
          <div className="iw-www-only">
            <Footer />
          </div>
          <div className="iw-app-only">
            <AppFooter />
          </div>
          <LeadCapture />
          <GiftPromoPopup />
          <ShippingPauseNotice />
          {/* The website's chat bubble; the app uses the Help tab (Chatwoot) instead. */}
          <div className="iw-www-only">
            <SiteChat />
          </div>
        </ApolloWrapper>
        <Analytics />
      </body>
    </html>
  );
}
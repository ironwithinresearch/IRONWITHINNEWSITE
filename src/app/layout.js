import "./globals.css";
import { Inter, Manrope, Orbitron } from "next/font/google";
import AnnouncementBar from "../components/AnnouncementBar";
import FlashBar from "../components/FlashBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SiteGate from "../components/SiteGate";
import AffiliateTracker from "../components/AffiliateTracker";
import ReferralCapture from "../components/ReferralCapture";
import LeadCapture from "../components/LeadCapture";
import GiftPromoPopup from "../components/GiftPromoPopup";
import ShippingPauseNotice from "../components/ShippingPauseNotice";
import SiteChat from "../components/SiteChat";
import ApolloWrapper from "../lib/ApolloWrapper";
// Vercel Web Analytics. Added 2026-08-26 — the store had NO analytics at all, so traffic
// had to be estimated by counting unique IPs in the Apache log. Serves its script and
// beacons from /_vercel/insights on this same origin, so the CSP needs no new host.
import { Analytics } from "@vercel/analytics/react";

// Fonts are self-hosted by next/font (downloaded at build, served from this origin, preloaded).
// They used to come from a Google Fonts @import at the top of globals.css, which the browser
// could only discover after downloading that stylesheet — two extra round trips to Google
// before any text could render in its real face. The CSS variables feed --font-body /
// --font-heading / --font-brand in src/styles/theme.css. Orbitron is only the logo wordmark,
// so it is not preloaded. The weight lists are the ones the old @import asked for. next/font
// downloads the build Google gives Macs, iPhones and Android, so text on phones renders
// exactly as before; Windows/Linux desktops lose Google's hinted variant (barely visible).
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-orbitron", display: "swap", preload: false });

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
  // data-scroll-behavior: globals.css sets `scroll-behavior: smooth` for in-page
  // anchors. Next 16 stopped switching it off during route changes unless this
  // attribute is present, which would make every page change glide instead of jump.
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth" className={`${inter.variable} ${manrope.variable} ${orbitron.variable}`}>
      <body>
        {/* Land in light by default; honor a returning visitor's saved choice
            BEFORE first paint so dark users don't see a flash of light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('iwr-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}`,
          }}
        />
        <ApolloWrapper>
          <AffiliateTracker />
          <ReferralCapture />
          {/* Account wall (carries the 21+ confirmation). The standalone age pop-up
              is retired — age is confirmed on the register form's 21+ checkbox. */}
          <SiteGate />
          <FlashBar />
          <AnnouncementBar />
          <Navbar />
          <main style={{ minHeight: '100vh', paddingTop: 'calc(var(--navbar-height, 68px) + 36px)' }}>
            {children}
          </main>
          <Footer />
          <LeadCapture />
          <GiftPromoPopup />
          <ShippingPauseNotice />
          <SiteChat />
        </ApolloWrapper>
        <Analytics />
      </body>
    </html>
  );
}
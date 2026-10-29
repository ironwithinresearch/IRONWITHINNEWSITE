export const metadata = {
  title: "Report an Order Issue",
  description: "Missing, damaged or wrong item? Tell us what happened and we'll review it. Replacement or store credit is at our discretion under our policy.",
  alternates: { canonical: "/claims" },
  // Customer-only form behind the 21+ gate — keep it out of search.
  robots: { index: false, follow: false },
  openGraph: { title: "Report an Order Issue | Iron Within Research", description: "Tell us what happened with your order and we'll review it.", url: "https://www.ironwithin.io/claims" },
};

export default function Layout({ children }) {
  return children;
}

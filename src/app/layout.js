// src/app/layout.js
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AgeVerification from "../components/AgeVerification";
import ApolloWrapper from "../lib/ApolloWrapper";

export const metadata = {
  title: {
    default: "Iron Within Research — Premium Research Peptides",
    template: "%s | Iron Within Research",
  },
  description:
    "Premium quality research peptides trusted by researchers worldwide. Shop BPC-157, TB-500, Semaglutide, and more with fast shipping.",
  keywords: ["peptides", "research peptides", "BPC-157", "TB-500", "semaglutide", "iron within research"],
};

export const viewport = {
  themeColor: "#00CFFF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* ApolloWrapper provides: ApolloClient + AuthContext + CartContext */}
        <ApolloWrapper>
          <AgeVerification />
          <Navbar />
          <main style={{ minHeight: '100vh', paddingTop: 'var(--navbar-height, 68px)' }}>
            {children}
          </main>
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}

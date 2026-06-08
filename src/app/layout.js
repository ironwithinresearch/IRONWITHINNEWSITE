import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AgeVerification from "../components/AgeVerification";
import ApolloWrapper from "../lib/ApolloWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
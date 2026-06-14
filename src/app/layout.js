import "./globals.css";
import AnnouncementBar from "../components/AnnouncementBar";
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
          <AnnouncementBar />
          <Navbar />
          <main style={{ minHeight: '100vh', paddingTop: 'calc(var(--navbar-height, 68px) + 36px)' }}>
            {children}
          </main>
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}
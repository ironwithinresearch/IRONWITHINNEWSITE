import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: {
    default: "Darryl Peptides — Premium Research Peptides",
    template: "%s | Darryl Peptides",
  },
  description:
    "Premium quality research peptides trusted by researchers worldwide. Shop BPC-157, TB-500, Semaglutide, and more with fast shipping.",
  keywords: ["peptides", "research peptides", "BPC-157", "TB-500", "semaglutide"],
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
        <Navbar />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "KnottyVibes – Handmade with Love",
  description:
    "Shop handcrafted macrame, candles, jewellery, and more. Made slow, made meaningful.",
  metadataBase: new URL("https://knottyvibes.art"),
  openGraph: {
    title: "KnottyVibes",
    description: "Handcrafted with love. Shop unique handmade products.",
    url: "https://knottyvibes.art",
    siteName: "KnottyVibes",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

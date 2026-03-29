import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "KnottyVibes – Handmade with Love",
  description:
    "Shop handcrafted woolen jewellery, hair accessories, home decor and more. Made slow, made meaningful.",
  metadataBase: new URL("https://knottyvibes.art"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

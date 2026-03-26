"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=macrame", label: "Macrame" },
  { href: "/shop?category=candles", label: "Candles" },
  { href: "/shop?category=jewelry", label: "Jewellery" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl text-brown-dark tracking-wide">
          KnottyVibes
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-brown hover:text-terracotta transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Cart + mobile menu */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2">
            <ShoppingBag size={22} className="text-brown-dark" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-sand px-4 pb-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-brown hover:text-terracotta border-b border-sand/50 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

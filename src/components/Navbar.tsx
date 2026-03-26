"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=woolen-jewellery", label: "Jewellery" },
  { href: "/shop?category=hair-accessories", label: "Hair" },
  { href: "/shop?category=home-decor", label: "Home Decor" },
  { href: "/shop?category=keychains", label: "Keychains" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName = user?.user_metadata?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0];

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-display text-2xl text-brown-dark tracking-wide">
          KnottyVibes
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-brown hover:text-terracotta transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <ShoppingBag size={22} className="text-brown-dark" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-brown hover:text-terracotta transition-colors"
              >
                <User size={20} />
                <span className="hidden md:inline">{displayName}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-sand py-2 w-40 z-50">
                  <Link href="/account" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-brown hover:bg-sand/30 transition-colors">
                    <User size={15} /> My Account
                  </Link>
                  <button onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-brown hover:bg-sand/30 transition-colors w-full text-left">
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center gap-1.5 text-sm text-brown hover:text-terracotta transition-colors">
              <User size={20} /> Log In
            </Link>
          )}

          <button className="md:hidden p-2" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-sand px-4 pb-4">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className="block py-3 text-brown hover:text-terracotta border-b border-sand/50 last:border-0"
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/account" className="block py-3 text-brown border-b border-sand/50" onClick={() => setMenuOpen(false)}>My Account</Link>
              <button onClick={logout} className="block py-3 text-brown w-full text-left">Log Out</button>
            </>
          ) : (
            <Link href="/login" className="block py-3 text-brown" onClick={() => setMenuOpen(false)}>Log In / Sign Up</Link>
          )}
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brown-dark text-sand mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <Image src="/logo.svg" alt="KnottyVibes" width={160} height={44} className="mb-3 brightness-0 invert" />
          <p className="text-sm text-sand/70 leading-relaxed">
            Handcrafted with love. Every piece tells a story — made slow, made meaningful.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-medium text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-sand/70">
            {[
              { href: "/shop", label: "Shop All" },
              { href: "/about", label: "About Us" },
              { href: "/shipping", label: "Shipping & Returns" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-terracotta-light transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-medium text-white mb-3">Get in Touch</h4>
          <div className="space-y-2 text-sm text-sand/70">
            <a
              href="mailto:knottyvibes74@gmail.com"
              className="flex items-center gap-2 hover:text-terracotta-light transition-colors"
            >
              <Mail size={16} /> knottyvibes74@gmail.com
            </a>
            <a
              href="https://instagram.com/knottyvibes.art"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-terracotta-light transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              @knottyvibes.art
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-sand/10 text-center py-4 text-xs text-sand/40">
        © {new Date().getFullYear()} KnottyVibes. All rights reserved.
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact – KnottyVibes",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="section-title mb-3">Get in Touch</h1>
      <p className="text-brown/60 mb-10">
        Have a question, custom order request, or just want to say hi? We&apos;d love to hear from you.
      </p>

      <div className="space-y-4 mb-12">
        <a
          href="mailto:hello@knottyvibes.art"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center group-hover:bg-terracotta/20 transition-colors">
            <Mail size={22} className="text-terracotta" />
          </div>
          <div>
            <p className="font-medium text-brown-dark">Email Us</p>
            <p className="text-sm text-brown/60">hello@knottyvibes.art</p>
          </div>
        </a>

        <a
          href="https://instagram.com/knottyvibes.art"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center group-hover:bg-terracotta/20 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
          <div>
            <p className="font-medium text-brown-dark">Instagram</p>
            <p className="text-sm text-brown/60">@knottyvibes.art</p>
          </div>
        </a>
      </div>

      <div className="bg-sand/40 rounded-2xl p-6 text-sm text-brown/70 leading-relaxed">
        <p className="font-medium text-brown-dark mb-2">Custom Orders</p>
        <p>
          Looking for something specific — a particular colour, size, or a personalised piece?
          We love custom orders! Drop us an email with your idea and we&apos;ll get back to you
          within 24 hours.
        </p>
      </div>
    </div>
  );
}

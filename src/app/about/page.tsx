import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About – KnottyVibes",
  description: "The story behind KnottyVibes — handmade with love from India.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-sage text-sm uppercase tracking-widest font-medium mb-4 text-center">Our Story</p>
      <h1 className="font-display text-4xl md:text-5xl text-brown-dark text-center mb-12">
        Made with hands,<br />
        <span className="text-terracotta italic">made with heart.</span>
      </h1>

      <div className="prose prose-lg max-w-none space-y-6 text-brown/80 leading-relaxed">
        <p>
          KnottyVibes started as a small side project — a single macrame wall hanging gifted
          to a friend. The response was overwhelming. &quot;Where did you buy this?&quot; &quot;Can you make
          one for me?&quot; And just like that, a passion became a purpose.
        </p>
        <p>
          Every product at KnottyVibes is made by hand, one at a time. We don&apos;t mass produce.
          We don&apos;t rush. We believe that the best things in life take time — and that includes
          the things that fill your home with warmth.
        </p>
        <p>
          From macrame wall hangings to hand-poured soy candles, from woven plant hangers to
          handmade jewellery — each piece carries the energy of the person who made it.
          Slow, intentional, and full of love.
        </p>
        <p>
          We source natural materials where possible, use minimal packaging, and ship every
          order with a handwritten note — because you deserve to feel that care the moment
          you open the box.
        </p>
      </div>

      <div className="mt-16 text-center">
        <Link href="/shop" className="btn-primary text-base px-10">
          Shop the Collection
        </Link>
      </div>
    </div>
  );
}

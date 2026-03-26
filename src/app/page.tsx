import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/database";

const CATEGORIES = [
  { name: "Macrame", slug: "macrame", emoji: "🪢", desc: "Wall hangings, plant hangers & more" },
  { name: "Candles", slug: "candles", emoji: "🕯️", desc: "Hand-poured soy & beeswax candles" },
  { name: "Jewellery", slug: "jewelry", emoji: "🌿", desc: "Earrings, necklaces & bangles" },
  { name: "Home Decor", slug: "home-decor", emoji: "🏡", desc: "Unique pieces for every corner" },
];

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(8);
  return data ?? [];
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sand via-cream to-cream overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-36 flex flex-col items-center text-center">
          <p className="text-sage text-sm uppercase tracking-widest font-medium mb-4">
            Handcrafted in India
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-brown-dark leading-tight mb-6 max-w-3xl">
            Made slow,<br />
            <span className="text-terracotta italic">made meaningful.</span>
          </h1>
          <p className="text-brown/70 text-lg max-w-xl mb-10 leading-relaxed">
            Every piece is crafted by hand with care, intention, and love. No factories,
            no shortcuts — just pure handmade magic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="btn-primary text-base px-8 py-4">
              Shop All Products
            </Link>
            <Link href="/about" className="btn-outline text-base px-8 py-4">
              Our Story
            </Link>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-terracotta/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-sage/10 blur-3xl" />
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="section-title text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-display text-lg text-brown-dark group-hover:text-terracotta transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-brown/60 mt-1 leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10 pb-20">
          <div className="flex items-end justify-between mb-10">
            <h2 className="section-title">Featured Picks</h2>
            <Link href="/shop" className="text-terracotta text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="bg-sand/40 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: "🤲", title: "100% Handmade", desc: "Every item crafted by hand, one at a time" },
            { icon: "🌱", title: "Eco-Friendly", desc: "Natural materials, mindful packaging" },
            { icon: "🚚", title: "Ships Across India", desc: "Free shipping on orders above ₹999" },
          ].map((v) => (
            <div key={v.title}>
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-display text-xl text-brown-dark mb-2">{v.title}</h3>
              <p className="text-sm text-brown/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

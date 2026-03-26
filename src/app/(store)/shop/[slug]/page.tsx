import { notFound } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";
import type { Metadata } from "next";
import type { Product } from "@/types/database";

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} – KnottyVibes`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand/30">
            <Image
              src={product.images[0] ?? "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-terracotta text-white text-sm font-medium px-3 py-1 rounded-full">
                {discountPct}% off
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-sand/30">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-sage text-sm uppercase tracking-wider font-medium mb-2">
            {product.category}
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-brown-dark mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold text-brown-dark">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-brown/40 line-through">
                  ₹{product.compare_price!.toLocaleString("en-IN")}
                </span>
                <span className="bg-terracotta/10 text-terracotta text-sm px-2 py-0.5 rounded-full font-medium">
                  Save {discountPct}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <p className={`text-sm mb-6 font-medium ${product.stock > 0 ? "text-sage" : "text-red-500"}`}>
            {product.stock > 0
              ? product.stock < 5
                ? `Only ${product.stock} left!`
                : "In Stock"
              : "Out of Stock"}
          </p>

          {/* Description */}
          <p className="text-brown/70 leading-relaxed mb-8 whitespace-pre-line">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs border border-sand text-brown/60 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <AddToCartButton product={product} />

          {/* Shipping note */}
          <p className="text-xs text-brown/50 mt-4 text-center">
            🚚 Free shipping on orders above ₹999 · Ships within 3–5 business days
          </p>
        </div>
      </div>
    </div>
  );
}

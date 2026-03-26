"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/database";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const image = product.images[0] ?? "/placeholder.jpg";
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-terracotta text-white text-xs font-medium px-2 py-1 rounded-full">
            {discountPct}% off
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-white text-brown-dark text-sm font-medium px-4 py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="p-4">
        <p className="text-xs text-sage uppercase tracking-wider mb-1">{product.category}</p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-display text-base text-brown-dark leading-snug hover:text-terracotta transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-brown-dark">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="text-sm text-brown/50 line-through">
              ₹{product.compare_price!.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <button
          onClick={() => product.stock > 0 && addItem(product)}
          disabled={product.stock === 0}
          className="mt-3 w-full flex items-center justify-center gap-2 btn-primary text-sm py-2"
        >
          <ShoppingBag size={16} />
          {product.stock === 0 ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

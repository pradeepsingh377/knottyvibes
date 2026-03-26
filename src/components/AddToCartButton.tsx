"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/database";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-3">
      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-brown/70">Quantity</span>
        <div className="flex items-center border border-sand rounded-full overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-brown hover:bg-sand/50 transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="w-9 h-9 flex items-center justify-center text-brown hover:bg-sand/50 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium transition-all duration-300 ${
          added
            ? "bg-sage text-white"
            : product.stock === 0
            ? "bg-brown/20 text-brown/40 cursor-not-allowed"
            : "bg-terracotta text-white hover:bg-terracotta-dark"
        }`}
      >
        {added ? <Check size={18} /> : <ShoppingBag size={18} />}
        {added ? "Added to Cart!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalPrice, totalItems, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={56} className="mx-auto text-sand mb-6" />
        <h1 className="font-display text-3xl text-brown-dark mb-3">Your cart is empty</h1>
        <p className="text-brown/60 mb-8">Add some handmade magic to your cart.</p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title mb-8">
        Your Cart <span className="text-brown/40 text-2xl font-sans font-normal">({totalItems})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm">
              <Link href={`/shop/${product.slug}`} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-sand/30">
                <Image
                  src={product.images[0] ?? "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="font-display text-brown-dark text-sm leading-snug hover:text-terracotta transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-sage capitalize mt-0.5">{product.category}</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty */}
                  <div className="flex items-center border border-sand rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 text-sm flex items-center justify-center hover:bg-sand/50 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 text-sm flex items-center justify-center hover:bg-sand/50 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brown-dark text-sm">
                      ₹{(product.price * quantity).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-brown/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-display text-xl text-brown-dark mb-6">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-brown/70">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-brown/70">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-sage font-medium" : ""}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-brown/50">Add ₹{(999 - totalPrice).toLocaleString("en-IN")} more for free shipping</p>
            )}
            <div className="border-t border-sand pt-3 flex justify-between font-semibold text-brown-dark text-base">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary w-full text-center block mt-6">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="text-center text-sm text-terracotta hover:underline block mt-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

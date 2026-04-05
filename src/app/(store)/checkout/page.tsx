"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { ShippingAddress } from "@/types/database";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir",
  "Ladakh","Puducherry","Chandigarh",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [shippingFee, setShippingFee] = useState(99);
  const [freeThreshold, setFreeThreshold] = useState(999);

  // Fetch shipping settings
  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((s) => {
      setShippingFee(s.shipping_fee);
      setFreeThreshold(s.free_shipping_threshold);
    });
  }, []);

  // Pre-fill from saved profile
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles").select("*").eq("id", data.user.id).single();
      setForm((f) => ({
        ...f,
        name: profile?.full_name ?? data.user.user_metadata?.full_name ?? f.name,
        email: data.user.email ?? f.email,
        phone: profile?.phone ?? f.phone,
        line1: profile?.address_line1 ?? f.line1,
        line2: profile?.address_line2 ?? f.line2,
        city: profile?.city ?? f.city,
        state: profile?.state ?? f.state,
        pincode: profile?.pincode ?? f.pincode,
      }));
    });
  }, []);

  const shipping = totalPrice >= freeThreshold ? 0 : shippingFee;
  const grandTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-2xl text-brown-dark mb-4">Nothing to checkout</p>
        <Link href="/shop" className="btn-primary">Go Shopping</Link>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Auto-save address to profile if logged in (non-blocking)
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: form.name,
            phone: form.phone,
            address_line1: form.line1,
            address_line2: form.line2 || null,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            updated_at: new Date().toISOString(),
          }, { onConflict: "id" });
        }
      });

      const orderItems = items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0] ?? "",
      }));

      const shippingAddress: ShippingAddress = {
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          customer: { name: form.name, email: form.email, phone: form.phone },
          shipping_address: shippingAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Load Razorpay script
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "KnottyVibes",
        description: "Handmade with love",
        order_id: data.order_id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#C4704F" },
        handler: async (response: RazorpayResponse) => {
          const verify = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          if (verify.ok) {
            clearCart();
            router.push(`/order-confirmed?order_id=${data.order_id}`);
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-xl text-brown-dark mb-5">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} required />
              <InputField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required pattern="[6-9][0-9]{9}" placeholder="10-digit mobile number" />
            </div>
            <div className="mt-4">
              <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-xl text-brown-dark mb-5">Shipping Address</h2>
            <div className="space-y-4">
              <InputField label="Address Line 1" name="line1" value={form.line1} onChange={handleChange} required placeholder="House no., Street" />
              <InputField label="Address Line 2 (optional)" name="line2" value={form.line2} onChange={handleChange} placeholder="Landmark, Apartment" />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="City" name="city" value={form.city} onChange={handleChange} required />
                <div>
                  <label className="block text-sm text-brown/70 mb-1.5">State</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm text-brown-dark focus:outline-none focus:border-terracotta"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <InputField label="PIN Code" name="pincode" value={form.pincode} onChange={handleChange} required pattern="[1-9][0-9]{5}" placeholder="6-digit PIN code" />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-display text-xl text-brown-dark mb-5">Order Summary</h2>

          <div className="space-y-2 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm text-brown/70">
                <span className="line-clamp-1 flex-1 mr-2">{product.name} × {quantity}</span>
                <span className="flex-shrink-0">₹{(product.price * quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-sand pt-3 space-y-2 text-sm">
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
            <div className="flex justify-between font-semibold text-brown-dark text-base pt-2 border-t border-sand">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 text-center"
          >
            {loading ? "Processing..." : `Pay ₹${grandTotal.toLocaleString("en-IN")}`}
          </button>

          <p className="text-xs text-brown/40 text-center mt-3">
            Secured by Razorpay · UPI, Cards, NetBanking
          </p>
        </div>
      </form>
    </div>
  );
}

function InputField({
  label, name, type = "text", value, onChange, required, pattern, placeholder,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; pattern?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-brown/70 mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} pattern={pattern} placeholder={placeholder}
        className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm text-brown-dark placeholder:text-brown/30 focus:outline-none focus:border-terracotta"
      />
    </div>
  );
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

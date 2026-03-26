"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

type Order = {
  id: string;
  razorpay_order_id: string;
  status: string;
  amount: number;
  items: { name: string; quantity: number; price: number }[];
  created_at: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      // Fetch orders for this user's email
      supabase
        .from("orders")
        .select("*")
        .eq("customer_email", data.user.email)
        .order("created_at", { ascending: false })
        .then(({ data: orders }) => { setOrders(orders ?? []); setLoading(false); });
    });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-brown/50">Loading...</div>;

  const name = user?.user_metadata?.full_name ?? user?.email?.split("@")[0];
  const totalSpent = orders.filter(o => o.status === "paid").reduce((s, o) => s + Number(o.amount), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-brown-dark">Hi, {name} 👋</h1>
          <p className="text-sm text-brown/50 mt-1">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-brown/50 hover:text-terracotta transition-colors border border-sand px-4 py-2 rounded-xl">
          Log Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-brown/50 mb-1">Total Orders</p>
          <p className="font-display text-3xl text-brown-dark">{orders.filter(o => o.status === "paid").length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-brown/50 mb-1">Total Spent</p>
          <p className="font-display text-3xl text-terracotta">₹{totalSpent.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Orders */}
      <h2 className="font-display text-xl text-brown-dark mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-brown/40 shadow-sm">
          <p className="text-4xl mb-3">🛍️</p>
          <p>No orders yet</p>
          <a href="/shop" className="text-terracotta text-sm hover:underline mt-2 inline-block">Start shopping →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-brown/40 font-mono">{order.razorpay_order_id}</p>
                  <p className="text-xs text-brown/50 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    order.status === "paid" ? "bg-green-100 text-green-700" :
                    order.status === "failed" ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{order.status}</span>
                  <span className="font-semibold text-brown-dark">₹{Number(order.amount).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="border-t border-sand pt-3 space-y-1">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-brown/70">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

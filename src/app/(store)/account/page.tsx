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

type Profile = {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY_PROFILE: Profile = {
  full_name: "", phone: "", address_line1: "",
  address_line2: "", city: "", state: "", pincode: "",
};

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli","Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "address">("orders");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);

      const [{ data: orders, error: ordersError }, { data: profileData }] = await Promise.all([
        supabase.from("orders").select("*").eq("customer_email", data.user.email).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", data.user.id).single(),
      ]);

      if (ordersError) console.error("Orders fetch error:", ordersError);
      console.log("User email:", data.user.email, "Orders:", orders);
      setOrders(orders ?? []);
      if (profileData) {
        setProfile({
          full_name: profileData.full_name ?? data.user.user_metadata?.full_name ?? "",
          phone: profileData.phone ?? "",
          address_line1: profileData.address_line1 ?? "",
          address_line2: profileData.address_line2 ?? "",
          city: profileData.city ?? "",
          state: profileData.state ?? "",
          pincode: profileData.pincode ?? "",
        });
      } else {
        setProfile((p) => ({ ...p, full_name: data.user.user_metadata?.full_name ?? "" }));
      }
      setLoading(false);
    });
  }, [router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.from("profiles").upsert({ id: user!.id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-brown/50">Loading...</div>;

  const name = profile.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0];
  const paidOrders = orders.filter(o => o.status === "paid");
  const totalSpent = paidOrders.reduce((s, o) => s + Number(o.amount), 0);

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
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-brown/50 mb-1">Total Orders</p>
          <p className="font-display text-3xl text-brown-dark">{paidOrders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-brown/50 mb-1">Total Spent</p>
          <p className="font-display text-3xl text-terracotta">₹{totalSpent.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["orders", "address"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-terracotta text-white" : "bg-white text-brown border border-sand hover:border-terracotta"}`}>
            {tab === "orders" ? "My Orders" : "Saved Address"}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        orders.length === 0 ? (
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
        )
      )}

      {/* Address Tab */}
      {activeTab === "address" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-lg text-brown-dark mb-1">Shipping Address</h2>
          <p className="text-sm text-brown/50 mb-6">Saved and auto-filled at checkout</p>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-brown/70 mb-1.5">Full Name</label>
                <input type="text" value={profile.full_name}
                  onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                  className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                  placeholder="As on ID" />
              </div>
              <div>
                <label className="block text-sm text-brown/70 mb-1.5">Phone Number</label>
                <input type="tel" value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                  placeholder="10-digit mobile number" maxLength={10} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-brown/70 mb-1.5">Address Line 1</label>
              <input type="text" value={profile.address_line1}
                onChange={(e) => setProfile((p) => ({ ...p, address_line1: e.target.value }))}
                className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                placeholder="House/Flat no., Building, Street" />
            </div>
            <div>
              <label className="block text-sm text-brown/70 mb-1.5">Address Line 2 <span className="text-brown/30">(optional)</span></label>
              <input type="text" value={profile.address_line2}
                onChange={(e) => setProfile((p) => ({ ...p, address_line2: e.target.value }))}
                className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                placeholder="Area, Landmark" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-brown/70 mb-1.5">City</label>
                <input type="text" value={profile.city}
                  onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                  className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                  placeholder="City" />
              </div>
              <div>
                <label className="block text-sm text-brown/70 mb-1.5">State</label>
                <select value={profile.state}
                  onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
                  className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta bg-white">
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-brown/70 mb-1.5">Pincode</label>
                <input type="text" value={profile.pincode}
                  onChange={(e) => setProfile((p) => ({ ...p, pincode: e.target.value }))}
                  className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                  placeholder="6-digit pincode" maxLength={6} />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Address"}
              </button>
              {saved && <span className="text-green-600 text-sm">✓ Address saved!</span>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

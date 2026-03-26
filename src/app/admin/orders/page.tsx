"use client";

import { useEffect, useState } from "react";
import type { OrderItem } from "@/types/database";

type FullOrder = {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  status: string;
  fulfillment_status: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: { line1: string; line2?: string; city: string; state: string; pincode: string };
  items: OrderItem[];
  tracking_id: string | null;
  tracking_url: string | null;
  admin_notes: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
};

const PAYMENT_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  created: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-600",
};

const FULFILLMENT_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const FULFILLMENT_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ fulfillment_status: string; tracking_id: string; tracking_url: string; admin_notes: string }>({
    fulfillment_status: "", tracking_id: "", tracking_url: "", admin_notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then((d) => { setOrders(d); setLoading(false); });
  }, []);

  function startEdit(order: FullOrder) {
    setEditing(order.id);
    setEditData({
      fulfillment_status: order.fulfillment_status ?? "pending",
      tracking_id: order.tracking_id ?? "",
      tracking_url: order.tracking_url ?? "",
      admin_notes: order.admin_notes ?? "",
    });
    setExpanded(order.id);
  }

  async function saveEdit(orderId: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, ...updated } : o));
    }
    setSaving(false);
    setEditing(null);
  }

  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((sum, o) => sum + Number(o.amount), 0);
  const today = new Date().toDateString();
  const todayRevenue = paid.filter((o) => new Date(o.created_at).toDateString() === today).reduce((sum, o) => sum + Number(o.amount), 0);
  const pendingShipment = orders.filter((o) => o.status === "paid" && o.fulfillment_status === "processing").length;

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.razorpay_order_id.toLowerCase().includes(search.toLowerCase()) ||
      (o.tracking_id ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.fulfillment_status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-brown-dark mb-6">Orders & Fulfillment</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, color: "text-terracotta" },
          { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString("en-IN")}`, color: "text-green-600" },
          { label: "Total Orders", value: orders.length, color: "text-brown-dark" },
          { label: "Paid Orders", value: paid.length, color: "text-blue-600" },
          { label: "Pending Dispatch", value: pendingShipment, color: "text-orange-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-brown/50 mb-1">{s.label}</p>
            <p className={`font-display text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" placeholder="Search by name, email, order ID, tracking..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-sand rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-terracotta w-72" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-sand rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-terracotta bg-white">
          <option value="all">All Statuses</option>
          {FULFILLMENT_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? <p className="text-brown/50">Loading...</p> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Order</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Payment</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Fulfillment</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Tracking</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <>
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-brown/60">
                      #{order.razorpay_order_id.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brown-dark">{order.customer_name}</p>
                      <p className="text-xs text-brown/50">{order.customer_phone}</p>
                      <p className="text-xs text-brown/40">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brown-dark">
                      ₹{Number(order.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STYLES[order.status] ?? ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${FULFILLMENT_STYLES[order.fulfillment_status] ?? ""}`}>
                        {order.fulfillment_status ?? "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-brown/60">
                      {order.tracking_id ? (
                        <span className="font-mono">{order.tracking_id}</span>
                      ) : <span className="text-brown/30">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-brown/60">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(order)}
                          className="text-xs bg-terracotta text-white px-2.5 py-1 rounded-lg hover:bg-terracotta/90 transition-colors">
                          Update
                        </button>
                        <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                          className="text-xs text-brown/50 hover:text-brown px-2 py-1">
                          {expanded === order.id ? "▲" : "▼"}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expanded === order.id && (
                    <tr key={`${order.id}-expanded`}>
                      <td colSpan={8} className="px-4 pb-4 bg-amber-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                          {/* Order items */}
                          <div>
                            <p className="text-xs font-semibold text-brown/60 mb-2 uppercase tracking-wide">Items</p>
                            <div className="space-y-1">
                              {(order.items as OrderItem[]).map((item, i) => (
                                <div key={i} className="flex justify-between text-xs text-brown/70">
                                  <span>{item.name} × {item.quantity}</span>
                                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 mt-2 border-t border-sand text-xs text-brown/50">
                              📍 {order.shipping_address.line1}{order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}, {order.shipping_address.city}, {order.shipping_address.state} – {order.shipping_address.pincode}
                            </div>
                            {order.shipped_at && <p className="text-xs text-purple-600 mt-1">📦 Shipped: {new Date(order.shipped_at).toLocaleDateString("en-IN")}</p>}
                            {order.delivered_at && <p className="text-xs text-green-600 mt-1">✅ Delivered: {new Date(order.delivered_at).toLocaleDateString("en-IN")}</p>}
                          </div>

                          {/* Edit form */}
                          {editing === order.id && (
                            <div className="space-y-3">
                              <p className="text-xs font-semibold text-brown/60 uppercase tracking-wide">Update Order</p>
                              <div>
                                <label className="text-xs text-brown/60 mb-1 block">Fulfillment Status</label>
                                <select value={editData.fulfillment_status}
                                  onChange={(e) => setEditData((d) => ({ ...d, fulfillment_status: e.target.value }))}
                                  className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terracotta bg-white">
                                  {FULFILLMENT_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-brown/60 mb-1 block">Tracking ID</label>
                                <input type="text" value={editData.tracking_id}
                                  onChange={(e) => setEditData((d) => ({ ...d, tracking_id: e.target.value }))}
                                  placeholder="e.g. DTDC1234567890"
                                  className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terracotta" />
                              </div>
                              <div>
                                <label className="text-xs text-brown/60 mb-1 block">Tracking URL <span className="text-brown/30">(optional)</span></label>
                                <input type="url" value={editData.tracking_url}
                                  onChange={(e) => setEditData((d) => ({ ...d, tracking_url: e.target.value }))}
                                  placeholder="https://tracking.dtdc.com/..."
                                  className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terracotta" />
                              </div>
                              <div>
                                <label className="text-xs text-brown/60 mb-1 block">Admin Notes <span className="text-brown/30">(internal)</span></label>
                                <textarea value={editData.admin_notes}
                                  onChange={(e) => setEditData((d) => ({ ...d, admin_notes: e.target.value }))}
                                  rows={2} placeholder="e.g. Packed and ready, special wrapping done"
                                  className="w-full border border-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terracotta resize-none" />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit(order.id)} disabled={saving}
                                  className="bg-terracotta text-white text-xs px-4 py-2 rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50">
                                  {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button onClick={() => setEditing(null)}
                                  className="text-xs text-brown/50 px-3 py-2 rounded-lg border border-sand hover:border-brown/30">
                                  Cancel
                                </button>
                              </div>
                              {editData.fulfillment_status === "shipped" && (
                                <p className="text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                                  📧 Shipping notification email will be sent to {order.customer_email}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-12 text-brown/40">No orders found</p>}
        </div>
      )}
    </div>
  );
}

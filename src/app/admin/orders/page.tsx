"use client";

import { useEffect, useState } from "react";
import type { Order, OrderItem } from "@/types/database";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  created: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d); setLoading(false); });
  }, []);

  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((sum, o) => sum + Number(o.amount), 0);
  const today = new Date().toDateString();
  const todayRevenue = paid
    .filter((o) => new Date(o.created_at).toDateString() === today)
    .reduce((sum, o) => sum + Number(o.amount), 0);

  return (
    <div>
      <h1 className="font-display text-2xl text-brown-dark mb-6">Orders & Revenue</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, color: "text-terracotta" },
          { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString("en-IN")}`, color: "text-sage" },
          { label: "Total Orders", value: orders.length, color: "text-brown-dark" },
          { label: "Paid Orders", value: paid.length, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-brown/50 mb-1">{s.label}</p>
            <p className={`font-display text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      {loading ? <p className="text-brown/50">Loading...</p> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Order</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <>
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-brown/60">
                      {order.razorpay_order_id.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brown-dark">{order.customer_name}</p>
                      <p className="text-xs text-brown/50">{order.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brown-dark">
                      ₹{Number(order.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] ?? ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brown/60">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                        className="text-xs text-terracotta hover:underline"
                      >
                        {expanded === order.id ? "Hide" : `${(order.items as OrderItem[]).length} item(s)`}
                      </button>
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr key={`${order.id}-expanded`}>
                      <td colSpan={6} className="px-4 pb-4 bg-gray-50/50">
                        <div className="space-y-2 pt-2">
                          {(order.items as OrderItem[]).map((item, i) => (
                            <div key={i} className="flex justify-between text-xs text-brown/70">
                              <span>{item.name} × {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-100 text-xs text-brown/50">
                            📍 {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state} – {order.shipping_address.pincode}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-12 text-brown/40">No orders yet</p>}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: string; email: string; name: string;
  created_at: string; last_sign_in: string;
  confirmed: boolean; orders: number; spent: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then((d) => { setUsers(d); setLoading(false); });
  }, []);

  const filtered = users.filter(
    (u) => u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpend = users.reduce((s, u) => s + u.spent, 0);
  const buyersCount = users.filter((u) => u.orders > 0).length;

  return (
    <div>
      <h1 className="font-display text-2xl text-brown-dark mb-6">Customers</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: users.length },
          { label: "Confirmed", value: users.filter((u) => u.confirmed).length },
          { label: "Have Ordered", value: buyersCount },
          { label: "Total Spend", value: `₹${totalSpend.toLocaleString("en-IN")}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-brown/50 mb-1">{s.label}</p>
            <p className="font-display text-2xl font-semibold text-brown-dark">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="border border-sand rounded-xl px-4 py-2.5 text-sm w-full max-w-sm focus:outline-none focus:border-terracotta"
        />
      </div>

      {loading ? <p className="text-brown/50">Loading...</p> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Joined</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Last Login</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Orders</th>
                <th className="text-left px-4 py-3 text-brown/60 font-medium">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-brown-dark">{u.name}</p>
                    <p className="text-xs text-brown/50">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-brown/60 text-xs">
                    {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-brown/60 text-xs">
                    {u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.confirmed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {u.confirmed ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brown-dark font-medium">{u.orders}</td>
                  <td className="px-4 py-3 text-terracotta font-semibold">
                    {u.spent > 0 ? `₹${u.spent.toLocaleString("en-IN")}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-12 text-brown/40">No customers yet</p>}
        </div>
      )}
    </div>
  );
}

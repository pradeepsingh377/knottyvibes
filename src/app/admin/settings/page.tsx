"use client";

import { useEffect, useState } from "react";

type Setting = { key: string; value: string; label: string; updated_at: string };

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((data) => {
      setSettings(data);
      setValues(Object.fromEntries(data.map((s: Setting) => [s.key, s.value])));
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const updates = Object.entries(values).map(([key, value]) => ({ key, value }));
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const shippingFee = Number(values.shipping_fee ?? 99);
  const threshold = Number(values.free_shipping_threshold ?? 999);

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-brown-dark mb-2">Settings</h1>
      <p className="text-sm text-brown/50 mb-8">Configure shipping and store preferences</p>

      {loading ? <p className="text-brown/50">Loading...</p> : (
        <form onSubmit={handleSave} className="space-y-6">

          {/* Shipping */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-lg text-brown-dark mb-1">Shipping</h2>
            <p className="text-xs text-brown/40 mb-5">Applied at checkout and order creation</p>

            <div className="space-y-4">
              {settings.map((s) => (
                <div key={s.key}>
                  <label className="block text-sm text-brown/70 mb-1.5">{s.label}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-brown/50 text-sm">₹</span>
                    <input
                      type="number" min="0" value={values[s.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                      className="w-40 border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                    />
                  </div>
                  <p className="text-xs text-brown/40 mt-1">
                    Last updated: {new Date(s.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
            <p className="font-medium mb-1">Preview</p>
            <p>Orders below ₹{threshold.toLocaleString("en-IN")} → shipping fee: <strong>₹{shippingFee}</strong></p>
            <p>Orders ₹{threshold.toLocaleString("en-IN")} and above → shipping: <strong>FREE</strong></p>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Settings"}
            </button>
            {saved && <span className="text-green-600 text-sm">✓ Saved!</span>}
          </div>
        </form>
      )}
    </div>
  );
}

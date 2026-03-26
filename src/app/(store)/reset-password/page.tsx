"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/login?reset=success");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl text-brown-dark mb-1">Set New Password</h1>
        <p className="text-sm text-brown/50 mb-6">Choose a strong password</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-brown/70 mb-1.5">New Password</label>
            <input type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
              placeholder="Min. 6 characters" />
          </div>
          <div>
            <label className="block text-sm text-brown/70 mb-1.5">Confirm Password</label>
            <input type="password" required value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
              placeholder="Repeat password" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

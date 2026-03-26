"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(form);

    if (error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl text-brown-dark mb-1">Welcome Back</h1>
        <p className="text-sm text-brown/50 mb-6">Log in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-brown/70 mb-1.5">Email</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-brown/70 mb-1.5">Password</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-brown/50 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-terracotta hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

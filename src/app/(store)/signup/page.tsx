"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // Sign in immediately after signup
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl text-brown-dark mb-1">Create Account</h1>
        <p className="text-sm text-brown/50 mb-6">Join the KnottyVibes family</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-brown/70 mb-1.5">Full Name</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
              placeholder="Your name"
            />
          </div>
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
              type="password" required minLength={6} value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
              placeholder="Min. 6 characters"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-brown/50 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-terracotta hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

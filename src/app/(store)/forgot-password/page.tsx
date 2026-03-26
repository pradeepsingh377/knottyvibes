"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        {sent ? (
          <div className="text-center">
            <p className="text-4xl mb-4">📬</p>
            <h1 className="font-display text-2xl text-brown-dark mb-2">Check your email</h1>
            <p className="text-sm text-brown/60 mb-6">We&apos;ve sent a password reset link to <strong>{email}</strong></p>
            <Link href="/login" className="text-terracotta text-sm hover:underline">← Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl text-brown-dark mb-1">Forgot Password?</h1>
            <p className="text-sm text-brown/50 mb-6">Enter your email and we&apos;ll send you a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-brown/70 mb-1.5">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                  placeholder="you@example.com" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <p className="text-center text-sm text-brown/50 mt-6">
              <Link href="/login" className="text-terracotta hover:underline">← Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

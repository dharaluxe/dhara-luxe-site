"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
    if (!error) window.location.href = "/account";
  }

  return (
    <section className="container-luxe py-16 md:py-24 max-w-md">
      <h1 className="font-serif text-4xl mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input
          type="email"
          placeholder="Email"
          className="rounded-xl px-4 py-3 border border-black/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded-xl px-4 py-3 border border-black/10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading} type="submit">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-sm text-muted mt-4">
        Don’t have an account? <Link className="underline" href="/register">Create one</Link>
      </p>
    </section>
  );
}

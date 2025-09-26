"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setOtpSent(true);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error || !data?.user) {
      setError(error?.message || "Invalid code");
      return;
    }

    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.user.id,
          name,
          phone,
          whatsapp_opt_in: whatsapp,
        }),
      });
    } catch {}

    window.location.href = "/account";
  }

  return (
    <section className="container-luxe py-16 md:py-24 max-w-md">
      <h1 className="font-serif text-4xl mb-6">Create account</h1>
      {!otpSent ? (
        <form onSubmit={sendOtp} className="grid gap-4">
          <input
            placeholder="Name"
            className="rounded-xl px-4 py-3 border border-black/10"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="rounded-xl px-4 py-3 border border-black/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Mobile number"
            className="rounded-xl px-4 py-3 border border-black/10"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)} />
            Receive WhatsApp updates
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Sending…" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="grid gap-4">
          <p className="text-sm">We’ve sent a 6-digit code to {email}. Enter it below to verify.</p>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter OTP"
            className="rounded-xl px-4 py-3 border border-black/10 tracking-widest text-center"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Verifying…" : "Verify & Continue"}
          </button>
          <button className="btn btn-ghost w-full" type="button" onClick={() => setOtpSent(false)}>Edit details</button>
        </form>
      )}
      <p className="text-sm text-muted mt-4">
        Already have an account? <Link className="underline" href="/login">Sign in</Link>
      </p>
    </section>
  );
}

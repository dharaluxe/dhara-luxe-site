"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok && !data.ok) throw new Error(data.error || "Failed");
      setStatus("success");
      setMessage(data.duplicate ? "You're already on the list. We'll be in touch." : "Thank you! You're on the list.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="flex gap-3" onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 rounded-full px-5 py-3 text-foreground placeholder:text-foreground/60"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button className="btn bg-accent text-accent-foreground hover:opacity-90" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Please wait…" : "Join"}
      </button>
      {message && (
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-brand-contrast"} md:ml-4 self-center`}>{message}</p>
      )}
    </form>
  );
}

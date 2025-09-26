"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DevSeedPage() {
  const [log, setLog] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function call(endpoint: string) {
    setBusy(true);
    setLog("");
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const text = await res.text();
      setLog(`${res.status} ${res.statusText}\n${text}`);
    } catch (e: any) {
      setLog(`Request failed: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  const isProd = process.env.NODE_ENV === "production";

  return (
    <section className="container-luxe py-10 md:py-16">
      <h1 className="font-serif text-3xl mb-2">Developer Seeds</h1>
      <p className="text-sm text-muted mb-6">Run development-only seed actions.</p>
      {isProd && (
        <p className="text-sm text-red-600 mb-4">Disabled in production.</p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => call("/api/seed")} disabled={busy || isProd}>
          Seed Products
        </Button>
        <Button variant="accent" onClick={() => call("/api/seed-admin")} disabled={busy || isProd}>
          Create Admin User
        </Button>
      </div>
      <pre className="mt-6 p-4 rounded-xl bg-white/70 border border-black/10 text-xs whitespace-pre-wrap">
        {log || "Logs will appear here…"}
      </pre>
      <p className="text-xs text-muted mt-4">
        Note: These routes use your Supabase credentials from <code>.env.local</code>.
      </p>
    </section>
  );
}

"use client";

import { useState } from "react";

export default function OrderStatusForm({ id, initial }: { id: string; initial: string }) {
  const [status, setStatus] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function update() {
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update status");
      setSaved("Updated");
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <select className="rounded-xl px-4 py-3 border border-black/10 w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {saved && <p className="text-sm text-emerald-700 mt-2">{saved}</p>}
      <button className="btn btn-primary mt-3" disabled={saving} onClick={update}>{saving ? "Saving…" : "Update Status"}</button>
    </div>
  );
}

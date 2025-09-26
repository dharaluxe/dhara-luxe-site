"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function OrdersTable({ items }: { items: any[] }) {
  const [status, setStatus] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const filtered = useMemo(() => {
    return (items || []).filter((o) => {
      if (status && o.status !== status) return false;
      const ts = new Date(o.created_at).getTime();
      if (from) {
        const f = new Date(from + "T00:00:00").getTime();
        if (ts < f) return false;
      }
      if (to) {
        const t = new Date(to + "T23:59:59").getTime();
        if (ts > t) return false;
      }
      return true;
    });
  }, [items, status, from, to]);

  return (
    <div className="grid gap-3">
      <div className="card p-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="text-sm">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl px-3 py-2 border border-black/10 w-full">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="text-sm">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-xl px-3 py-2 border border-black/10 w-full" />
        </div>
        <div>
          <label className="text-sm">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-xl px-3 py-2 border border-black/10 w-full" />
        </div>
        <div>
          <button className="btn btn-ghost w-full" onClick={() => { setStatus(""); setFrom(""); setTo(""); }}>Clear</button>
        </div>
      </div>

      <div className="overflow-x-auto card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-[color:var(--surface-border)]">
                <td className="px-4 py-3">
                  <Link href={`/orders/${o.id}`} className="underline">
                    {o.id}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3">{Array.isArray(o.items) ? o.items.length : 0}</td>
                <td className="px-4 py-3">{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={4}>No orders match filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

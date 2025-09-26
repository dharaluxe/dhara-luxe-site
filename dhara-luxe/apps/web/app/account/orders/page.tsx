"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function calcTotal(items: any[]): number {
  try {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);
  } catch {
    return 0;
  }
}

export default function AccountOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id;
      if (!uid) {
        window.location.href = "/login?next=/account/orders";
        return;
      }
      try {
        const { data: list, error } = await supabase
          .from("orders")
          .select("id,items,status,created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setOrders(list || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) return <p>Loading…</p>;

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-medium">Orders</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-muted">You have no orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => {
            const total = calcTotal(o.items || []);
            return (
              <a key={o.id} href={`/account/orders/${o.id}`} className="card p-4 block hover:opacity-90">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Order #{o.id.slice(0, 8)}</span>
                    <span className="capitalize">{o.status}</span>
                  </div>
                  <span>{new Date(o.created_at).toLocaleString()}</span>
                </div>
                <div className="mt-3 text-sm flex items-center justify-between">
                  <span>{Array.isArray(o.items) ? o.items.length : 0} item(s)</span>
                  <span>₹{fmt.format(total)}</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

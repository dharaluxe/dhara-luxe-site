"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Address = {
  id?: string;
  label?: string; // e.g. Home, Office
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default?: boolean;
};

const emptyAddress: Address = {
  label: "Home",
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  is_default: false,
};

export default function AccountAddressesPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id;
      if (!uid) {
        window.location.href = "/login?next=/account/addresses";
        return;
      }
      try {
        const res = await fetch(`/api/addresses?id=${uid}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load addresses");
        setItems(json.items || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load addresses");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function saveAddress(addr: Address) {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user?.id!;
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: uid, address: addr }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to save address");
    setItems(json.items || []);
  }

  async function deleteAddress(address_id: string) {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user?.id!;
    const res = await fetch("/api/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: uid, address_id }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to delete address");
    setItems(json.items || []);
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Addresses</h1>
        <button className="btn btn-primary" onClick={() => setEditing({ ...emptyAddress })}>Add address</button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {items.length === 0 ? (
        <p className="text-muted">You have not saved any addresses yet.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {a.label || "Address"}
                    {a.is_default && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700 text-white">Default</span>}
                  </p>
                  <p className="text-sm text-muted">{a.full_name} · {a.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost" onClick={() => setEditing(a)}>Edit</button>
                  {!a.is_default && (
                    <button
                      className="btn btn-ghost"
                      onClick={async () => {
                        try {
                          await saveAddress({ ...a, is_default: true });
                        } catch (e) {
                          // ignore UI error toast for now
                        }
                      }}
                    >
                      Set default
                    </button>
                  )}
                  <button className="btn btn-ghost" onClick={() => deleteAddress(a.id!)}>Delete</button>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p>{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
                <p>{a.city}, {a.state} {a.pincode}</p>
                <p>{a.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="card p-6 grid gap-3">
          <h2 className="font-medium">{editing.id ? "Edit address" : "Add address"}</h2>
          <label className="text-sm">Label</label>
          <input className="rounded-xl px-4 py-3 border border-black/10" value={editing.label || ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} />

          <label className="text-sm">Full name</label>
          <input className="rounded-xl px-4 py-3 border border-black/10" value={editing.full_name} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} />

          <label className="text-sm">Phone</label>
          <input className="rounded-xl px-4 py-3 border border-black/10" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />

          <label className="text-sm">Address line 1</label>
          <input className="rounded-xl px-4 py-3 border border-black/10" value={editing.line1} onChange={(e) => setEditing({ ...editing, line1: e.target.value })} />

          <label className="text-sm">Address line 2 (optional)</label>
          <input className="rounded-xl px-4 py-3 border border-black/10" value={editing.line2 || ""} onChange={(e) => setEditing({ ...editing, line2: e.target.value })} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">City</label>
              <input className="rounded-xl px-4 py-3 border border-black/10 w-full" value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">State</label>
              <input className="rounded-xl px-4 py-3 border border-black/10 w-full" value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Pincode</label>
              <input className="rounded-xl px-4 py-3 border border-black/10 w-full" value={editing.pincode} onChange={(e) => setEditing({ ...editing, pincode: e.target.value })} />
            </div>
          </div>

          <label className="text-sm">Country</label>
          <input className="rounded-xl px-4 py-3 border border-black/10" value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} />

          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={Boolean(editing.is_default)} onChange={(e) => setEditing({ ...editing, is_default: e.target.checked })} />
            Set as default address
          </label>

          <div className="flex items-center gap-3 mt-2">
            <button
              className="btn btn-primary"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                setError(null);
                try {
                  await saveAddress(editing);
                  setEditing(null);
                } catch (e: any) {
                  setError(e?.message || "Failed to save address");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

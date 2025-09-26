"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/contexts/cart";

export default function AccountWishlistPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id;
      if (!uid) {
        window.location.href = "/login?next=/account/wishlist";
        return;
      }
      try {
        // 1) fetch wishlist ids
        const res = await fetch(`/api/wishlist?id=${uid}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load wishlist");
        const ids: string[] = json.items || [];
        if (ids.length === 0) {
          setItems([]);
          return;
        }
        // 2) fetch products for those ids
        // Using anon client on client-side
        const { data: prods, error: pErr } = await supabase
          .from("products")
          .select("id,name,slug,price,images")
          .in("id", ids);
        if (pErr) throw new Error(pErr.message);
        setItems(prods || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) return <p>Loading…</p>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Wishlist</h1>
        <Link href="/shop" className="underline">Continue shopping</Link>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {items.length === 0 ? (
        <p className="text-muted">No items in your wishlist yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <div key={p.id} className="group block">
              <Link href={`/product/${p.slug}`}>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-black/10 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={(p.images && p.images[0]) || "/hero.svg"} alt={p.name} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm">{p.name}</p>
                <p className="text-sm">₹{fmt.format(p.price)}</p>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  className="btn btn-primary flex-1"
                  onClick={async () => {
                    // 1) add to cart
                    addItem({ id: p.id, name: p.name, price: Number(p.price), image: (p.images && p.images[0]) || undefined }, 1);
                    // 2) remove from wishlist
                    const { data } = await supabase.auth.getSession();
                    const uid = data.session?.user?.id!;
                    await fetch("/api/wishlist", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: uid, product_id: p.id }),
                    });
                    // 3) update UI
                    setItems((arr) => arr.filter((x) => x.id !== p.id));
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={async () => {
                    const { data } = await supabase.auth.getSession();
                    const uid = data.session?.user?.id!;
                    await fetch("/api/wishlist", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: uid, product_id: p.id }),
                    });
                    setItems((arr) => arr.filter((x) => x.id !== p.id));
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

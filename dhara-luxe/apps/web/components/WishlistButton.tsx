"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WishlistButton({ productId }: { productId: string }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id || null;
      setUserId(uid);
      if (!uid) return;
      try {
        const res = await fetch(`/api/wishlist?id=${uid}`);
        const json = await res.json();
        if (res.ok) {
          const items: string[] = json.items || [];
          setInWishlist(items.includes(productId));
        }
      } catch {}
    })();
  }, [productId]);

  async function toggle() {
    if (!userId) {
      // send to login, then back to same page
      const next = typeof window !== "undefined" ? window.location.pathname : "/";
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }
    setLoading(true);
    try {
      const method = inWishlist ? "DELETE" : "POST";
      const res = await fetch("/api/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, product_id: productId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update wishlist");
      setInWishlist(!inWishlist);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn btn-ghost" disabled={loading} onClick={toggle} aria-pressed={inWishlist}>
      {inWishlist ? "♥ In Wishlist" : "♡ Add to Wishlist"}
    </button>
  );
}

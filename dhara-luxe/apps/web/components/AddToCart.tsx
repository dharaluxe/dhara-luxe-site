"use client";

import { useCart } from "@/contexts/cart";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddToCart({
  id,
  name,
  price,
  image,
}: {
  id: string;
  name: string;
  price: number; // rupees
  image?: string;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState<number>(1);
  // Use shared anon supabase client on the client side

  async function goToCheckout() {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (!session) {
      window.location.href = `/login?next=${encodeURIComponent("/checkout")}`;
      return;
    }
    window.location.href = "/checkout";
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2">
        <button className="btn btn-ghost px-4 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
        <input
          className="w-14 text-center rounded-md border border-black/10 py-2"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
        />
        <button className="btn btn-ghost px-4 py-2" onClick={() => setQty((q) => Math.min(99, q + 1))}>＋</button>
      </div>
      <div className="flex gap-3">
        <button
          className="btn btn-primary"
          onClick={() => addItem({ id, name, price, image }, qty)}
        >
          Add to Cart
        </button>
        <button
          className="btn btn-ghost"
          onClick={async () => {
            addItem({ id, name, price, image }, qty);
            await goToCheckout();
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

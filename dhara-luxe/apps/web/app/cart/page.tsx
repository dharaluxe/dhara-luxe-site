"use client";

import Link from "next/link";
import { useCart } from "@/contexts/cart";
import { supabase } from "@/lib/supabaseClient";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (items.length === 0) {
    return (
      <section className="container-luxe py-16 md:py-24">
        <h1 className="font-serif text-3xl mb-2">Your Cart</h1>
        <p className="text-muted">Your bag is empty.</p>
        <div className="mt-6"><Link className="btn btn-primary" href="/shop">Shop now</Link></div>
      </section>
    );
  }

  return (
    <section className="container-luxe py-12 md:py-20 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 grid gap-4">
        {items.map((it) => (
          <div key={it.id} className="card p-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image || "/hero.svg"} alt={it.name} className="w-24 h-24 object-cover rounded-md" />
            <div className="flex-1">
              <p className="font-medium">{it.name}</p>
              <p className="text-sm text-muted mt-1">₹{fmt.format(it.price)}</p>
              <div className="mt-3 flex items-center gap-2">
                <button className="btn btn-ghost px-3 py-1" onClick={() => updateQty(it.id, Math.max(1, it.quantity - 1))}>−</button>
                <input
                  className="w-12 text-center rounded-md border border-black/10 py-1"
                  value={it.quantity}
                  onChange={(e) => updateQty(it.id, Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                />
                <button className="btn btn-ghost px-3 py-1" onClick={() => updateQty(it.id, Math.min(99, it.quantity + 1))}>＋</button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p>₹{fmt.format(it.price * it.quantity)}</p>
              <button className="btn btn-ghost" onClick={() => removeItem(it.id)}>Remove</button>
            </div>
          </div>
        ))}
        <div>
          <button className="btn btn-ghost" onClick={() => clear()}>Clear Cart</button>
        </div>
      </div>

      <aside className="card p-6 h-fit">
        <h2 className="text-lg font-medium">Order Summary</h2>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{fmt.format(subtotal)}</span>
        </div>
        <p className="text-xs text-muted mt-2">Taxes and shipping calculated at checkout.</p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="btn btn-primary"
            onClick={async () => {
              const { data } = await supabase.auth.getSession();
              const session = data?.session;
              if (!session) {
                window.location.href = `/login?next=${encodeURIComponent("/checkout")}`;
                return;
              }
              window.location.href = "/checkout";
            }}
          >
            Proceed to Checkout
          </button>
          <Link href="/shop" className="btn btn-ghost text-center">Continue Shopping</Link>
        </div>
      </aside>
    </section>
  );
}

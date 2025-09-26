"use client";

import Link from "next/link";
import { useCart } from "@/contexts/cart";
import { useCheckoutInfo } from "@/hooks/useCheckoutInfo";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { info, setInfo } = useCheckoutInfo();
  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addrError, setAddrError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  async function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const uid = data.session?.user?.id;
        if (!uid) return; // guarded earlier in flow
        const res = await fetch(`/api/addresses?id=${uid}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load addresses");
        const list: any[] = Array.isArray(json.items) ? json.items : [];
        setAddresses(list);
        const def = list.find((a) => a.is_default);
        if (def) {
          // auto-fill checkout from default address
          setInfo({
            ...info,
            fullName: def.full_name || "",
            phone: def.phone || "",
            address1: def.line1 || "",
            address2: def.line2 || "",
            city: def.city || "",
            state: def.state || "",
            pincode: def.pincode || "",
            country: def.country || info.country,
          });
        }
      } catch (e: any) {
        setAddrError(e?.message || "Failed to load addresses");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canPlace = items.length > 0 && info.fullName && info.address1 && info.phone && info.pincode && info.state && info.country;

  function update<K extends keyof typeof info>(key: K, value: (typeof info)[K]) {
    setInfo({ ...info, [key]: value });
  }

  return (
    <section className="container-luxe py-12 md:py-20 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 grid gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-medium">Shipping Details</h2>
          {addresses.length > 0 && (
            <div className="mt-3">
              <label className="text-sm mb-1 block">Saved addresses</label>
              <select
                className="rounded-xl px-4 py-3 border border-black/10 w-full"
                onChange={(e) => {
                  const sel = addresses.find((a) => a.id === e.target.value);
                  if (!sel) return;
                  setInfo({
                    ...info,
                    fullName: sel.full_name || "",
                    phone: sel.phone || "",
                    address1: sel.line1 || "",
                    address2: sel.line2 || "",
                    city: sel.city || "",
                    state: sel.state || "",
                    pincode: sel.pincode || "",
                    country: sel.country || info.country,
                  });
                }}
                defaultValue={addresses.find((a) => a.is_default)?.id || ""}
              >
                <option value="">Select an address</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {(a.label || "Address")} — {a.line1}, {a.city}
                  </option>
                ))}
              </select>
              {addrError && <p className="text-xs text-red-600 mt-1">{addrError}</p>}
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Full name" className="rounded-xl px-4 py-3 border border-black/10" value={info.fullName} onChange={(e) => update("fullName", e.target.value)} />
            <input placeholder="Phone number" className="rounded-xl px-4 py-3 border border-black/10" value={info.phone} onChange={(e) => update("phone", e.target.value)} />
            <input placeholder="Address line 1" className="rounded-xl px-4 py-3 border border-black/10 md:col-span-2" value={info.address1} onChange={(e) => update("address1", e.target.value)} />
            <input placeholder="Address line 2 (optional)" className="rounded-xl px-4 py-3 border border-black/10 md:col-span-2" value={info.address2} onChange={(e) => update("address2", e.target.value)} />
            <input placeholder="City" className="rounded-xl px-4 py-3 border border-black/10" value={info.city} onChange={(e) => update("city", e.target.value)} />
            <input placeholder="State" className="rounded-xl px-4 py-3 border border-black/10" value={info.state} onChange={(e) => update("state", e.target.value)} />
            <input placeholder="PIN code" className="rounded-xl px-4 py-3 border border-black/10" value={info.pincode} onChange={(e) => update("pincode", e.target.value)} />
            <select className="rounded-xl px-4 py-3 border border-black/10" value={info.country} onChange={(e) => update("country", e.target.value)}>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>United Arab Emirates</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Singapore</option>
            </select>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input id="gift" type="checkbox" checked={info.giftWrap} onChange={(e) => update("giftWrap", e.target.checked)} />
            <label htmlFor="gift" className="text-sm">Gift packing for special occasion</label>
          </div>
          <textarea placeholder="Order notes (optional)" className="mt-4 rounded-xl px-4 py-3 border border-black/10 w-full min-h-24" value={info.notes} onChange={(e) => update("notes", e.target.value)} />
        </div>
      </div>

      <aside className="card p-6 h-fit">
        <h2 className="text-lg font-medium">Order Summary</h2>
        <div className="mt-4 grid gap-2 text-sm">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between">
              <span>{it.name} × {it.quantity}</span>
              <span>₹{fmt.format(it.price * it.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{fmt.format(subtotal)}</span>
        </div>
        <p className="text-xs text-muted mt-2">Shipping and taxes calculated at payment.</p>
        <div className="mt-6 flex flex-col gap-3">
          {placeError && <p className="text-sm text-red-600">{placeError}</p>}
          <button
            className="btn btn-primary"
            disabled={!canPlace || placing}
            onClick={async () => {
              setPlacing(true);
              setPlaceError(null);
              try {
                const { data } = await supabase.auth.getSession();
                const uid = data.session?.user?.id;
                if (!uid) {
                  window.location.href = "/login?next=/checkout";
                  return;
                }
                const shipping = {
                  full_name: info.fullName,
                  phone: info.phone,
                  line1: info.address1,
                  line2: info.address2,
                  city: info.city,
                  state: info.state,
                  pincode: info.pincode,
                  country: info.country,
                };

                // Load Razorpay script
                const ok = await loadRazorpay();
                if (!ok) throw new Error("Unable to load Razorpay. Check your network.");

                // Create our order + Razorpay order
                const res = await fetch("/api/payments/razorpay/order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ user_id: uid, items, shipping, amount: subtotal }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || "Failed to create Razorpay order");

                const { order_id, razorpay } = json;
                const options: any = {
                  key: razorpay.key_id,
                  amount: razorpay.amount,
                  currency: razorpay.currency,
                  name: "Dhara Luxe",
                  description: "Order Payment",
                  order_id: razorpay.order_id,
                  prefill: {
                    name: info.fullName,
                    contact: info.phone,
                  },
                  theme: { color: "#0f5132" },
                  handler: async function (response: any) {
                    try {
                      const verifyRes = await fetch("/api/payments/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          order_id,
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                        }),
                      });
                      const verifyJson = await verifyRes.json();
                      if (!verifyRes.ok) throw new Error(verifyJson.error || "Payment verification failed");
                      clear();
                      window.location.href = "/account/orders";
                    } catch (e: any) {
                      setPlaceError(e?.message || "Payment verification failed");
                    }
                  },
                  modal: {
                    ondismiss: function () {
                      setPlacing(false);
                    },
                  },
                  notes: { project: "Dhara Luxe" },
                };
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
              } catch (e: any) {
                setPlaceError(e?.message || "Failed to place order");
              } finally {
                setPlacing(false);
              }
            }}
          >
            {placing ? "Placing…" : "Place Order"}
          </button>
          <Link href="/cart" className="btn btn-ghost text-center">Back to Cart</Link>
        </div>
      </aside>
    </section>
  );
}

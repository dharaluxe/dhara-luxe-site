import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabaseServer";

async function getOrder(id: string) {
  const db = getSupabaseServer();
  const { data } = await db
    .from("orders")
    .select("id,items,shipping,amount,status,created_at,payment_id,razorpay_order_id")
    .eq("id", id)
    .single();
  return data as any | null;
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!order) {
    return (
      <section className="container-luxe py-16">
        <h1 className="font-serif text-3xl mb-2">Order not found</h1>
        <Link href="/account/orders" className="underline">Back to Orders</Link>
      </section>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const shipping = order.shipping || order.address || {};

  return (
    <section className="container-luxe py-12 md:py-20 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="card p-6">
          <h1 className="text-xl font-medium">Order #{order.id?.slice(0,8)}</h1>
          <p className="text-sm text-muted">Placed on {new Date(order.created_at).toLocaleString()}</p>

          <div className="mt-6 grid gap-3">
            {items.map((it: any) => (
              <div key={it.id} className="flex items-center justify-between text-sm">
                <span>{it.name} × {it.quantity}</span>
                <span>₹{fmt.format(Number(it.price) * Number(it.quantity || 1))}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-black/10 pt-3 text-sm">
              <span>Total</span>
              <span>₹{fmt.format(order.amount || 0)}</span>
            </div>
          </div>
        </div>
      </div>
      <aside className="card p-6 h-fit">
        <h2 className="text-lg font-medium">Summary</h2>
        <p className="mt-2 text-sm">Status: <span className="capitalize">{order.status}</span></p>
        {order.payment_id && <p className="text-sm">Payment: {order.payment_id}</p>}
        {order.razorpay_order_id && <p className="text-sm">RZP Order: {order.razorpay_order_id}</p>}
        <div className="mt-4">
          <h3 className="font-medium">Shipping address</h3>
          <div className="text-sm mt-1">
            <p>{shipping.full_name}</p>
            <p>{shipping.line1}{shipping.line2 ? `, ${shipping.line2}` : ""}</p>
            <p>{shipping.city}, {shipping.state} {shipping.pincode}</p>
            <p>{shipping.country}</p>
            {shipping.phone && <p>Phone: {shipping.phone}</p>}
          </div>
        </div>
        <div className="mt-6"><Link href="/account/orders" className="btn btn-ghost">Back to Orders</Link></div>
      </aside>
    </section>
  );
}

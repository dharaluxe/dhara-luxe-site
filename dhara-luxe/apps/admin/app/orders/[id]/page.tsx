import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

async function getOrder(id: string) {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from("orders")
    .select("id,user_id,items,amount,status,created_at,payment_id,razorpay_order_id,shipping,refund_status,refund_amount,refund_id,refund_reason,admin_remark,risk_score,risk_flags,customer_ip,user_agent,email_verified,phone_verified,gateway_payment_method,card_country,gateway_risk")
    .eq("id", id)
    .single();
  return data as any | null;
}

async function getEvents(orderId: string) {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from("order_events")
    .select("id,type,data,created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });
  return data as any[] || [];
}

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  const events = await getEvents(params.id);
  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!order) {
    return (
      <section className="container-luxe py-16">
        <h1 className="font-serif text-3xl mb-2">Order not found</h1>
        <Link href="/orders" className="underline">Back to Orders</Link>
      </section>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const shipping = order.shipping || {};

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
        <h2 className="text-lg font-medium">Manage</h2>
        <p className="text-sm">Status: <span className="capitalize">{order.status}</span></p>
        {order.payment_id && <p className="text-sm">Payment: {order.payment_id}</p>}
        {order.razorpay_order_id && <p className="text-sm">RZP Order: {order.razorpay_order_id}</p>}
        <div className="mt-3">
          <h3 className="font-medium">Risk</h3>
          <div className="text-sm mt-1 grid gap-1">
            <p>Score: {Number(order.risk_score || 0).toFixed(2)}</p>
            {Array.isArray(order.risk_flags) && order.risk_flags.length > 0 && (
              <p>Flags: {order.risk_flags.join(", ")}</p>
            )}
            <p>Verified: email {order.email_verified ? "✓" : "✗"} · phone {order.phone_verified ? "✓" : "✗"}</p>
            {order.gateway_payment_method && <p>Method: {order.gateway_payment_method} {order.card_country && `(card: ${order.card_country})`}</p>}
            {order.gateway_risk && <p>Gateway risk: {order.gateway_risk}</p>}
            {order.customer_ip && <p>IP: {order.customer_ip}</p>}
            {order.user_agent && <p className="truncate" title={order.user_agent}>UA: {order.user_agent}</p>}
          </div>
        </div>
        <div className="mt-3">
          {/* Status control (client component would be nicer, keeping simple serverless POST) */}
          <form action={`/api/orders/${order.id}`} method="post">
            <input type="hidden" name="_method" value="PATCH" />
            <label className="text-sm">Status</label>
            <select name="status" defaultValue={order.status} className="rounded-xl px-4 py-3 border border-black/10 w-full">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn btn-primary mt-3" formAction={`/api/orders/${order.id}`}>Update Status</button>
          </form>
        </div>
        <div className="mt-6">
          <h3 className="font-medium">Refunds</h3>
          <form action={`/api/orders/${order.id}`} method="post" className="grid gap-2">
            <input type="hidden" name="_method" value="PATCH" />
            <label className="text-sm">Refund status</label>
            <input name="refund_status" defaultValue={order.refund_status || ""} className="rounded-xl px-4 py-3 border border-black/10" />
            <label className="text-sm">Refund amount (₹)</label>
            <input name="refund_amount" type="number" step="0.01" defaultValue={order.refund_amount || ""} className="rounded-xl px-4 py-3 border border-black/10" />
            <label className="text-sm">Refund id</label>
            <input name="refund_id" defaultValue={order.refund_id || ""} className="rounded-xl px-4 py-3 border border-black/10" />
            <label className="text-sm">Refund reason</label>
            <textarea name="refund_reason" defaultValue={order.refund_reason || ""} className="rounded-xl px-4 py-3 border border-black/10" />
            <button className="btn btn-primary">Save Refund</button>
          </form>
        </div>
        <div className="mt-6">
          <h3 className="font-medium">Admin remark</h3>
          <form action={`/api/orders/${order.id}`} method="post" className="grid gap-2">
            <input type="hidden" name="_method" value="PATCH" />
            <textarea name="admin_remark" defaultValue={order.admin_remark || ""} className="rounded-xl px-4 py-3 border border-black/10 min-h-24" placeholder="Visible only to admins" />
            <button className="btn btn-primary">Save Remark</button>
          </form>
        </div>
        <div className="mt-6">
          <h3 className="font-medium">Shipping</h3>
          <div className="text-sm mt-1">
            <p>{shipping.full_name}</p>
            <p>{shipping.line1}{shipping.line2 ? `, ${shipping.line2}` : ""}</p>
            <p>{shipping.city}, {shipping.state} {shipping.pincode}</p>
            <p>{shipping.country}</p>
            {shipping.phone && <p>Phone: {shipping.phone}</p>}
          </div>
        </div>
        <div className="mt-6"><Link href="/orders" className="btn btn-ghost">Back to Orders</Link></div>
      </aside>
      <div className="md:col-span-3">
        <div className="card p-6 mt-4">
          <h3 className="text-lg font-medium mb-2">Timeline</h3>
          <div className="grid gap-2 text-sm">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between border-b last:border-0 border-black/10 py-2">
                <span className="capitalize">{ev.type.replace(/_/g, " ")}</span>
                <span className="text-muted">{new Date(ev.created_at).toLocaleString()}</span>
              </div>
            ))}
            {events.length === 0 && <p className="text-muted">No events recorded.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

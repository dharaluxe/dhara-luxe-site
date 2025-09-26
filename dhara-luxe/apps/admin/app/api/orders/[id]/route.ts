import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// GET a single order
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("orders")
    .select("id,user_id,items,amount,status,created_at,payment_id,razorpay_order_id,shipping")
    .eq("id", params.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

// PATCH to update status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const patch: any = {};
    if (body.status) {
      if (!["pending", "paid", "failed", "cancelled"].includes(body.status)) {
        return NextResponse.json({ error: "invalid status" }, { status: 400 });
      }
      patch.status = body.status;
    }
    if (body.refund_status) patch.refund_status = body.refund_status; // free text for now
    if (typeof body.refund_amount !== "undefined") patch.refund_amount = body.refund_amount;
    if (typeof body.refund_id !== "undefined") patch.refund_id = body.refund_id;
    if (typeof body.refund_reason !== "undefined") patch.refund_reason = body.refund_reason;
    if (typeof body.admin_remark !== "undefined") patch.admin_remark = body.admin_remark;
    // Shipment tracking fields
    if (typeof body.shipment_status !== "undefined") patch.shipment_status = body.shipment_status;
    if (typeof body.tracking_number !== "undefined") patch.tracking_number = body.tracking_number;
    if (typeof body.courier !== "undefined") patch.courier = body.courier;
    if (typeof body.tracking_url !== "undefined") patch.tracking_url = body.tracking_url;
    if (typeof body.shipped_at !== "undefined") patch.shipped_at = body.shipped_at;
    if (typeof body.delivered_at !== "undefined") patch.delivered_at = body.delivered_at;
    const db = getSupabaseAdmin();
    const { error } = await db.from("orders").update(patch).eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    try {
      await db.from("order_events").insert({ order_id: params.id, type: "status_changed", data: patch });
    } catch {}
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

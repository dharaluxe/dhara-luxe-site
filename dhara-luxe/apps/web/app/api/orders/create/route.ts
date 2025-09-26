import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// POST: create an order
// Body: { user_id, items: [{ id,name,price,image,quantity }], shipping: {...}, amount }
export async function POST(req: Request) {
  try {
    const { user_id, items, shipping, amount } = await req.json();
    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "items are required" }, { status: 400 });

    const db = getSupabaseAdmin();
    const payload = {
      user_id,
      items,
      shipping,
      amount,
      status: "pending" as const,
    };

    const { data, error } = await db.from("orders").insert(payload).select("id").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

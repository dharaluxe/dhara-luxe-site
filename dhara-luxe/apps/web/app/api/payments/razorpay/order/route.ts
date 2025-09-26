import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// Creates a pending order in DB and a Razorpay order in test mode
// POST body: { user_id, items, shipping, amount }
export async function POST(req: Request) {
  try {
    const { user_id, items, shipping, amount } = await req.json();
    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "items required" }, { status: 400 });
    if (!amount || Number(amount) <= 0) return NextResponse.json({ error: "amount must be > 0" }, { status: 400 });

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      return NextResponse.json({ error: "Missing Razorpay env vars" }, { status: 500 });
    }

    // Risk metadata
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0] || req.headers.get("x-real-ip") || "";
    const ua = req.headers.get("user-agent") || "";

    // 1) Create pending order in DB with risk basics
    const db = getSupabaseAdmin();
    // counts for velocity
    const now = new Date();
    const iso24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const iso7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: c24 } = await db.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user_id).gte("created_at", iso24h);
    const { count: c7 } = await db.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user_id).gte("created_at", iso7d);

    // basic verifications
    let email_verified = false;
    try {
      const { data: userRes } = await db.auth.admin.getUserById(user_id);
      email_verified = Boolean(userRes?.user?.email_confirmed_at);
    } catch {}
    let phone_verified = false;
    try {
      const { data: prof } = await db.from("users_profile").select("phone").eq("id", user_id).maybeSingle();
      phone_verified = Boolean((prof as any)?.phone);
    } catch {}

    // compute simple risk score
    const risk_flags: string[] = [];
    let risk_score = 0;
    if (Number(amount) >= 10000) { risk_flags.push("HIGH_AMOUNT"); risk_score += 3; }
    if (!email_verified) { risk_flags.push("EMAIL_UNVERIFIED"); risk_score += 2; }
    if (!phone_verified) { risk_flags.push("PHONE_UNVERIFIED"); risk_score += 1; }
    if ((c24 || 0) > 2) { risk_flags.push("VELOCITY_24H"); risk_score += 2; }
    if ((c7 || 0) > 5) { risk_flags.push("VELOCITY_7D"); risk_score += 2; }

    // Include legacy 'address' column for compatibility if it exists
    const payload: any = { user_id, items, shipping, amount, status: "pending" as const, address: shipping, customer_ip: ip, user_agent: ua, risk_score, risk_flags, email_verified, phone_verified, orders_last_24h: c24 || 0, orders_last_7d: c7 || 0 };
    const { data: orderIns, error: orderErr } = await db.from("orders").insert(payload).select("id").single();
    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });
    const orderId = orderIns!.id as string;

    // Add timeline event
    await db.from("order_events").insert({ order_id: orderId, type: "created", data: { amount, items_count: Array.isArray(items) ? items.length : 0, risk_flags, risk_score } });

    // 2) Create Razorpay order (amount in paise)
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${key_id}:${key_secret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100),
        currency: "INR",
        receipt: orderId,
        notes: { project: "Dhara Luxe" },
      }),
    });
    const rzpJson = await rzpRes.json();
    if (!rzpRes.ok) return NextResponse.json({ error: rzpJson?.error?.description || "Failed to create Razorpay order" }, { status: 500 });

    // 3) Save razorpay_order_id on our order
    await db.from("orders").update({ razorpay_order_id: rzpJson.id }).eq("id", orderId);

    return NextResponse.json({ ok: true, order_id: orderId, razorpay: { order_id: rzpJson.id, amount: rzpJson.amount, currency: rzpJson.currency, key_id } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

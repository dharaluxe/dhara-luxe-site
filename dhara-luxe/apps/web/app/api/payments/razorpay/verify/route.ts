import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendOrderEmail } from "@/lib/email";

// Verify Razorpay signature and mark order as paid
// POST body: { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }
export async function POST(req: Request) {
  try {
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) return NextResponse.json({ error: "Missing Razorpay secret" }, { status: 500 });

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", key_secret).update(payload).digest("hex");
    const ok = expected === razorpay_signature;
    if (!ok) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

    const db = getSupabaseAdmin();
    const { error } = await db
      .from("orders")
      .update({ status: "paid", payment_id: razorpay_payment_id })
      .eq("id", order_id)
      .eq("razorpay_order_id", razorpay_order_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Fetch payment details from Razorpay (test mode) to enrich order
    try {
      const key_id = process.env.RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      if (key_id && key_secret) {
        const payRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: {
            Authorization: "Basic " + Buffer.from(`${key_id}:${key_secret}`).toString("base64"),
          },
        });
        if (payRes.ok) {
          const payJson: any = await payRes.json();
          const gateway_payment_method = payJson.method; // card, upi, netbanking, wallet, emi
          const card_country = payJson.card?.country || null;
          const gateway_risk = payJson.risk_level?.toString?.() || null;
          await db
            .from("orders")
            .update({ gateway_payment_method, card_country, gateway_risk })
            .eq("id", order_id);

          // Optionally adjust risk based on international card
          if (card_country && card_country !== "IN") {
            const { data: ord } = await db.from("orders").select("risk_flags,risk_score").eq("id", order_id).maybeSingle();
            const flags: string[] = Array.isArray((ord as any)?.risk_flags) ? (ord as any).risk_flags : [];
            if (!flags.includes("INTL_CARD")) flags.push("INTL_CARD");
            const score = Number((ord as any)?.risk_score || 0) + 2;
            await db.from("orders").update({ risk_flags: flags, risk_score: score }).eq("id", order_id);
            await db.from("order_events").insert({ order_id, type: "risk_reviewed", data: { add: "INTL_CARD", score_delta: 2 } });
          }
        }
      }
    } catch (e) {
      // Non-blocking enrichment failure
      console.error("RZP enrich failed", e);
    }

    // Add timeline 'paid'
    await db.from("order_events").insert({ order_id, type: "paid", data: { payment_id: razorpay_payment_id } });

    // Fetch order and user email for confirmation
    const { data: order } = await db
      .from("orders")
      .select("id,user_id,items,amount,shipping,created_at")
      .eq("id", order_id)
      .maybeSingle();

    if (order?.user_id) {
      try {
        const { data: userRes } = await db.auth.admin.getUserById(order.user_id);
        const to = userRes?.user?.email;
        if (to && process.env.SMTP_HOST && process.env.EMAIL_ENABLED === 'true') {
          // best-effort email (non-blocking for client UX)
          await sendOrderEmail({
            to,
            subject: `Your Dhara Luxe order ${order.id.slice(0,8)} is confirmed`,
            order: {
              id: order.id,
              amount: order.amount,
              items: order.items,
              shipping: order.shipping,
              created_at: order.created_at,
            },
          });
        }
      } catch (e) {
        // swallow email errors to avoid blocking payment success
        console.error("Email send failed:", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

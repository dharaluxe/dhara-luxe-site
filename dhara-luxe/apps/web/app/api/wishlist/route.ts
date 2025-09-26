import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// GET /api/wishlist?id=<user_id>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const db = getSupabaseAdmin();
  const { data, error } = await db.from("users_profile").select("wishlist").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data?.wishlist || [] });
}

// POST { id, product_id }
export async function POST(req: Request) {
  try {
    const { id, product_id } = await req.json();
    if (!id || !product_id) return NextResponse.json({ error: "id and product_id are required" }, { status: 400 });
    const db = getSupabaseAdmin();
    const { data: prof } = await db.from("users_profile").select("wishlist").eq("id", id).maybeSingle();
    const cur: string[] = Array.isArray(prof?.wishlist) ? prof!.wishlist : [];
    if (!cur.includes(product_id)) cur.push(product_id);
    const { error } = await db.from("users_profile").upsert({ id, wishlist: cur }, { onConflict: "id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, items: cur });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

// DELETE { id, product_id }
export async function DELETE(req: Request) {
  try {
    const { id, product_id } = await req.json();
    if (!id || !product_id) return NextResponse.json({ error: "id and product_id are required" }, { status: 400 });
    const db = getSupabaseAdmin();
    const { data: prof } = await db.from("users_profile").select("wishlist").eq("id", id).maybeSingle();
    const cur: string[] = Array.isArray(prof?.wishlist) ? prof!.wishlist : [];
    const next = cur.filter((p) => p !== product_id);
    const { error } = await db.from("users_profile").upsert({ id, wishlist: next }, { onConflict: "id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, items: next });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

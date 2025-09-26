import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// GET /api/addresses?id=<user_id>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const db = getSupabaseAdmin();
  const { data, error } = await db.from("users_profile").select("addresses").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: Array.isArray((data as any)?.addresses) ? (data as any).addresses : [] });
}

// POST { id, address } -> upsert address by address.id if present, else push new
export async function POST(req: Request) {
  try {
    const { id, address } = await req.json();
    if (!id || !address) return NextResponse.json({ error: "id and address are required" }, { status: 400 });
    const db = getSupabaseAdmin();
    const { data: prof, error: selErr } = await db.from("users_profile").select("addresses").eq("id", id).maybeSingle();
    if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 });
    const cur: any[] = Array.isArray((prof as any)?.addresses) ? (prof as any).addresses : [];
    let working = cur.slice();
    let targetId = address.id || crypto.randomUUID();
    const merged = { ...address, id: targetId };
    const exists = working.some((a) => a.id === targetId);
    if (exists) {
      working = working.map((a) => (a.id === targetId ? { ...a, ...merged } : a));
    } else {
      working.push(merged);
    }

    // If the incoming address is marked default, ensure all others are not default
    if (merged.is_default) {
      working = working.map((a) => ({ ...a, is_default: a.id === targetId }));
    }

    const next = working;
    const { error } = await db.from("users_profile").upsert({ id, addresses: next }, { onConflict: "id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, items: next });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

// DELETE { id, address_id }
export async function DELETE(req: Request) {
  try {
    const { id, address_id } = await req.json();
    if (!id || !address_id) return NextResponse.json({ error: "id and address_id are required" }, { status: 400 });
    const db = getSupabaseAdmin();
    const { data: prof, error: selErr } = await db.from("users_profile").select("addresses").eq("id", id).maybeSingle();
    if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 });
    const cur: any[] = Array.isArray((prof as any)?.addresses) ? (prof as any).addresses : [];
    const next = cur.filter((a) => a.id !== address_id);
    const { error } = await db.from("users_profile").upsert({ id, addresses: next }, { onConflict: "id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, items: next });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { id, name, phone, whatsapp_opt_in } = await req.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("users_profile")
      .upsert({ id, name, phone, whatsapp_opt_in }, { onConflict: "id" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("users_profile")
    .select("id,name,phone,whatsapp_opt_in")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { COLOR_OPTIONS } from "@/lib/colors";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,price,description,images,stock,category,featured,sku,color,launch_at")
    .eq("id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const update: any = {};
    const fields = [
      "name",
      "slug",
      "price",
      "description",
      "images",
      "stock",
      "category",
      "featured",
      "sku",
      "color",
      "launch_at",
    ];
    for (const f of fields) if (f in body) update[f] = body[f];

    if (update.color && !COLOR_OPTIONS.includes(update.color)) {
      return NextResponse.json({ error: "Invalid color" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("products").update(update).eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

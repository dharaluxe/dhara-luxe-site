import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { COLOR_OPTIONS } from "@/lib/colors";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,price,stock,category,featured,color,created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      price,
      description = "",
      images = [],
      stock = 0,
      category = "",
      featured = false,
      sku = "",
      color = "",
      launch_at,
    } = body || {};

    if (!name || !slug || !price) {
      return NextResponse.json({ error: "name, slug, price are required" }, { status: 400 });
    }

    if (color && !COLOR_OPTIONS.includes(color)) {
      return NextResponse.json({ error: "Invalid color" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, slug, price, description, images, stock, category, featured, sku, color, launch_at }])
      .select("id").single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

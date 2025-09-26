import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();

  const sample = [
    {
      name: "Vegan Tote — Terra",
      slug: "vegan-tote-terra",
      price: 18990,
      description: "A sculpted tote in vegan leather with hand-finished edges.",
      images: ["/products/terra-1.svg", "/products/terra-2.svg"],
      stock: 25,
      category: "Tote",
      featured: true,
      sku: "DL-TOTE-TERRA",
      color: "Terra",
    },
    {
      name: "Shoulder Bag — Ecru",
      slug: "shoulder-ecru",
      price: 15990,
      description: "Compact shoulder bag with considered compartments.",
      images: ["/products/ecru-1.svg", "/products/ecru-2.svg"],
      stock: 32,
      category: "Shoulder",
      featured: false,
      sku: "DL-SHOULDER-ECRU",
      color: "Ecru",
    },
    {
      name: "Crossbody — Forest",
      slug: "crossbody-forest",
      price: 12990,
      description: "Lightweight crossbody with adjustable strap.",
      images: ["/products/forest-1.svg", "/products/forest-2.svg"],
      stock: 40,
      category: "Crossbody",
      featured: true,
      sku: "DL-CROSS-FOREST",
      color: "Forest",
    },
  ];

  const { error } = await supabase.from("products").upsert(sample, {
    onConflict: "slug",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, inserted: sample.length });
}

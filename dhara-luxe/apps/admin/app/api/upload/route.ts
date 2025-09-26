import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

// Upload product images to Supabase Storage bucket "products".
// Expects multipart/form-data with one or more files under the key "files".
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll("files");
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Ensure bucket exists (idempotent)
    try {
      const { data: buckets } = await (supabase as any).storage.listBuckets?.();
      const has = Array.isArray(buckets) && buckets.some((b: any) => b.name === "products");
      if (!has && (supabase as any).storage.createBucket) {
        await (supabase as any).storage.createBucket("products", { public: true });
      }
    } catch {}

    const uploaded: string[] = [];
    for (const f of files) {
      if (!(f instanceof File)) continue;
      const bytes = await f.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = f.name.split(".").pop()?.toLowerCase() || "bin";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `products/${filename}`;

      const { error: upErr } = await supabase.storage.from("products").upload(path, buffer, {
        contentType: f.type || "application/octet-stream",
        upsert: false,
      });
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

      const { data } = supabase.storage.from("products").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    return NextResponse.json({ ok: true, urls: uploaded });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

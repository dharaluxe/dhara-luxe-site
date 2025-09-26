import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("waitlist")
    .select("email,created_at")
    .order("created_at", { ascending: false });
  if (error) return new NextResponse("Failed to fetch", { status: 500 });

  const rows = data || [];
  const header = "email,created_at\n";
  const csv = header + rows.map((r) => `${r.email},${new Date(r.created_at).toISOString()}`).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=waitlist.csv`,
    },
  });
}

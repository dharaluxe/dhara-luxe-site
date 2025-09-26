import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }
  const supabase = getSupabaseAdmin();
  const email = "krishna@example.com";
  const password = "12345678";

  // Try to fetch existing user
  const { data: userByEmail } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = userByEmail.users.find((u) => u.email?.toLowerCase() === email);
  if (existing) {
    return NextResponse.json({ ok: true, existing: true });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "admin", name: "Krishna" },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, userId: data.user?.id });
}

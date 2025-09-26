"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  user_id: string;
  name: string;
  phone: string;
  whatsapp_opt_in: boolean;
};

export default function AccountProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        window.location.href = "/login?next=/account/profile";
        return;
      }
      setEmail(user.email || "");
      try {
        const res = await fetch(`/api/profile?id=${user.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile");
        setProfile({
          user_id: user.id,
          name: data.item?.name || "",
          phone: data.item?.phone || "",
          whatsapp_opt_in: Boolean(data.item?.whatsapp_opt_in),
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load profile");
        setProfile({ user_id: user.id, name: "", phone: "", whatsapp_opt_in: false });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [saved, setSaved] = useState<string | null>(null);

  async function save() {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profile.user_id, name: profile.name, phone: profile.phone, whatsapp_opt_in: profile.whatsapp_opt_in }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved("Profile saved");
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (!profile) return <p>Profile unavailable.</p>;

  return (
    <div className="card p-6 grid gap-4 max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Profile</h1>
        <button
          className="btn btn-ghost"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
      {email && (
        <>
          <label className="text-sm">Email</label>
          <input className="rounded-xl px-4 py-3 border border-black/10 bg-black/5" value={email} disabled />
        </>
      )}
      <label className="text-sm">Name</label>
      <input
        className="rounded-xl px-4 py-3 border border-black/10"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <label className="text-sm">Mobile number</label>
      <input
        className="rounded-xl px-4 py-3 border border-black/10"
        value={profile.phone}
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={profile.whatsapp_opt_in}
          onChange={(e) => setProfile({ ...profile, whatsapp_opt_in: e.target.checked })}
        />
        Receive WhatsApp updates
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-700">{saved}</p>}
      <div className="flex gap-3">
        <button className="btn btn-primary" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

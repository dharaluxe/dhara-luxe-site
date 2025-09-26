"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { COLOR_OPTIONS } from "@/lib/colors";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<any>({
    name: "",
    slug: "",
    price: 0,
    stock: 0,
    category: "",
    featured: false,
    color: "",
    sku: "",
    images: [] as string[],
    description: "",
    launch_at: "",
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to load product");
        return;
      }
      const p = data.item || {};
      setForm({
        name: p.name || "",
        slug: p.slug || "",
        price: p.price || 0,
        stock: p.stock || 0,
        category: p.category || "",
        featured: !!p.featured,
        color: p.color || "",
        sku: p.sku || "",
        images: Array.isArray(p.images) ? p.images : [],
        description: p.description || "",
        launch_at: p.launch_at ? new Date(p.launch_at).toISOString().slice(0, 16) : "", // for datetime-local
      });
      setLoading(false);
    })();
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((f: any) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  async function onUpload() {
    const el = document.getElementById("file-input") as HTMLInputElement | null;
    if (!el || !el.files || el.files.length === 0) return;
    const fd = new FormData();
    Array.from(el.files).forEach((f) => fd.append("files", f));
    setUploading(true);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      alert(data.error || "Upload failed");
      return;
    }
    setForm((f: any) => ({ ...f, images: [...f.images, ...(data.urls || [])] }));
    el.value = "";
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        featured: form.featured,
        color: form.color,
        sku: form.sku,
        images: form.images,
        description: form.description,
        launch_at: form.launch_at ? new Date(form.launch_at).toISOString() : null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      alert(data.error || "Failed to save product");
      return;
    }
    router.push("/products");
  }

  if (loading) return <p>Loading…</p>;

  return (
    <section className="grid gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-medium">Edit Product</h1>
        <p className="text-sm text-muted mt-1">Update product details</p>
      </div>

      <form onSubmit={onSave} className="card p-6 grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" className="rounded-xl px-4 py-3 border border-black/10" value={form.name} onChange={onChange} required />
          <input name="slug" placeholder="Slug (unique)" className="rounded-xl px-4 py-3 border border-black/10" value={form.slug} onChange={onChange} required />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="price" type="number" step="0.01" placeholder="Price (in rupees)" className="rounded-xl px-4 py-3 border border-black/10" value={form.price} onChange={onChange} required />
          <input name="stock" type="number" placeholder="Stock" className="rounded-xl px-4 py-3 border border-black/10" value={form.stock} onChange={onChange} />
          <input name="sku" placeholder="SKU" className="rounded-xl px-4 py-3 border border-black/10" value={form.sku} onChange={onChange} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="category" placeholder="Category" className="rounded-xl px-4 py-3 border border-black/10" value={form.category} onChange={onChange} />
          <select name="color" className="rounded-xl px-4 py-3 border border-black/10" value={form.color} onChange={onChange}>
            <option value="">Color</option>
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" checked={form.featured} onChange={onChange} /> Featured</label>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm text-muted flex flex-col">
            <span className="mb-2">Launch date & time</span>
            <input name="launch_at" type="datetime-local" className="rounded-xl px-4 py-3 border border-black/10" value={form.launch_at} onChange={onChange} />
          </label>
        </div>

        <textarea name="description" placeholder="Description" className="rounded-xl px-4 py-3 border border-black/10 min-h-28" value={form.description} onChange={onChange} />

        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <input id="file-input" type="file" multiple accept="image/*" className="rounded-xl px-4 py-3 border border-black/10" />
            <button type="button" className="btn btn-ghost" disabled={uploading} onClick={onUpload}>
              {uploading ? "Uploading…" : "Upload Images"}
            </button>
          </div>
          {form.images?.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {form.images.map((url: string) => (
                <div key={url} className="card p-2 flex flex-col gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="product" className="w-full h-28 object-cover rounded-md" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </form>
    </section>
  );
}

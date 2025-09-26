"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COLOR_OPTIONS } from "@/lib/colors";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: 0,
    stock: 0,
    category: "",
    featured: false,
    color: "",
    sku: "",
    images: "",
    description: "",
    launch_at: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const images = form.images
      .split(/\n|,/) // allow commas or new lines
      .map((s) => s.trim())
      .filter(Boolean);
    const finalImages = [...uploadedUrls, ...images];

    const res = await fetch("/api/products", {
      method: "POST",
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
        images: finalImages,
        description: form.description,
        launch_at: form.launch_at ? new Date(form.launch_at).toISOString() : undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      alert(data.error || "Failed to create product");
      return;
    }
    router.push("/products");
  }

  return (
    <section className="grid gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-medium">Add Product</h1>
        <p className="text-sm text-muted mt-1">Create a new product</p>
      </div>

      <form onSubmit={onSubmit} className="card p-6 grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" className="rounded-xl px-4 py-3 border border-black/10" onChange={onChange} required />
          <input name="slug" placeholder="Slug (unique)" className="rounded-xl px-4 py-3 border border-black/10" onChange={onChange} required />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="price" type="number" step="0.01" placeholder="Price (in rupees)" className="rounded-xl px-4 py-3 border border-black/10" onChange={onChange} required />
          <input name="stock" type="number" placeholder="Stock" className="rounded-xl px-4 py-3 border border-black/10" onChange={onChange} />
          <input name="sku" placeholder="SKU" className="rounded-xl px-4 py-3 border border-black/10" onChange={onChange} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="category" placeholder="Category" className="rounded-xl px-4 py-3 border border-black/10" onChange={onChange} />
          <select name="color" className="rounded-xl px-4 py-3 border border-black/10" onChange={onChange} defaultValue="">
            <option value="" disabled>Color</option>
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" onChange={onChange} /> Featured</label>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm text-muted flex flex-col">
            <span className="mb-2">Launch date & time</span>
            <input name="launch_at" type="datetime-local" className="rounded-xl px-4 py-3 border border-black/10" onChange={onChange} />
          </label>
        </div>
        <textarea name="description" placeholder="Description" className="rounded-xl px-4 py-3 border border-black/10 min-h-28" onChange={onChange} />
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <input id="file-input" type="file" multiple accept="image/*" className="rounded-xl px-4 py-3 border border-black/10" />
            <button
              type="button"
              className="btn btn-ghost"
              disabled={uploading}
              onClick={async () => {
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
                setUploadedUrls((u) => [...u, ...(data.urls || [])]);
                el.value = "";
              }}
            >
              {uploading ? "Uploading…" : "Upload Images"}
            </button>
          </div>
          {uploadedUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {uploadedUrls.map((url) => (
                <div key={url} className="card p-2 flex flex-col gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="uploaded" className="w-full h-28 object-cover rounded-md" />
                  <button type="button" className="btn btn-ghost" onClick={() => setUploadedUrls((u) => u.filter((x) => x !== url))}>Remove</button>
                </div>
              ))}
            </div>
          )}
          <textarea name="images" placeholder="Or paste image URLs (comma or newline separated)" className="rounded-xl px-4 py-3 border border-black/10 min-h-28" onChange={onChange} />
        </div>
        <div className="flex gap-3">
          <button className="btn btn-primary" disabled={loading} type="submit">{loading ? "Creating…" : "Create Product"}</button>
        </div>
      </form>
    </section>
  );
}

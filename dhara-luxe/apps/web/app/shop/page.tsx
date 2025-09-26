import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabaseServer";
import ShopFilters from "@/components/ShopFilters";
import WishlistButton from "@/components/WishlistButton";

async function getProducts(filters: { category?: string; color?: string; minPrice?: number; maxPrice?: number; }) {
  const supabase = getSupabaseServer();
  let query = supabase
    .from("products")
    .select("id,name,slug,price,images,category,featured,color")
    .order("featured", { ascending: false })
    .order("launch_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.color) query = query.eq("color", filters.color);
  if (typeof filters.minPrice === "number") query = query.gte("price", filters.minPrice);
  if (typeof filters.maxPrice === "number") query = query.lte("price", filters.maxPrice);

  const { data } = await query;
  return data || [];
}

export default async function ShopPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const color = typeof searchParams.color === "string" ? searchParams.color : undefined;
  const minPrice = typeof searchParams.minPrice === "string" ? Number(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number(searchParams.maxPrice) : undefined;

  const items = await getProducts({ category, color, minPrice, maxPrice });
  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="container-luxe py-16 md:py-24">
      <div className="flex items-end justify-between gap-6 mb-8">
        <h1 className="font-serif text-4xl">Shop</h1>
      </div>
      <ShopFilters />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((p: any) => {
          let img = "/hero.svg";
          const raw = p.images as any;
          if (Array.isArray(raw) && raw.length > 0) img = raw[0];
          else if (typeof raw === "string") {
            const t = raw.trim();
            if (t.startsWith("[") && t.endsWith("]")) {
              try { const arr = JSON.parse(t); if (Array.isArray(arr) && arr[0]) img = arr[0]; } catch {}
            } else if (t.includes(",") || t.includes("\n")) {
              const arr = t.split(/\n|,/).map((s: string) => s.trim()).filter(Boolean);
              if (arr[0]) img = arr[0];
            } else if (t) { img = t; }
          }
          return (
          <div key={p.id} className="group block">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-black/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2">
                <WishlistButton productId={p.id} />
              </div>
              <Link href={`/product/${p.slug}`} className="absolute inset-0" aria-label={p.name} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm">{p.name}</p>
              <p className="text-sm">₹{fmt.format(p.price)}</p>
            </div>
          </div>
        );})}
        {items.length === 0 && (
          <p className="text-muted col-span-full">No products available yet.</p>
        )}
      </div>
    </section>
  );
}

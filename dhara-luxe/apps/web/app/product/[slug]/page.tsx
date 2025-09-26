import { getSupabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";
import ImageGallery from "@/components/ImageGallery";

async function getProduct(slug: string) {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,price,description,images,stock,category,featured,sku,color")
    .eq("slug", slug)
    .single();
  return data as any | null;
}

async function getRelated(category: string, excludeId: string) {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,price,images")
    .eq("category", category)
    .neq("id", excludeId)
    .limit(4);
  return data || [];
}

async function getSuggestions(excludeIds: string[]) {
  const supabase = getSupabaseServer();
  let query = supabase
    .from("products")
    .select("id,name,slug,price,images,featured,created_at")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8);
  const { data } = await query;
  const set = new Set(excludeIds);
  return (data || []).filter((p: any) => !set.has(p.id));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!product) {
    return (
      <section className="container-luxe py-20">
        <h1 className="font-serif text-3xl mb-2">Product not found</h1>
        <p className="text-muted">This item may have been moved or is unavailable.</p>
        <div className="mt-6"><Link className="btn btn-ghost" href="/shop">Back to Shop</Link></div>
      </section>
    );
  }

  // Normalize images: handle jsonb array, text[], comma/newline separated string, or single string
  let images: string[] = [];
  const raw = (product as any).images;
  if (Array.isArray(raw)) {
    images = raw as string[];
  } else if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try { images = JSON.parse(trimmed); } catch { images = []; }
    } else if (trimmed.includes(",") || trimmed.includes("\n")) {
      images = trimmed.split(/\n|,/).map((s) => s.trim()).filter(Boolean);
    } else if (trimmed) {
      images = [trimmed];
    }
  }
  if (images.length === 0) images = ["/hero.svg"]; 
  const related = product.category ? await getRelated(product.category, product.id) : [];
  const suggestions = await getSuggestions([product.id, ...related.map((r: any) => r.id)]);

  return (
    <>
    <section className="container-luxe py-12 md:py-20 grid md:grid-cols-2 gap-12">
      {/* Gallery */}
      <ImageGallery images={images} alt={product.name} />

      {/* Details */}
      <div>
        <p className="text-xs tracking-wide uppercase text-muted">{product.category}</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">{product.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          {product.color && (
            <span className="text-xs px-3 py-1 rounded-full border border-black/10 bg-white">{product.color}</span>
          )}
          {product.sku && (
            <span className="text-xs text-muted">SKU: {product.sku}</span>
          )}
        </div>
        <p className="mt-4 text-2xl">₹{fmt.format(product.price)}</p>
        <p className="mt-2 text-sm {product.stock > 0 ? '' : 'text-red-600'}">
          {product.stock > 0 ? `In stock · ${product.stock} available` : "Out of stock"}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <AddToCart id={product.id} name={product.name} price={product.price} image={images[0]} />
          <WishlistButton productId={product.id} />
        </div>

        <div className="mt-8 prose prose-sm max-w-none">
          <p className="text-muted">{product.description}</p>
        </div>

        <div className="mt-10">
          <Link href="/shop" className="underline">Continue shopping</Link>
        </div>
      </div>
    </section>
    {related.length > 0 && (
      <section className="container-luxe py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl">You may also like</h2>
          <Link href="/shop" className="underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((p: any) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group block">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-black/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={(p.images && p.images[0]) || "/hero.svg"} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <span>₹{fmt.format(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )}
    {suggestions.length > 0 && (
      <section className="container-luxe py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl">Our picks for you</h2>
          <Link href="/shop" className="underline">Browse more</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {suggestions.map((p: any) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group block">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-black/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={(p.images && p.images[0]) || "/hero.svg"} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <span>₹{fmt.format(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )}
    </>
  );

}

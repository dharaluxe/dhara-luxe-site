import Link from "next/link";

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/products`, {
    // Force server fetch in dev; in prod you can add revalidate
    cache: "no-store",
  });
  if (!res.ok) return { items: [] } as any;
  return res.json();
}

export default async function ProductsPage() {
  const data = await getProducts();
  const items: any[] = data.items || [];
  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Products</h1>
          <p className="text-sm text-muted mt-1">Manage your catalog</p>
        </div>
        <Link href="/products/new" className="btn btn-primary">Add Product</Link>
      </div>

      <div className="overflow-x-auto card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-[color:var(--surface-border)]">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">₹{fmt.format(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{p.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/products/${p.id}`} className="btn btn-ghost px-3 py-1.5 rounded-full">View</Link>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={6}>No products yet. Click "Add Product" to create one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dhara Luxe — Admin</h1>
        <p className="text-sm text-gray-600">Manage products, orders, and waitlist</p>
      </header>

      <nav className="space-x-4 mb-6">
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/waitlist">Waitlist</Link>
      </nav>

      <section>
        <p>Use Supabase admin features + this dashboard for quick edits.</p>
      </section>
    </div>
  );
}

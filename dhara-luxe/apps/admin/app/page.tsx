import Link from "next/link";

export default function Home() {
  return (
    <section className="grid gap-8">
      <div>
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Overview of activity</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <p className="text-sm text-muted">Orders (Today)</p>
          <p className="mt-2 text-2xl font-medium">12</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-muted">Revenue</p>
          <p className="mt-2 text-2xl font-medium">₹1,24,500</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-muted">Products</p>
          <p className="mt-2 text-2xl font-medium">48</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-muted">Waitlist</p>
          <p className="mt-2 text-2xl font-medium">312</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-medium mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/products/new" className="btn btn-primary">Add Product</Link>
            <Link href="/orders" className="btn btn-ghost px-4 py-3 rounded-full">View Orders</Link>
            <Link href="/waitlist" className="btn btn-ghost px-4 py-3 rounded-full">View Waitlist</Link>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-medium mb-3">Recent Orders</h2>
          <ul className="text-sm text-muted">
            <li>#ORD-1024 • Paid • ₹8,990</li>
            <li>#ORD-1023 • Pending • ₹12,490</li>
            <li>#ORD-1022 • Shipped • ₹18,990</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

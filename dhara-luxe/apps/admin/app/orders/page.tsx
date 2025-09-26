import Link from "next/link";
import OrdersTable from "@/components/OrdersTable";

async function getOrders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/orders`, { cache: "no-store" });
  if (!res.ok) return { items: [] } as any;
  return res.json();
}

export default async function OrdersPage() {
  const data = await getOrders();
  const items: any[] = data.items || [];
  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-2xl font-medium">Orders</h1>
        <p className="text-sm text-muted mt-1">Recent orders</p>
      </div>
      <OrdersTable items={items} />
    </section>
  );
}

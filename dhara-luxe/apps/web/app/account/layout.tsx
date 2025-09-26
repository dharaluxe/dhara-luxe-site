import AccountGuard from "@/components/AccountGuard";
import Link from "next/link";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountGuard>
      <section className="container-luxe py-12 md:py-20 grid md:grid-cols-4 gap-8">
        <aside className="card p-4 h-fit">
          <nav className="grid gap-2 text-sm">
            <Link href="/account/profile" className="hover:opacity-80">Profile</Link>
            <Link href="/account/orders" className="hover:opacity-80">Orders</Link>
            <Link href="/account/addresses" className="hover:opacity-80">Addresses</Link>
            <Link href="/account/wishlist" className="hover:opacity-80">Wishlist</Link>
          </nav>
        </aside>
        <div className="md:col-span-3">
          {children}
        </div>
      </section>
    </AccountGuard>
  );
}

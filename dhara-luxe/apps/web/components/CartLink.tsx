"use client";

import Link from "next/link";
import { useCart } from "@/contexts/cart";

export default function CartLink() {
  const { items } = useCart();
  const count = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <Link href="/cart" className="relative hover:opacity-80">
      <span>Cart</span>
      {count > 0 && (
        <span
          className="absolute -top-2 -right-3 inline-flex items-center justify-center text-[10px] min-w-5 h-5 px-1 rounded-full bg-brand text-brand-contrast shadow"
          aria-label={`${count} items in cart`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

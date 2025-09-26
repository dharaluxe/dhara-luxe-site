"use client";

import React from "react";
import { CartProvider } from "@/contexts/cart";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

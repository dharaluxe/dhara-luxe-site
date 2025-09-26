"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const COLOR_OPTIONS = [
  "",
  "Ecru",
  "Terra",
  "Forest",
  "Noir",
  "Sand",
  "Clay",
  "Cocoa",
  "Olive",
  "Burgundy",
  "Slate",
  "Blush",
  "Gold",
];

export default function ShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [category, setCategory] = useState(sp.get("category") || "");
  const [color, setColor] = useState(sp.get("color") || "");
  const [minPrice, setMinPrice] = useState(sp.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(sp.get("maxPrice") || "");

  const hasActive = useMemo(
    () => Boolean(category || color || minPrice || maxPrice),
    [category, color, minPrice, maxPrice]
  );

  function apply() {
    const params = new URLSearchParams(sp.toString());
    if (category) params.set("category", category); else params.delete("category");
    if (color) params.set("color", color); else params.delete("color");
    if (minPrice) params.set("minPrice", String(Number(minPrice) || "")); else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", String(Number(maxPrice) || "")); else params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    setCategory("");
    setColor("");
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams(sp.toString());
    ["category", "color", "minPrice", "maxPrice"].forEach((k) => params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="card p-4 mb-8 grid gap-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <input
          placeholder="Category"
          className="rounded-xl px-4 py-3 border border-black/10"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select
          className="rounded-xl px-4 py-3 border border-black/10"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          {COLOR_OPTIONS.map((c) => (
            <option key={c || "all"} value={c}>{c || "Any Color"}</option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Min Price (₹)"
          className="rounded-xl px-4 py-3 border border-black/10"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Max Price (₹)"
          className="rounded-xl px-4 py-3 border border-black/10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1" onClick={apply}>Apply</button>
          {hasActive && (
            <button className="btn btn-ghost" onClick={clearAll}>Clear</button>
          )}
        </div>
      </div>
    </div>
  );
}

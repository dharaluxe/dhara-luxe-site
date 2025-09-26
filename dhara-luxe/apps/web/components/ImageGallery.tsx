"use client";

import { useState } from "react";

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const safe = images && images.length > 0 ? images : ["/hero.svg"];
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="group relative aspect-[4/5] rounded-[var(--radius)] overflow-hidden border border-black/10 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safe[active]}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      {safe.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {safe.map((url, idx) => (
            <button
              key={url + idx}
              onClick={() => setActive(idx)}
              className={`aspect-square rounded-lg overflow-hidden border ${
                idx === active ? "border-emerald-700" : "border-black/10"
              } bg-white`}
              aria-pressed={idx === active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

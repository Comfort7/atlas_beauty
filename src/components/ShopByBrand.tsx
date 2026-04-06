"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
};

export default function ShopByBrand() {
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/brands");
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error("Could not load brands");
        const list = json.data as BrandRow[];
        if (!cancelled) setBrands(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setErr("Brands unavailable");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(s));
  }, [brands, q]);

  return (
    <div>
      <h3 className="font-headline text-lg mb-4 text-on-surface">Shop by brand</h3>
      <label className="sr-only" htmlFor="brand-search">
        Search brands
      </label>
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
          search
        </span>
        <input
          id="brand-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a brand name…"
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg py-2.5 pl-10 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
        />
      </div>
      {err ? (
        <p className="text-xs text-on-surface-variant">{err}</p>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <li className="text-xs text-on-surface-variant">
              {brands.length === 0 ? "No brands in catalog yet." : "No matches."}
            </li>
          ) : (
            filtered.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/shop?brand=${encodeURIComponent(b.slug)}`}
                  className="flex justify-between items-center text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span>{b.name}</span>
                  {b._count?.products != null && (
                    <span className="text-[10px] opacity-50">{b._count.products}</span>
                  )}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

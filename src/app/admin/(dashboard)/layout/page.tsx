"use client";

import { useEffect, useMemo, useState } from "react";

type ProductItem = {
  id: string;
  name: string;
  category: { name: string; slug: string } | null;
  basePrice: number | string;
  images: Array<{ url: string; altText: string | null }>;
  variants: Array<{ price: number | string; name: string }>;
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
};

type LayoutResponse = {
  featuredProductIds: string[];
  categoryRouteMap: Record<string, string>;
  bannerZoneMap: Record<string, string>;
  products: ProductItem[];
  categories: CategoryItem[];
  routeOptions: string[];
  bannerZoneSourceOptions: string[];
  bannerZones: Array<{ id: string; label: string }>;
};

const zoneGroupOrder = ["home", "cart", "category", "product"] as const;

const zoneGroupMeta: Record<
  (typeof zoneGroupOrder)[number],
  { title: string; note: string; preview: string[] }
> = {
  home: {
    title: "Homepage",
    note: "Control banner slots above and below the featured products section.",
    preview: ["Hero", "Top Banner", "Products Grid", "After Products Banner"],
  },
  cart: {
    title: "Cart Page",
    note: "Control banner slots at top, coupon area, and below order sections.",
    preview: ["Top Banner", "Coupon Banner", "Cart Items + Summary", "Bottom Banner"],
  },
  category: {
    title: "Category Pages",
    note: "Applies to skincare, bodycare, and fragrance listing pages.",
    preview: ["Top Banner", "Category Header + Products", "Bottom Banner"],
  },
  product: {
    title: "Product Page",
    note: "Show promotion messaging before or after product detail content.",
    preview: ["Top Banner", "Product Detail", "Bottom Banner"],
  },
};

function sourceLabel(source: string) {
  switch (source) {
    case "HOME":
      return "Use HOME banners";
    case "CART":
      return "Use CART banners";
    case "COUPON":
      return "Use COUPON banners";
    default:
      return "Hide banner";
  }
}

export default function AdminHomepageLayoutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categoryRouteMap, setCategoryRouteMap] = useState<Record<string, string>>({});
  const [routeOptions, setRouteOptions] = useState<string[]>([]);
  const [bannerZoneMap, setBannerZoneMap] = useState<Record<string, string>>({});
  const [bannerZoneSourceOptions, setBannerZoneSourceOptions] = useState<string[]>([]);
  const [bannerZones, setBannerZones] = useState<Array<{ id: string; label: string }>>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/v1/admin/layout/homepage", { cache: "no-store" });
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error?.message || "Failed to load homepage layout");
        const data = body.data as LayoutResponse;
        if (!mounted) return;
        setProducts(data.products || []);
        setSelectedIds((data.featuredProductIds || []).slice(0, 8));
        setCategories(data.categories || []);
        setCategoryRouteMap(data.categoryRouteMap || {});
        setRouteOptions(data.routeOptions || []);
        setBannerZoneMap(data.bannerZoneMap || {});
        setBannerZoneSourceOptions(data.bannerZoneSourceOptions || []);
        setBannerZones(data.bannerZones || []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load homepage layout");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is ProductItem => Boolean(p)),
    [products, selectedIds]
  );

  function toggleProduct(id: string) {
    setSuccess("");
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 8) return prev;
      return [...prev, id];
    });
  }

  function move(id: string, direction: -1 | 1) {
    setSelectedIds((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const clone = [...prev];
      [clone[idx], clone[nextIdx]] = [clone[nextIdx], clone[idx]];
      return clone;
    });
  }

  async function saveLayout() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/layout/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featuredProductIds: selectedIds,
          categoryRouteMap,
          bannerZoneMap,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message || "Failed to save homepage layout");
      setSuccess("Homepage layout and category routing updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save homepage layout");
    } finally {
      setSaving(false);
    }
  }

  function updateCategoryRoute(slug: string, route: string) {
    setCategoryRouteMap((prev) => ({ ...prev, [slug]: route }));
    setSuccess("");
  }

  function updateBannerZoneSource(zoneId: string, source: string) {
    setBannerZoneMap((prev) => ({ ...prev, [zoneId]: source }));
    setSuccess("");
  }

  const groupedZones = useMemo(() => {
    const groups = zoneGroupOrder.map((group) => ({
      key: group,
      ...zoneGroupMeta[group],
      zones: bannerZones.filter((z) => z.id.startsWith(`${group}.`)),
    }));
    return groups.filter((group) => group.zones.length > 0);
  }, [bannerZones]);

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Homepage Layout</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            Select and order the first 8 landing products
          </p>
        </div>
        <button
          onClick={saveLayout}
          disabled={saving || loading}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save layout"}
        </button>
      </header>

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-primary-container/30 text-primary px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-on-surface-variant">Loading layout options...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <section className="bg-surface rounded-xl border border-outline-variant/20 p-6">
                <h2 className="font-headline text-lg mb-4">Selected ({selectedIds.length}/8)</h2>
                {selectedProducts.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">No products selected yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedProducts.map((product, idx) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-3 border border-outline-variant/20 rounded-lg p-3"
                      >
                        <div>
                          <p className="font-bold text-sm text-on-surface">
                            {idx + 1}. {product.name}
                          </p>
                          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">
                            {product.category?.name ?? "General"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => move(product.id, -1)}
                            className="px-2 py-1 text-xs rounded border border-outline-variant/40"
                            title="Move up"
                          >
                            Up
                          </button>
                          <button
                            onClick={() => move(product.id, 1)}
                            className="px-2 py-1 text-xs rounded border border-outline-variant/40"
                            title="Move down"
                          >
                            Down
                          </button>
                          <button
                            onClick={() => toggleProduct(product.id)}
                            className="px-2 py-1 text-xs rounded border border-error/40 text-error"
                            title="Remove"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-surface rounded-xl border border-outline-variant/20 p-6">
                <h2 className="font-headline text-lg mb-4">All Active Products</h2>
                <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                  {products.map((product) => {
                    const checked = selectedIds.includes(product.id);
                    const blocked = !checked && selectedIds.length >= 8;
                    const price = Number(product.variants[0]?.price ?? product.basePrice).toFixed(2);
                    return (
                      <label
                        key={product.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
                          checked
                            ? "border-primary/40 bg-primary-container/20"
                            : "border-outline-variant/20"
                        } ${blocked ? "opacity-60" : "cursor-pointer"}`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-on-surface truncate">{product.name}</p>
                          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">
                            {product.category?.name ?? "General"} · ${price}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={blocked}
                          onChange={() => toggleProduct(product.id)}
                          className="w-4 h-4 accent-primary"
                        />
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>

            <section className="bg-surface rounded-xl border border-outline-variant/20 p-6">
              <h2 className="font-headline text-lg mb-2">Category Route Mapping</h2>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">
                Set where each category should route on storefront
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-lg border border-outline-variant/20 p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{category.name}</p>
                      <p className="text-[11px] uppercase tracking-wider text-on-surface-variant truncate">
                        {category.slug}
                      </p>
                    </div>
                    <select
                      value={categoryRouteMap[category.slug] || "/shop"}
                      onChange={(e) => updateCategoryRoute(category.slug, e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded-md px-2 py-1 text-xs"
                    >
                      {routeOptions.map((route) => (
                        <option key={route} value={route}>
                          {route}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface rounded-xl border border-outline-variant/20 p-6">
              <h2 className="font-headline text-lg mb-2">Banner Zone Mapping</h2>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">
                Visual page-based controls for non-technical banner placement
              </p>
              <div className="space-y-5">
                {groupedZones.map((group) => (
                  <div key={group.key} className="rounded-xl border border-outline-variant/20 overflow-hidden">
                    <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/20">
                      <h3 className="font-headline text-base text-on-surface">{group.title}</h3>
                      <p className="text-[11px] text-on-surface-variant mt-1">{group.note}</p>
                    </div>
                    <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-3">
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                          Mini Preview
                        </p>
                        <div className="space-y-2">
                          {group.preview.map((item) => (
                            <div
                              key={item}
                              className="rounded-md border border-outline-variant/20 bg-surface px-3 py-2 text-xs text-on-surface-variant"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {group.zones.map((zone) => {
                          const currentSource = bannerZoneMap[zone.id] || "NONE";
                          return (
                            <div
                              key={zone.id}
                              className="rounded-lg border border-outline-variant/20 p-3 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-on-surface">{zone.label}</p>
                                <p className="text-[11px] text-on-surface-variant mt-1">
                                  {sourceLabel(currentSource)}
                                </p>
                              </div>
                              <select
                                value={currentSource}
                                onChange={(e) => updateBannerZoneSource(zone.id, e.target.value)}
                                className="bg-surface-container-low border border-outline-variant rounded-md px-2 py-1 text-xs"
                              >
                                {bannerZoneSourceOptions.map((source) => (
                                  <option key={source} value={source}>
                                    {source}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}

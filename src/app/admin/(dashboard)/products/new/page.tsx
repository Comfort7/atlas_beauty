"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CategoryNode = {
  id: string;
  name: string;
  children?: CategoryNode[];
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([]);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value;

    const payload = {
      name: get("name"),
      slug: get("slug"),
      description: get("description"),
      shortDescription: get("shortDescription"),
      basePrice: get("basePrice"),
      compareAtPrice: get("compareAtPrice") || null,
      categoryId: get("categoryId"),
      ingredients: get("ingredients") || null,
      isFeatured: (form.elements.namedItem("isFeatured") as HTMLInputElement).checked,
      tags: get("tags").split(",").map((t) => t.trim()).filter(Boolean),
      variantName: get("variantName"),
      variantSku: get("variantSku"),
      variantPrice: get("variantPrice"),
      initialStock: parseInt(get("initialStock") || "0", 10),
      imageUrl: get("imageUrl") || null,
      imageAlt: get("imageAlt") || null,
    };

    try {
      const res = await fetch("/api/v1/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message || "Failed to create product");

      setSuccess(true);
      setTimeout(() => router.push("/admin/products"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      try {
        const res = await fetch("/api/v1/categories", { cache: "no-store" });
        const body = await res.json();
        if (!res.ok) return;
        const roots = (body.data || []) as CategoryNode[];
        const out: Array<{ id: string; label: string }> = [];
        const walk = (node: CategoryNode, prefix = "") => {
          out.push({ id: node.id, label: `${prefix}${node.name}` });
          (node.children || []).forEach((child) => walk(child, `${prefix}${node.name} / `));
        };
        roots.forEach((r) => walk(r));
        if (mounted) setCategories(out);
      } catch {
        // Keep form usable even if categories fail to load.
      }
    }
    void loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary block mb-4">
            check_circle
          </span>
          <h2 className="font-headline text-2xl text-on-surface mb-2">Product Created!</h2>
          <p className="text-on-surface-variant text-sm">Redirecting to products list…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link href="/admin/products" className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Add New Product</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">Fill in the details below</p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm">
              <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Product Name *</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Celestial Reset Serum"
                  onChange={(e) => {
                    const slugEl = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement;
                    if (slugEl) slugEl.value = generateSlug(e.target.value);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">URL Slug *</label>
                <input
                  name="slug"
                  required
                  placeholder="auto-generated from name"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Short Description</label>
              <input
                name="shortDescription"
                placeholder="One-line summary shown on product cards"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Full Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Detailed product description..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Category *</label>
              <select
                name="categoryId"
                required
                defaultValue=""
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-on-surface-variant">
                Only products in the right category will appear on its storefront page.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" name="isFeatured" className="w-4 h-4 accent-primary" />
              <span className="text-sm text-on-surface">Mark as featured product (shown on homepage)</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-outline-variant/20">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Main image URL (optional)
                </label>
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="https://… (HTTPS image for product gallery)"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
                />
                <p className="text-[10px] text-on-surface-variant">Shown on the storefront product page and in listings that use images.</p>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                  Image alt text (optional)
                </label>
                <input
                  name="imageAlt"
                  placeholder="Short description for accessibility"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Base Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input
                    name="basePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-7 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Compare At Price (optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-7 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* First Variant */}
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <div className="border-b border-outline-variant/20 pb-3">
              <h2 className="font-headline text-lg text-on-surface">Default Variant & Stock</h2>
              <p className="text-xs text-on-surface-variant mt-1">Every product needs at least one variant (e.g. "30ml", "Standard").</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Variant Name *</label>
                <input
                  name="variantName"
                  required
                  placeholder="e.g. 30ml"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">SKU *</label>
                <input
                  name="variantSku"
                  required
                  placeholder="e.g. AB-SRM-30ML"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Variant Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input
                    name="variantPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-7 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5 max-w-xs">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Initial Stock Quantity *</label>
              <input
                name="initialStock"
                type="number"
                min="0"
                required
                defaultValue="0"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Extra */}
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Additional Details</h2>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Ingredients / Formula</label>
                <textarea
                name="ingredients"
                rows={3}
                placeholder="Aqua, Niacinamide, Hyaluronic Acid..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Tags (comma separated)</label>
              <input
                name="tags"
                placeholder="e.g. serum, hydrating, vitamin-c"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pb-8">
            <Link href="/admin/products" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-lg font-bold text-sm tracking-wide hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Creating…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">add_box</span>
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

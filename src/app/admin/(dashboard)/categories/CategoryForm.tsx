"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type CategoryInitial = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
};

export type CategoryOption = { id: string; name: string };

export default function CategoryForm({
  initial,
  parentOptions,
}: {
  initial?: CategoryInitial;
  parentOptions: CategoryOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(initial);
  const availableParents = parentOptions.filter((p) => p.id !== initial?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value.trim();

    const payload = {
      name: get("name"),
      description: get("description") || undefined,
      image: get("image") || undefined,
      parentId: get("parentId") || null,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/v1/categories/${initial!.id}` : "/api/v1/categories",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to save category");
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link
          href="/admin/categories"
          className="text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline text-2xl text-on-surface">
            {isEdit ? "Edit Category" : "Add Category"}
          </h1>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm">
              <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
              {error}
            </div>
          )}

          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                Name *
              </label>
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                defaultValue={initial?.name ?? ""}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                Parent category
              </label>
              <select
                name="parentId"
                defaultValue={initial?.parentId ?? ""}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">None (top level)</option>
                {availableParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                maxLength={500}
                defaultValue={initial?.description ?? ""}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                Image URL
              </label>
              <input
                name="image"
                type="url"
                placeholder="https://…"
                defaultValue={initial?.image ?? ""}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pb-8">
            <Link
              href="/admin/categories"
              className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-lg font-bold text-sm tracking-wide hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">
                    progress_activity
                  </span>
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  {isEdit ? "Save changes" : "Create category"}
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

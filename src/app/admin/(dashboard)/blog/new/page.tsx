"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

  function generateSlug(title: string) {
    return title
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
      title: get("title"),
      slug: get("slug"),
      excerpt: get("excerpt"),
      content: get("content"),
      coverImage: get("coverImage") || null,
      tags: get("tags").split(",").map((t) => t.trim()).filter(Boolean),
      status,
    };

    try {
      const res = await fetch("/api/v1/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message || "Failed to create post");

      setSuccess(true);
      setTimeout(() => router.push("/admin/blog"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary block mb-4">check_circle</span>
          <h2 className="font-headline text-2xl text-on-surface mb-2">Post {status === "PUBLISHED" ? "Published" : "Saved as Draft"}!</h2>
          <p className="text-on-surface-variant text-sm">Redirecting to blog list…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-surface border-b border-outline-variant/20 px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link href="/admin/blog" className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline text-2xl text-on-surface">Write New Post</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">
            Craft your journal article
          </p>
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

          {/* Header Info */}
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Post Details</h2>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                Title *
              </label>
              <input
                name="title"
                required
                placeholder="e.g. The Atlas Guide to Layering Actives"
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
                placeholder="auto-generated from title"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Excerpt</label>
              <textarea
                name="excerpt"
                rows={2}
                placeholder="A brief summary shown on the journal listing page..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Cover Image URL</label>
              <input
                name="coverImage"
                type="url"
                placeholder="https://..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Tags (comma separated)</label>
              <input
                name="tags"
                placeholder="e.g. skincare, routines, ingredients"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3">Article Content</h2>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
                Content * (supports Markdown)
              </label>
              <textarea
                name="content"
                required
                rows={18}
                placeholder={`# Your article title\n\nWrite your article here. You can use **Markdown** formatting.\n\n## Section One\n\nYour content goes here...`}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none font-mono leading-relaxed"
              />
              <p className="text-[10px] text-on-surface-variant">
                Markdown is supported. The content will be rendered on the journal page.
              </p>
            </div>
          </div>

          {/* Publish Options */}
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-6">
            <h2 className="font-headline text-lg text-on-surface border-b border-outline-variant/20 pb-3 mb-4">Publish Settings</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStatus("DRAFT")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                  status === "DRAFT"
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus("PUBLISHED")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                  status === "PUBLISHED"
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                Publish Now
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-3">
              {status === "DRAFT"
                ? "Draft posts are saved but not visible on the journal page."
                : "Published posts are immediately visible on the journal page."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pb-8">
            <Link href="/admin/blog" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
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
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">
                    {status === "PUBLISHED" ? "publish" : "save"}
                  </span>
                  {status === "PUBLISHED" ? "Publish Post" : "Save Draft"}
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

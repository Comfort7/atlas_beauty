"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
  userName: string | null;
  userEmail: string;
  productName: string;
  productSlug: string;
};

export default function ReviewModerationCard({ review }: { review: Review }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [error, setError] = useState("");
  const [resolved, setResolved] = useState<"APPROVED" | "REJECTED" | null>(null);

  async function moderate(status: "APPROVED" | "REJECTED") {
    setLoading(status);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update review");
      setResolved(status);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  if (resolved) {
    return (
      <div className="bg-surface rounded-xl border border-outline-variant/20 p-6 opacity-50">
        <p className="text-sm text-on-surface-variant">
          Marked as {resolved === "APPROVED" ? "approved" : "rejected"}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-outline-variant/20 p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <Link
            href={`/products/${review.productSlug}`}
            target="_blank"
            className="text-sm font-bold text-primary hover:underline"
          >
            {review.productName}
          </Link>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {review.userName || review.userEmail} ·{" "}
            {new Date(review.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {review.verifiedPurchase && (
              <span className="ml-2 text-primary font-bold">Verified purchase</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-sm ${
                i < review.rating ? "text-tertiary" : "text-outline-variant"
              }`}
              style={i < review.rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              star
            </span>
          ))}
        </div>
      </div>

      {review.title && (
        <p className="text-sm font-bold text-on-surface mb-1">{review.title}</p>
      )}
      <p className="text-sm text-on-surface-variant leading-relaxed">{review.body}</p>

      {error && <p className="text-xs text-error mt-3">{error}</p>}

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={() => moderate("APPROVED")}
          disabled={loading !== null}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary py-2 rounded-lg text-sm font-bold disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-sm">check</span>
          {loading === "APPROVED" ? "Approving…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => moderate("REJECTED")}
          disabled={loading !== null}
          className="flex-1 flex items-center justify-center gap-2 border border-error text-error py-2 rounded-lg text-sm font-bold disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-sm">close</span>
          {loading === "REJECTED" ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBrandButton({ brandId }: { brandId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/brands/${brandId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete brand");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="text-[10px] font-bold text-error hover:underline disabled:opacity-50"
        >
          {loading ? "…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-[10px] text-on-surface-variant hover:text-on-surface"
        >
          Cancel
        </button>
        {error && <span className="text-[10px] text-error ml-1">{error}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-on-surface-variant hover:text-error transition-colors"
      title="Delete brand"
    >
      <span className="material-symbols-outlined text-sm">delete</span>
    </button>
  );
}

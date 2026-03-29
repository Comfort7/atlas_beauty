"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateStockForm({
  variantId,
  currentQty,
}: {
  variantId: string;
  currentQty: number;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(String(currentQty));
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleUpdate() {
    const newQty = parseInt(qty, 10);
    if (isNaN(newQty) || newQty < 0) return;
    setLoading(true);

    try {
      await fetch(`/api/v1/admin/inventory/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        className="w-16 bg-surface-container-low border border-outline-variant rounded px-2 py-1 text-sm text-on-surface focus:outline-none focus:border-primary text-center"
      />
      <button
        onClick={handleUpdate}
        disabled={loading || qty === String(currentQty)}
        className={`text-xs px-2 py-1 rounded font-bold transition-all ${
          saved
            ? "bg-primary-container/30 text-primary"
            : "bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
        ) : saved ? (
          <span className="material-symbols-outlined text-xs">check</span>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );
}

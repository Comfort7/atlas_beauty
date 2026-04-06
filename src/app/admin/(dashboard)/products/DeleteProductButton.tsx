"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ productId: id }: { productId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/v1/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
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
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-on-surface-variant hover:text-error transition-colors"
      title="Remove from storefront (deactivate)"
    >
      <span className="material-symbols-outlined text-sm">delete</span>
    </button>
  );
}

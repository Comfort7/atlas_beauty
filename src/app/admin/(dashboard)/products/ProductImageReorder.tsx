"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Img = { id: string; position: number; url: string };

export default function ProductImageReorder({ productId, images }: { productId: string; images: Img[] }) {
  const router = useRouter();
  const [ids, setIds] = useState(() => [...images].sort((a, b) => a.position - b.position).map((i) => i.id));
  const [saving, setSaving] = useState(false);

  if (images.length < 2) return null;

  async function persist(order: string[]) {
    setSaving(true);
    try {
      await fetch(`/api/v1/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageOrder: order }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    const next = [...ids];
    [next[i], next[j]] = [next[j], next[i]];
    setIds(next);
    void persist(next);
  }

  return (
    <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/50 p-3">
      <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
        Image order (first = hero)
      </p>
      <ul className="space-y-2">
        {ids.map((id, i) => {
          const img = images.find((x) => x.id === id);
          return (
            <li key={id} className="flex items-center gap-2 text-xs">
              <span className="w-5 text-on-surface-variant">{i + 1}.</span>
              <span className="flex-1 truncate font-mono text-[10px] text-on-surface-variant">{img?.url ?? id}</span>
              <button
                type="button"
                disabled={saving || i === 0}
                onClick={() => move(i, -1)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container hover:text-primary disabled:opacity-30"
                title="Move up"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
              <button
                type="button"
                disabled={saving || i === ids.length - 1}
                onClick={() => move(i, 1)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container hover:text-primary disabled:opacity-30"
                title="Move down"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

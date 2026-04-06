"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PromoBannerPlacement } from "@prisma/client";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  autoplayMs: number;
};

type Props = {
  placement: PromoBannerPlacement;
  className?: string;
};

export default function PromoBannerStrip({ placement, className = "" }: Props) {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v1/promo-banners?placement=${placement}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const list = json?.success && Array.isArray(json.data) ? json.data : [];
        setSlides(list);
      })
      .catch(() => {
        if (!cancelled) setSlides([]);
      });
    return () => {
      cancelled = true;
    };
  }, [placement]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [slides]);

  const advance = useCallback(() => {
    setIdx((i) => (slides.length ? (i + 1) % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const ms = Math.max(0, slides[idx]?.autoplayMs ?? 6000);
    if (ms === 0) return;
    const t = setTimeout(() => advance(), ms);
    return () => clearTimeout(t);
  }, [slides, idx, advance]);

  if (slides.length === 0) return null;

  const s = slides[idx];

  const body = (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:min-h-[200px]">
      {s.imageUrl && (
        <div className="relative md:col-span-5 aspect-[16/10] md:aspect-auto md:min-h-[200px]">
          <Image src={s.imageUrl} alt={s.title} fill unoptimized className="object-cover" />
        </div>
      )}
      <div
        className={`flex flex-col justify-center p-8 md:p-10 ${s.imageUrl ? "md:col-span-7" : "md:col-span-12"}`}
      >
        <h2 className="font-headline text-2xl md:text-3xl text-on-surface tracking-tight">{s.title}</h2>
        {s.subtitle && (
          <p className="mt-3 font-body text-sm md:text-base text-on-surface-variant leading-relaxed max-w-xl">
            {s.subtitle}
          </p>
        )}
        {s.linkUrl && s.linkLabel && (
          <span className="mt-6 inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            {s.linkLabel}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        )}
      </div>
    </div>
  );

  const wrapClass = `w-full ${className}`;

  const card = (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-gradient-to-br from-primary-container/40 via-surface-container-low to-surface">
      {s.linkUrl ? (
        <Link href={s.linkUrl} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
          {body}
        </Link>
      ) : (
        body
      )}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIdx(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-8 bg-primary" : "w-2 bg-on-surface-variant/30 hover:bg-on-surface-variant/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return <section className={wrapClass}>{card}</section>;
}

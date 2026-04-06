import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BannerForm, { type BannerInitial } from "../../BannerForm";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const b = await prisma.promoBanner.findUnique({ where: { id } });
  if (!b) notFound();

  const initial: BannerInitial = {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle ?? "",
    imageUrl: b.imageUrl ?? "",
    linkUrl: b.linkUrl ?? "",
    linkLabel: b.linkLabel ?? "",
    sortOrder: b.sortOrder,
    isActive: b.isActive,
    autoplayMs: b.autoplayMs,
    placement: b.placement,
  };

  return <BannerForm initial={initial} backHref="/admin/coupons" />;
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CouponEditForm, { type CouponInitial } from "./CouponEditForm";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  const initial: CouponInitial = {
    id: coupon.id,
    code: coupon.code,
    description: coupon.description,
    type: coupon.type,
    value: Number(coupon.value),
    minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
    maxUses: coupon.maxUses,
    maxUsesPerUser: coupon.maxUsesPerUser,
    isActive: coupon.isActive,
    startsAt: coupon.startsAt,
    expiresAt: coupon.expiresAt,
  };

  return <CouponEditForm initial={initial} />;
}

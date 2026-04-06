import { NextRequest } from "next/server";
import { PromoBannerPlacement } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { successResponse, handleError } from "@/helpers/api-response";

/** Public: active promo banners for a placement (home, cart, coupon strip). */
export async function GET(request: NextRequest) {
  try {
    const raw = request.nextUrl.searchParams.get("placement") ?? "COUPON";
    const placement = Object.values(PromoBannerPlacement).includes(raw as PromoBannerPlacement)
      ? (raw as PromoBannerPlacement)
      : PromoBannerPlacement.COUPON;

    const banners = await prisma.promoBanner.findMany({
      where: { isActive: true, placement },
      orderBy: { sortOrder: "asc" },
    });

    return successResponse(banners);
  } catch (error) {
    return handleError(error);
  }
}

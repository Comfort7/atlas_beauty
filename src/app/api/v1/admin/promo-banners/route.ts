import { withAdmin } from "@/helpers/auth-guard";
import { handleError, successResponse, errorResponse } from "@/helpers/api-response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PromoBannerPlacement } from "@prisma/client";

const createBannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional().nullable(),
  imageUrl: z.string().max(2048).optional().nullable(),
  linkUrl: z.string().max(2048).optional().nullable(),
  linkLabel: z.string().max(80).optional().nullable(),
  sortOrder: z.coerce.number().int().optional().default(0),
  isActive: z.coerce.boolean().optional().default(true),
  autoplayMs: z.coerce.number().int().min(0).max(600_000).optional().default(6000),
  placement: z.enum(["HOME", "CART", "COUPON"]).optional().default("COUPON"),
});

function validateUrl(url: string | null | undefined, field: string) {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return `${field} must be http or https`;
    }
    return null;
  } catch {
    return `Invalid ${field}`;
  }
}

export const GET = withAdmin(async () => {
  try {
    const banners = await prisma.promoBanner.findMany({
      orderBy: [{ placement: "asc" }, { sortOrder: "asc" }],
    });
    return successResponse(banners);
  } catch (error) {
    return handleError(error);
  }
});

export const POST = withAdmin(async (request) => {
  try {
    const body = await request.json();
    const parsed = createBannerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        400,
        "VALIDATION_ERROR"
      );
    }

    const d = parsed.data;
    const imgErr = validateUrl(d.imageUrl, "image URL");
    if (imgErr) return errorResponse(imgErr, 400, "VALIDATION_ERROR");
    const linkErr = validateUrl(d.linkUrl, "link URL");
    if (linkErr) return errorResponse(linkErr, 400, "VALIDATION_ERROR");

    const banner = await prisma.promoBanner.create({
      data: {
        title: d.title,
        subtitle: d.subtitle?.trim() || null,
        imageUrl: d.imageUrl?.trim() || null,
        linkUrl: d.linkUrl?.trim() || null,
        linkLabel: d.linkLabel?.trim() || null,
        sortOrder: d.sortOrder,
        isActive: d.isActive,
        autoplayMs: d.autoplayMs,
        placement: d.placement as PromoBannerPlacement,
      },
    });

    return successResponse(banner, 201);
  } catch (error) {
    return handleError(error);
  }
});

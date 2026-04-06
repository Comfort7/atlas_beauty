import { withAdmin } from "@/helpers/auth-guard";
import { handleError, successResponse, errorResponse } from "@/helpers/api-response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PromoBannerPlacement } from "@prisma/client";

const updateBannerSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(500).optional().nullable(),
  imageUrl: z.string().max(2048).optional().nullable(),
  linkUrl: z.string().max(2048).optional().nullable(),
  linkLabel: z.string().max(80).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
  autoplayMs: z.coerce.number().int().min(0).max(600_000).optional(),
  placement: z.enum(["HOME", "CART", "COUPON"]).optional(),
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

export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateBannerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        400,
        "VALIDATION_ERROR"
      );
    }

    const d = parsed.data;
    if (Object.keys(d).length === 0) {
      return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
    }

    const imgErr = d.imageUrl !== undefined ? validateUrl(d.imageUrl, "image URL") : null;
    if (imgErr) return errorResponse(imgErr, 400, "VALIDATION_ERROR");
    const linkErr = d.linkUrl !== undefined ? validateUrl(d.linkUrl, "link URL") : null;
    if (linkErr) return errorResponse(linkErr, 400, "VALIDATION_ERROR");

    const existing = await prisma.promoBanner.findUnique({ where: { id } });
    if (!existing) return errorResponse("Banner not found", 404, "NOT_FOUND");

    const banner = await prisma.promoBanner.update({
      where: { id },
      data: {
        ...(d.title !== undefined && { title: d.title }),
        ...(d.subtitle !== undefined && { subtitle: d.subtitle?.trim() || null }),
        ...(d.imageUrl !== undefined && { imageUrl: d.imageUrl?.trim() || null }),
        ...(d.linkUrl !== undefined && { linkUrl: d.linkUrl?.trim() || null }),
        ...(d.linkLabel !== undefined && { linkLabel: d.linkLabel?.trim() || null }),
        ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
        ...(d.isActive !== undefined && { isActive: d.isActive }),
        ...(d.autoplayMs !== undefined && { autoplayMs: d.autoplayMs }),
        ...(d.placement !== undefined && { placement: d.placement as PromoBannerPlacement }),
      },
    });

    return successResponse(banner);
  } catch (error) {
    return handleError(error);
  }
});

export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    await prisma.promoBanner.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});

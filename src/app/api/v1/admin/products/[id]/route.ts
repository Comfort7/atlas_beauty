import { withAdmin } from "@/helpers/auth-guard";
import { handleError, successResponse, errorResponse } from "@/helpers/api-response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  shortDescription: z.string().optional().nullable(),
  basePrice: z.coerce.number().positive().optional(),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  categoryId: z.string().min(1).optional(),
  ingredients: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  variantName: z.string().min(1).optional(),
  variantSku: z.string().min(1).optional(),
  variantPrice: z.coerce.number().positive().optional(),
  initialStock: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().max(2048).optional().nullable(),
  imageAlt: z.string().max(200).optional().nullable(),
  /** Image IDs in display order (first = hero). All must belong to this product. */
  imageOrder: z.array(z.string()).optional(),
});

function validateImageUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return "Image URL must be http or https";
    }
    return null;
  } catch {
    return "Invalid image URL";
  }
}

export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

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

    const existing = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { createdAt: "asc" }, include: { inventory: true } },
        images: { orderBy: { position: "asc" } },
      },
    });

    if (!existing) {
      return errorResponse("Product not found", 404, "NOT_FOUND");
    }

    if (d.slug && d.slug !== existing.slug) {
      const clash = await prisma.product.findUnique({ where: { slug: d.slug } });
      if (clash) {
        return errorResponse("Another product already uses this slug", 409, "CONFLICT");
      }
    }

    const imageUrl = d.imageUrl !== undefined ? (d.imageUrl?.trim() || "") : undefined;
    if (imageUrl) {
      const err = validateImageUrl(imageUrl);
      if (err) return errorResponse(err, 400, "VALIDATION_ERROR");
    }

    const productData: Prisma.ProductUpdateInput = {};

    if (d.name !== undefined) productData.name = d.name;
    if (d.slug !== undefined) productData.slug = d.slug;
    if (d.description !== undefined) productData.description = d.description;
    if (d.shortDescription !== undefined) productData.shortDescription = d.shortDescription ?? undefined;
    if (d.basePrice !== undefined) productData.basePrice = d.basePrice;
    if (d.compareAtPrice !== undefined) productData.compareAtPrice = d.compareAtPrice ?? undefined;
    if (d.categoryId !== undefined) productData.category = { connect: { id: d.categoryId } };
    if (d.ingredients !== undefined) productData.ingredients = d.ingredients ?? undefined;
    if (d.isFeatured !== undefined) productData.isFeatured = d.isFeatured;
    if (d.isActive !== undefined) productData.isActive = d.isActive;
    if (d.tags !== undefined) productData.tags = d.tags;

    const primaryVariant = existing.variants[0];

    await prisma.$transaction(async (tx) => {
      if (Object.keys(productData).length > 0) {
        await tx.product.update({
          where: { id },
          data: productData,
        });
      }

      if (primaryVariant) {
        const vUpdate: Prisma.ProductVariantUpdateInput = {};
        if (d.variantName !== undefined) {
          vUpdate.name = d.variantName;
          vUpdate.options = { size: d.variantName };
        }
        if (d.variantSku !== undefined) vUpdate.sku = d.variantSku;
        if (d.variantPrice !== undefined) vUpdate.price = d.variantPrice;
        if (Object.keys(vUpdate).length > 0) {
          await tx.productVariant.update({
            where: { id: primaryVariant.id },
            data: vUpdate,
          });
        }
        if (d.initialStock !== undefined && primaryVariant.inventory) {
          await tx.inventory.update({
            where: { variantId: primaryVariant.id },
            data: { quantity: d.initialStock },
          });
        }
      }

      if (imageUrl !== undefined) {
        const sorted = [...existing.images].sort((a, b) => a.position - b.position);
        const first = sorted[0];
        const alt = d.imageAlt !== undefined ? d.imageAlt?.trim() || existing.name : undefined;
        if (imageUrl) {
          if (first) {
            await tx.productImage.update({
              where: { id: first.id },
              data: {
                url: imageUrl,
                altText: alt ?? first.altText ?? existing.name,
                publicId: `external-${existing.slug}-${Date.now()}`,
              },
            });
          } else {
            await tx.productImage.create({
              data: {
                productId: id,
                url: imageUrl,
                publicId: `external-${existing.slug}-${Date.now()}`,
                altText: alt ?? existing.name,
                position: 0,
              },
            });
          }
        }
      }

      if (d.imageAlt !== undefined && d.imageUrl === undefined) {
        const sorted = [...existing.images].sort((a, b) => a.position - b.position);
        const first = sorted[0];
        if (first) {
          await tx.productImage.update({
            where: { id: first.id },
            data: { altText: d.imageAlt?.trim() || existing.name },
          });
        }
      }

      if (d.imageOrder && d.imageOrder.length > 0) {
        const ids = new Set(existing.images.map((im) => im.id));
        const invalid = d.imageOrder.some((id) => !ids.has(id));
        if (invalid) {
          throw new Error("INVALID_IMAGE_ORDER");
        }
        const missing = existing.images.filter((im) => !d.imageOrder!.includes(im.id));
        const fullOrder = [...d.imageOrder, ...missing.map((m) => m.id)];
        for (let i = 0; i < fullOrder.length; i++) {
          await tx.productImage.update({
            where: { id: fullOrder[i] },
            data: { position: i },
          });
        }
      }
    });

    const updated = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: { include: { inventory: true } },
        images: { orderBy: { position: "asc" } },
        category: true,
        brand: true,
      },
    });

    return successResponse(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_IMAGE_ORDER") {
      return errorResponse("Invalid image order", 400, "VALIDATION_ERROR");
    }
    return handleError(error);
  }
});

/** Soft-delete: hides product from storefront (isActive = false). */
export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    return successResponse({ deleted: true, isActive: false });
  } catch (error) {
    return handleError(error);
  }
});

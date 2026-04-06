import { withAdmin } from "@/helpers/auth-guard";
import { handleError, successResponse, errorResponse } from "@/helpers/api-response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  shortDescription: z.string().optional().nullable(),
  basePrice: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  categoryId: z.string().min(1),
  ingredients: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  // First variant
  variantName: z.string().min(1),
  variantSku: z.string().min(1),
  variantPrice: z.coerce.number().positive(),
  initialStock: z.coerce.number().int().min(0).default(0),
  /** Optional main product image URL. Stored in product_images. Validated in handler. */
  imageUrl: z.string().max(2048).optional().nullable(),
  imageAlt: z.string().max(200).optional().nullable(),
});

export const POST = withAdmin(async (request) => {
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        400,
        "VALIDATION_ERROR"
      );
    }

    const d = parsed.data;

    const imageUrl = d.imageUrl?.trim() || "";
    if (imageUrl) {
      try {
        const u = new URL(imageUrl);
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          return errorResponse("Image URL must be http or https", 400, "VALIDATION_ERROR");
        }
      } catch {
        return errorResponse("Invalid image URL", 400, "VALIDATION_ERROR");
      }
    }

    const publicId = imageUrl ? `external-${d.slug}-${Date.now()}` : "";

    const product = await prisma.product.create({
      data: {
        name: d.name,
        slug: d.slug,
        description: d.description,
        shortDescription: d.shortDescription ?? undefined,
        basePrice: d.basePrice,
        compareAtPrice: d.compareAtPrice ?? undefined,
        categoryId: d.categoryId,
        ingredients: d.ingredients ?? undefined,
        isFeatured: d.isFeatured,
        tags: d.tags,
        ...(imageUrl
          ? {
              images: {
                create: {
                  url: imageUrl,
                  publicId: publicId,
                  altText: d.imageAlt?.trim() || d.name,
                  position: 0,
                },
              },
            }
          : {}),
        variants: {
          create: {
            name: d.variantName,
            sku: d.variantSku,
            price: d.variantPrice,
            options: { size: d.variantName },
            inventory: {
              create: {
                quantity: d.initialStock,
                lowStockThreshold: 10,
              },
            },
          },
        },
      },
      include: {
        variants: { include: { inventory: true } },
        images: true,
      },
    });

    return successResponse(product, 201);
  } catch (error) {
    return handleError(error);
  }
});

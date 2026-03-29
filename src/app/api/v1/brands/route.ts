import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { createUniqueSlug } from "@/helpers/slug";
import { brandSchema } from "./schema";

// GET /api/v1/brands
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    return successResponse(brands);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/brands - Admin only
export const POST = withAdmin(async (request) => {
  try {
    const result = await validateBody(request, brandSchema);
    if ("error" in result) return result.error;

    const slug = await createUniqueSlug(result.data.name, "brand");
    const brand = await prisma.brand.create({
      data: { ...result.data, slug },
    });

    return successResponse(brand, 201);
  } catch (error) {
    return handleError(error);
  }
});

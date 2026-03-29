import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { createUniqueSlug } from "@/helpers/slug";
import { invalidateCache } from "@/helpers/cache";
import { categorySchema } from "./schema";

// GET /api/v1/categories - Get category tree
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    return successResponse(categories);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/categories - Admin only
export const POST = withAdmin(async (request) => {
  try {
    const result = await validateBody(request, categorySchema);
    if ("error" in result) return result.error;

    const slug = await createUniqueSlug(result.data.name, "category");

    const category = await prisma.category.create({
      data: { ...result.data, slug },
    });

    await invalidateCache("categories:*");
    return successResponse(category, 201);
  } catch (error) {
    return handleError(error);
  }
});

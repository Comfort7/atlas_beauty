import { withAdmin } from "@/helpers/auth-guard";
import { handleError, successResponse, errorResponse } from "@/helpers/api-response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePostSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10).optional(),
  coverImage: z.string().max(2048).optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const PATCH = withAdmin(async (request, context) => {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updatePostSchema.safeParse(body);

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

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Post not found", 404, "NOT_FOUND");
    }

    if (d.slug && d.slug !== existing.slug) {
      const clash = await prisma.post.findUnique({ where: { slug: d.slug } });
      if (clash) {
        return errorResponse("Another post already uses this slug", 409, "CONFLICT");
      }
    }

    const cover = d.coverImage !== undefined ? d.coverImage?.trim() || null : undefined;
    if (cover) {
      try {
        const u = new URL(cover);
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          return errorResponse("Cover image must be http or https", 400, "VALIDATION_ERROR");
        }
      } catch {
        return errorResponse("Invalid cover image URL", 400, "VALIDATION_ERROR");
      }
    }

    let publishedAt = existing.publishedAt;
    if (d.status === "PUBLISHED" && existing.status !== "PUBLISHED" && !existing.publishedAt) {
      publishedAt = new Date();
    }
    if (d.status === "DRAFT" || d.status === "ARCHIVED") {
      publishedAt = existing.publishedAt;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(d.title !== undefined && { title: d.title }),
        ...(d.slug !== undefined && { slug: d.slug }),
        ...(d.excerpt !== undefined && { excerpt: d.excerpt ?? undefined }),
        ...(d.content !== undefined && { content: d.content }),
        ...(cover !== undefined && { coverImage: cover ?? undefined }),
        ...(d.tags !== undefined && { tags: d.tags }),
        ...(d.status !== undefined && { status: d.status }),
        ...(publishedAt !== existing.publishedAt && { publishedAt }),
      },
    });

    return successResponse(post);
  } catch (error) {
    return handleError(error);
  }
});

export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    await prisma.post.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});

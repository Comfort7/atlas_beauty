import { withAdmin } from "@/helpers/auth-guard";
import { handleError, successResponse, errorResponse } from "@/helpers/api-response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10),
  coverImage: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export const POST = withAdmin(async (request, _context, session) => {
  try {
    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        400,
        "VALIDATION_ERROR"
      );
    }

    const d = parsed.data;

    const post = await prisma.post.create({
      data: {
        title: d.title,
        slug: d.slug,
        excerpt: d.excerpt ?? undefined,
        content: d.content,
        coverImage: d.coverImage ?? undefined,
        tags: d.tags,
        status: d.status,
        authorId: session.user.id,
        publishedAt: d.status === "PUBLISHED" ? new Date() : undefined,
      },
    });

    return successResponse(post, 201);
  } catch (error) {
    return handleError(error);
  }
});

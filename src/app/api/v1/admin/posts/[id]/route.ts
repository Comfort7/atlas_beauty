import { withAdmin } from "@/helpers/auth-guard";
import { handleError, successResponse } from "@/helpers/api-response";
import { prisma } from "@/lib/prisma";

export const DELETE = withAdmin(async (_request, context) => {
  try {
    const { id } = await context.params;
    await prisma.post.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});

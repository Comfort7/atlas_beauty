import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { updateAddressSchema } from "../schema";

// GET /api/v1/addresses/:id
export const GET = withAuth(async (_request, context, session) => {
  try {
    const { id } = await context.params;
    const address = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!address) return errorResponse("Address not found", 404, "NOT_FOUND");
    return successResponse(address);
  } catch (error) {
    return handleError(error);
  }
});

// PATCH /api/v1/addresses/:id
export const PATCH = withAuth(async (request, context, session) => {
  try {
    const { id } = await context.params;
    const result = await validateBody(request, updateAddressSchema);
    if ("error" in result) return result.error;

    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) return errorResponse("Address not found", 404, "NOT_FOUND");

    if (result.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: result.data,
    });

    return successResponse(address);
  } catch (error) {
    return handleError(error);
  }
});

// DELETE /api/v1/addresses/:id
export const DELETE = withAuth(async (_request, context, session) => {
  try {
    const { id } = await context.params;
    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) return errorResponse("Address not found", 404, "NOT_FOUND");

    await prisma.address.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
});

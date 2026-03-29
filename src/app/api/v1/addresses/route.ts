import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAuth } from "@/helpers/auth-guard";
import { addressSchema } from "./schema";

// GET /api/v1/addresses
export const GET = withAuth(async (_request, _context, session) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return successResponse(addresses);
  } catch (error) {
    return handleError(error);
  }
});

// POST /api/v1/addresses
export const POST = withAuth(async (request, _context, session) => {
  try {
    const result = await validateBody(request, addressSchema);
    if ("error" in result) return result.error;

    // If setting as default, unset other defaults
    if (result.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: { ...result.data, userId: session.user.id },
    });

    return successResponse(address, 201);
  } catch (error) {
    return handleError(error);
  }
});

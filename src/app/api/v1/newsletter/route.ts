import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email().max(254),
});

// POST /api/v1/newsletter - Subscribe an email address
export async function POST(request: NextRequest) {
  try {
    const result = await validateBody(request, subscribeSchema);
    if ("error" in result) return result.error;

    const email = result.data.email.trim().toLowerCase();

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return successResponse({ subscribed: true });
  } catch (error) {
    return handleError(error);
  }
}

// GET /api/v1/newsletter - Admin only: list subscribers
export const GET = withAdmin(async () => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return successResponse(subscribers);
  } catch (error) {
    return handleError(error);
  }
});

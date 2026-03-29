import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { errorResponse } from "./api-response";
import { Session } from "next-auth";

type AuthenticatedHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> },
  session: Session
) => Promise<Response>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401, "UNAUTHORIZED");
    }

    return handler(request, context, session);
  };
}

export function withAdmin(handler: AuthenticatedHandler) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401, "UNAUTHORIZED");
    }

    if (session.user.role !== "ADMIN") {
      return errorResponse("Admin access required", 403, "FORBIDDEN");
    }

    return handler(request, context, session);
  };
}

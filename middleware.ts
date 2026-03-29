import { NextRequest, NextResponse } from "next/server";
import { authLimiter, writeLimiter, readLimiter } from "@/lib/rate-limit";

function getAllowedOrigins(): string[] {
  const origins = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
  return origins.split(",").map((o) => o.trim());
}

function setCorsHeaders(response: NextResponse, origin: string | null) {
  const allowedOrigins = getAllowedOrigins();
  const isAllowed = origin && allowedOrigins.includes(origin);

  if (isAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin!);
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Cart-Session"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const pathname = request.nextUrl.pathname;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    return setCorsHeaders(response, origin);
  }

  // Skip rate limiting for webhooks
  if (pathname.startsWith("/api/webhooks")) {
    const response = NextResponse.next();
    return setCorsHeaders(response, origin);
  }

  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

  let limiter = readLimiter;
  if (pathname.startsWith("/api/auth") || pathname.includes("password-reset")) {
    limiter = authLimiter;
  } else if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    limiter = writeLimiter;
  }

  if (limiter) {
    const { success, limit, remaining, reset } = await limiter.limit(ip);
    if (!success) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again later.",
          },
        },
        { status: 429 }
      );
      response.headers.set("X-RateLimit-Limit", limit.toString());
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set("X-RateLimit-Reset", reset.toString());
      response.headers.set("Retry-After", Math.ceil((reset - Date.now()) / 1000).toString());
      return setCorsHeaders(response, origin);
    }
  }

  // Add request ID
  const requestId = crypto.randomUUID();
  const response = NextResponse.next();
  response.headers.set("X-Request-ID", requestId);

  return setCorsHeaders(response, origin);
}

export const config = {
  matcher: ["/api/:path*"],
};

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

function createLimiter(requests: number, window: string) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    analytics: true,
    prefix: "atlas-beauty",
  });
}

export const authLimiter = createLimiter(5, "60 s");
export const writeLimiter = createLimiter(30, "60 s");
export const readLimiter = createLimiter(60, "60 s");

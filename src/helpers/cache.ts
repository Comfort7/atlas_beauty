import { redis } from "@/lib/redis";

export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const cached = await redis.get<T>(key);
    return cached;
  } catch {
    return null;
  }
}

export async function setInCache<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, data, { ex: ttlSeconds });
  } catch {
    // Cache failures should not break the app
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redis!.del(key)));
    }
  } catch {
    // Cache failures should not break the app
  }
}

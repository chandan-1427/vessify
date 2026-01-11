import { createMiddleware } from "hono/factory";

/**
 * Simple in-memory rate limiter
 * Keyed by userId
 *
 * ⚠️ Safe for single-node / dev / small prod
 * ⚠️ Replace with Redis for multi-instance scaling
 */
type RateRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateRecord>();

export function rateLimit({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  return createMiddleware(async (c, next) => {
    const user = c.get("user");

    if (!user) {
      // Should never happen if sessionMiddleware runs first
      return c.json({ error: "Unauthorized" }, 401);
    }

    const key = `rate:${user.id}`;
    const now = Date.now();

    const record = store.get(key);

    if (!record || record.resetAt < now) {
      store.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    if (record.count >= limit) {
      return c.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((record.resetAt - now) / 1000),
        },
        429
      );
    }

    record.count += 1;
    store.set(key, record);

    await next();
  });
}

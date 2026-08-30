/**
 * In-memory sliding-window rate limiter. Scoped to a single warm instance —
 * effective under Vercel Fluid Compute (instances are reused across
 * requests), but not shared across instances. If reservation volume ever
 * justifies it, swap for Upstash Redis + @upstash/ratelimit (see
 * docs/DEPLOYMENT.md) without changing call sites.
 */
const attempts = new Map<string, number[]>();

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    attempts.set(key, recent);
    return false;
  }
  recent.push(now);
  attempts.set(key, recent);
  return true;
}

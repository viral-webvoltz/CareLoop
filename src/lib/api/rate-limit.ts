import 'server-only';

// ponytail: in-memory fixed window per IP, per instance. Enough to stop a form being spammed into the CRM; use a shared store (Redis) if this runs on several instances.
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(req: Request, { limit = 5, windowMs = 60_000 } = {}) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

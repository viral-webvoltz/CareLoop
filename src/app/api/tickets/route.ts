import { fail, fromError, invalid, ok } from '@/lib/api/server-response';
import { rateLimited } from '@/lib/api/rate-limit';
import { supportSchema } from '@/modules/tickets/schemas/ticket-schema';
import { createTicket } from '@/modules/tickets/services/tickets.server';

export async function POST(req: Request) {
  if (rateLimited(req)) return fail('Too many requests. Please wait a minute.', 429);
  const parsed = supportSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  try {
    return ok(await createTicket(parsed.data), 201);
  } catch (err) {
    return fromError(err);
  }
}

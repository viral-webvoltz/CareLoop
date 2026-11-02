import { z } from 'zod';
import { ApiError } from '@/lib/api/errors';
import { rateLimited } from '@/lib/api/rate-limit';
import { fail, fromError, invalid, ok } from '@/lib/api/server-response';
import { replySchema } from '@/modules/leads/schemas/reply-schema';
import { simulateReply } from '@/modules/leads/services/leads.server';

// Demo only: answers the last email sent to this lead, as if they had replied.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (rateLimited(req, { limit: 20 })) return fail('Too many requests. Please wait a minute.', 429);
  const id = z.string().uuid().safeParse((await params).id);
  if (!id.success) return fail('Lead not found.', 404);
  const parsed = replySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  try {
    await simulateReply(id.data, parsed.data.message);
    return ok({ sent: true });
  } catch (err) {
    // Reply problems carry messages meant for the person running the demo, so show them as they are.
    if (err instanceof ApiError) return fail(err.message, err.status);
    return fromError(err);
  }
}

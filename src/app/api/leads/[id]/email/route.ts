import { z } from 'zod';
import { rateLimited } from '@/lib/api/rate-limit';
import { fail, fromError, invalid, ok } from '@/lib/api/server-response';
import { emailSchema } from '@/modules/leads/schemas/email-schema';
import { sendLeadEmail } from '@/modules/leads/services/leads.server';

// The clinic's reply to a lead. The CRM sends it and records it on the lead's history.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (rateLimited(req, { limit: 20 })) return fail('Too many requests. Please wait a minute.', 429);
  const id = z.string().uuid().safeParse((await params).id);
  if (!id.success) return fail('Lead not found.', 404);
  const parsed = emailSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  try {
    await sendLeadEmail(id.data, parsed.data);
    return ok({ sent: true });
  } catch (err) {
    return fromError(err);
  }
}

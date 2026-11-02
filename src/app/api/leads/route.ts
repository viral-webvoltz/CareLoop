import { fail, fromError, invalid, ok } from '@/lib/api/server-response';
import { rateLimited } from '@/lib/api/rate-limit';
import { bookingSchema } from '@/modules/leads/schemas/lead-schema';
import { createLead, listLatestLeads } from '@/modules/leads/services/leads.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return ok(await listLatestLeads());
  } catch (err) {
    return fromError(err);
  }
}

// Public form endpoint: validated again here, rate-limited, and the CRM key never leaves the server.
export async function POST(req: Request) {
  if (rateLimited(req)) return fail('Too many requests. Please wait a minute.', 429);
  const parsed = bookingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  try {
    return ok(await createLead(parsed.data), 201);
  } catch (err) {
    return fromError(err);
  }
}

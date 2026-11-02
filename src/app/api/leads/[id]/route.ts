import { z } from 'zod';
import { fail, fromError, ok } from '@/lib/api/server-response';
import { getLeadJourney } from '@/modules/leads/services/leads.server';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = z.string().uuid().safeParse((await params).id);
  if (!id.success) return fail('Lead not found.', 404);
  try {
    return ok(await getLeadJourney(id.data));
  } catch (err) {
    return fromError(err);
  }
}

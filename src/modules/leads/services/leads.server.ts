import 'server-only';
import { randomUUID } from 'node:crypto';
import { crm } from '@/lib/crm';
import { ApiError } from '@/lib/api/errors';
import type { BookingValues } from '../schemas/lead-schema';
import { getEnv } from '@/config/env';
import type { LeadEmail, LeadJourney, LeadSummary, LeadsResponse } from '../types';

export async function createLead(input: BookingValues) {
  // The idempotency key lets the SDK retry a failed request without creating the lead twice.
  const lead = await crm().leads.create(
    { firstName: input.name, email: input.email, phone: input.phone || null, source: 'website', notes: input.message },
    { idempotencyKey: randomUUID() },
  );
  return { id: lead.id };
}

export async function listLatestLeads(): Promise<LeadsResponse> {
  const { data, meta } = await crm().leads.list({ limit: 6, sort: 'createdAt', dir: 'desc' });
  return {
    total: meta.total,
    leads: data.map(toSummary),
  };
}

function toSummary(l: Record<string, unknown>): LeadSummary {
  return {
    id: String(l.id),
    name: String(l.firstName ?? ''),
    email: (l.email as string | null) ?? null,
    source: String(l.source ?? ''),
    status: String(l.status ?? ''),
    createdAt: (l.createdAt as string | null) ?? null,
  };
}

// The lead and every email exchanged with them, as the CRM holds it.
export async function getLeadJourney(id: string): Promise<LeadJourney> {
  const [lead, emails] = await Promise.all([crm().leads.get(id), crm().leads.listEmails(id)]);
  return {
    lead: toSummary(lead),
    emails: emails.map(
      (e): LeadEmail => ({
        id: e.id,
        direction: e.direction === 'inbound' ? 'inbound' : 'outbound',
        subject: String(e.subject ?? ''),
        body: (e.body as string | null) ?? null,
        occurredAt: String(e.occurredAt),
        deliveryStatus: (e.deliveryStatus as LeadEmail['deliveryStatus']) ?? null,
        deliveryError: (e.deliveryError as string | null) ?? null,
      }),
    ),
    canSimulateReply: Boolean(getEnv().CRM_INBOUND_SECRET),
  };
}

// Demo only. A real reply arrives through the CRM's inbound email hook; this posts the same payload, as if the lead had answered the
// last email we sent them, so the whole loop (reply -> intent -> status) can be shown without a mail provider.
export async function simulateReply(id: string, message: string) {
  const secret = getEnv().CRM_INBOUND_SECRET;
  if (!secret) throw new ApiError('Simulated replies are not enabled. Set CRM_INBOUND_SECRET.', 503);

  const [lead, emails] = await Promise.all([crm().leads.get(id), crm().leads.listEmails(id)]);
  const sent = [...emails].reverse().find((e) => e.direction === 'outbound');
  if (!lead.email || !sent?.messageId) throw new ApiError('No email has been sent to this lead yet.', 409);

  const res = await fetch(`${getEnv().CRM_BASE_URL.replace(/\/$/, '')}/api/v1/inbound/email`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-inbound-secret': secret },
    body: JSON.stringify({
      from: lead.email,
      to: ['demo-replies@careloop.example'],
      subject: `Re: ${String(sent.subject ?? '')}`,
      text: message,
      messageId: `<demo-${randomUUID()}@careloop.example>`,
      inReplyTo: `<${String(sent.messageId)}>`,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await res.json().catch(() => ({}))) as { message?: string; data?: { ignored?: string } };
  if (!res.ok) throw new ApiError(body.message ?? 'The CRM rejected the reply.', 502);
  if (body.data?.ignored) throw new ApiError(`The CRM ignored the reply (${body.data.ignored}).`, 409);
}

// Sends through the CRM (its connected mailbox), which also stores it in the lead's history and tracks the lead's replies.
export async function sendLeadEmail(id: string, input: { subject: string; body: string }) {
  await crm().leads.sendEmail(id, input, { idempotencyKey: randomUUID() });
}

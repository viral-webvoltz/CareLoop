import 'server-only';
import { randomUUID } from 'node:crypto';
import { crm } from '@/lib/crm';
import type { SupportValues } from '../schemas/ticket-schema';

// A ticket belongs to a contact, so the contact is created first. The CRM starts the SLA clock when the ticket is created.
export async function createTicket(input: SupportValues) {
  const contact = await crm().contacts.create({ firstName: input.name, email: input.email }, { idempotencyKey: randomUUID() });
  const ticket = await crm().tickets.create({ subject: input.subject, body: input.message, contactId: contact.id }, { idempotencyKey: randomUUID() });
  return { id: ticket.id };
}

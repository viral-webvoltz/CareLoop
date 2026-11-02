// What the UI needs from a CRM lead, kept separate from the CRM's own row shape.
export interface LeadSummary {
  id: string;
  name: string;
  email: string | null;
  source: string;
  status: string;
  createdAt: string | null;
}

export interface LeadsResponse {
  total: number;
  leads: LeadSummary[];
}

export interface LeadEmail {
  id: string;
  direction: 'outbound' | 'inbound';
  subject: string;
  body: string | null;
  occurredAt: string;
  /** What happened to an email we sent; replies have none. */
  deliveryStatus: 'queued' | 'sending' | 'sent' | 'failed' | null;
  deliveryError: string | null;
}

export interface LeadJourney {
  lead: LeadSummary;
  emails: LeadEmail[];
  /** Whether the demo can post a reply to the CRM on the lead's behalf (needs CRM_INBOUND_SECRET). */
  canSimulateReply: boolean;
}

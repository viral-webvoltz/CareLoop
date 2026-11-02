// The only place raw URLs live. These are this app's own routes; the CRM is only ever called from the server.
export const ENDPOINTS = {
  leads: '/api/leads',
  lead: (id: string) => `/api/leads/${id}`,
  leadEmail: (id: string) => `/api/leads/${id}/email`,
  leadReply: (id: string) => `/api/leads/${id}/reply`,
  tickets: '/api/tickets',
  events: '/api/events',
} as const;

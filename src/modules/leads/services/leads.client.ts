import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { BookingValues } from '../schemas/lead-schema';
import type { EmailValues } from '../schemas/email-schema';
import type { ReplyValues } from '../schemas/reply-schema';
import type { LeadJourney, LeadsResponse } from '../types';

export const fetchLeads = () => apiRequest<LeadsResponse>(ENDPOINTS.leads);

export const submitBooking = (values: BookingValues) => apiRequest<{ id: string }>(ENDPOINTS.leads, { method: 'POST', json: values });

export const fetchLeadJourney = (id: string) => apiRequest<LeadJourney>(ENDPOINTS.lead(id));

export const sendSimulatedReply = (id: string, values: ReplyValues) => apiRequest<{ sent: true }>(ENDPOINTS.leadReply(id), { method: 'POST', json: values });

export const sendLeadEmail = (id: string, values: EmailValues) => apiRequest<{ sent: true }>(ENDPOINTS.leadEmail(id), { method: 'POST', json: values });

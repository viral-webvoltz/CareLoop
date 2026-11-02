import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { SupportValues } from '../schemas/ticket-schema';

export const submitTicket = (values: SupportValues) => apiRequest<{ id: string }>(ENDPOINTS.tickets, { method: 'POST', json: values });

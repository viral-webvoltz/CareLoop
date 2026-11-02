'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EmailValues } from '../schemas/email-schema';
import type { ReplyValues } from '../schemas/reply-schema';
import { fetchLeadJourney, fetchLeads, sendLeadEmail, sendSimulatedReply, submitBooking } from '../services/leads.client';

export const LEADS_KEY = ['leads'] as const;

// Polls so a lead edited inside the CRM shows up here without a reload.
export const useLeads = () => useQuery({ queryKey: LEADS_KEY, queryFn: fetchLeads, refetchInterval: 4_000 });

export function useSubmitBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LEADS_KEY }),
  });
}

// ['lead', id] shares its first segment with the live-update invalidation, so a pushed CRM event refreshes it straight away.
export const useLeadJourney = (id: string) => useQuery({ queryKey: ['lead', id], queryFn: () => fetchLeadJourney(id), refetchInterval: 3_000 });

export function useSimulateReply(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ReplyValues) => sendSimulatedReply(id, values),
    onSuccess: () => Promise.all([queryClient.invalidateQueries({ queryKey: ['lead', id] }), queryClient.invalidateQueries({ queryKey: LEADS_KEY })]),
  });
}

export function useSendEmail(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: EmailValues) => sendLeadEmail(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lead', id] }),
  });
}

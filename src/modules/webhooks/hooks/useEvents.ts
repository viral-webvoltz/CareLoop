'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { StoredEvent } from '../types';

export const useEvents = () =>
  useQuery({ queryKey: ['events'], queryFn: () => apiRequest<StoredEvent[]>(ENDPOINTS.events), refetchInterval: 3_000 });

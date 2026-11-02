'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { StoredEvent } from '@/modules/webhooks/types';
import { eventLabel } from '@/modules/webhooks/utils/event-label';

// Listens for CRM events pushed over the stream and refreshes whatever is on screen at once, instead of waiting for the next poll.
// If the stream is unavailable the pages still refresh on their own timers.
export function LiveUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const source = new EventSource('/api/events/stream');
    source.onmessage = (message) => {
      const event = JSON.parse(message.data) as StoredEvent;
      toast(eventLabel(event.event, event.data));
      for (const key of ['leads', 'lead', 'events']) void queryClient.invalidateQueries({ queryKey: [key] });
    };
    return () => source.close();
  }, [queryClient]);

  return null;
}

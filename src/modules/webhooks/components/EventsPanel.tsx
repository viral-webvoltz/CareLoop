'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { ChevronRight, Webhook } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { RowsSkeleton } from '@/components/common/Skeleton';
import { Card } from '@/components/ui/card';
import { useEvents } from '../hooks/useEvents';
import { eventLabel } from '../utils/event-label';

export function EventsPanel() {
  const { data, isPending, error } = useEvents();

  return (
    <Card>
      {isPending && <RowsSkeleton />}
      {error && (
        <p role="alert" className="p-5 text-sm text-destructive">
          {error.message}
        </p>
      )}
      {data && data.length === 0 && <EmptyState icon={Webhook} title="Nothing received yet" hint="Update a lead in the CRM and the event shows up here." />}

      {data && data.length > 0 && (
        <>
          <p className="border-b border-border px-5 py-3 text-sm text-muted" aria-live="polite">
            {data.length} {data.length === 1 ? 'event' : 'events'} received. Select one to see exactly what the CRM sent.
          </p>
          <ul>
            {data.map((e) => (
              <li key={e.id} className="border-b border-border/60 last:border-b-0">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 hover:bg-accent/50 [&::-webkit-details-marker]:hidden">
                    <ChevronRight className="size-4 shrink-0 text-muted transition-transform group-open:rotate-90" aria-hidden />
                    <span className="min-w-0 flex-1 truncate font-semibold">{eventLabel(e.event, e.data)}</span>
                    <time dateTime={e.at} title={format(new Date(e.at), 'd MMM yyyy, HH:mm:ss')} className="shrink-0 text-sm text-muted">
                      {formatDistanceToNow(new Date(e.at), { addSuffix: true })}
                    </time>
                  </summary>
                  <div className="px-5 pb-4 pl-12">
                    <p className="mb-2 text-xs text-muted">
                      Event name <code className="font-mono text-foreground">{e.event}</code>, received {format(new Date(e.at), 'd MMM yyyy, HH:mm:ss')}
                    </p>
                    <pre className="max-h-72 overflow-auto rounded-xl bg-foreground p-4 font-mono text-xs leading-relaxed text-background">{JSON.stringify(e.data, null, 2)}</pre>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

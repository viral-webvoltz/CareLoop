'use client';

import { cn } from '@/lib/utils/cn';
import { useLeads } from '../hooks/useLeads';

// Reflects whether the last request to the CRM worked, so a broken key or an offline CRM is visible at a glance.
export function ConnectionStatus() {
  const { isError, isPending } = useLeads();
  const state = isPending ? 'Connecting' : isError ? 'Not connected' : 'Connected';

  return (
    <span role="status" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm">
      <span className={cn('size-2 rounded-full', isError ? 'bg-destructive' : isPending ? 'bg-warning' : 'beat bg-success')} aria-hidden />
      {state}
    </span>
  );
}

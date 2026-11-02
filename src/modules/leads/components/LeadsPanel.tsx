'use client';

import { formatDistanceToNow } from 'date-fns';
import { Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { RowsSkeleton } from '@/components/common/Skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, Td, Th } from '@/components/ui/table';
import { cn } from '@/lib/utils/cn';
import { useLeads } from '../hooks/useLeads';
import { STATUS_COLOR, STATUS_HELP, STATUS_ORDER, STATUS_TONE } from '../utils/status-tone';

export function LeadsPanel() {
  const { data, isPending, error, refetch } = useLeads();
  const seen = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  // The first load only records what is already there; later arrivals glow once.
  useEffect(() => {
    if (!data) return;
    const ids = data.leads.map((l) => l.id);
    if (seen.current === null) {
      seen.current = new Set(ids);
      return;
    }
    const known = seen.current;
    const added = ids.filter((id) => !known.has(id));
    if (added.length === 0) return;
    added.forEach((id) => known.add(id));
    setFresh(new Set(added));
    const timer = setTimeout(() => setFresh(new Set()), 2_000);
    return () => clearTimeout(timer);
  }, [data]);

  const leads = data?.leads ?? [];
  const counts = STATUS_ORDER.map((status) => ({ status, n: leads.filter((l) => l.status === status).length }));
  const q = query.trim().toLowerCase();
  const shown = leads.filter((l) => (filter === 'all' || l.status === filter) && (!q || l.name.toLowerCase().includes(q) || (l.email ?? '').toLowerCase().includes(q)));

  return (
    <div className="grid gap-5">
      {data && leads.length > 0 && (
        <section aria-label="Pipeline" className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline gap-3">
            <p className="font-display text-4xl font-bold tracking-tight">{data.total}</p>
            <p className="text-sm text-muted">{data.total === 1 ? 'lead' : 'leads'} in the pipeline</p>
          </div>
          <div className="mt-3 flex h-3 gap-0.5 overflow-hidden rounded-full bg-accent" role="img" aria-label={counts.map((c) => `${c.n} ${c.status}`).join(', ')}>
            {counts
              .filter((c) => c.n > 0)
              .map((c) => (
                <div key={c.status} className={cn('transition-all duration-500', STATUS_COLOR[c.status])} style={{ flexGrow: c.n }} />
              ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {counts.map((c) => (
              <button
                key={c.status}
                type="button"
                aria-pressed={filter === c.status}
                onClick={() => setFilter(filter === c.status ? 'all' : c.status)}
                className={cn('rounded-xl border px-3 py-2.5 text-left transition-colors', filter === c.status ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent')}
              >
                <span className="flex items-center gap-2 text-sm font-semibold capitalize">
                  <span className={cn('size-2.5 rounded-full', STATUS_COLOR[c.status])} aria-hidden />
                  {c.status}
                  <span className="ml-auto font-display text-lg">{c.n}</span>
                </span>
                <span className="mt-0.5 block text-xs text-muted">{STATUS_HELP[c.status]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <Card>
        {data && leads.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <div className="relative min-w-52 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input aria-label="Search leads" placeholder="Search by name or email" value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 pl-9" />
            </div>
            <p className="text-sm text-muted" aria-live="polite">
              Showing {shown.length} of {data.total}
            </p>
            {(filter !== 'all' || query) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilter('all');
                  setQuery('');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {isPending && <RowsSkeleton />}

        {error && (
          <div role="alert" className="grid justify-items-start gap-3 p-5 text-sm">
            <p className="text-destructive">{error.message}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        )}

        {data && leads.length === 0 && (
          <EmptyState icon={Users} title="No leads yet" hint="Send a booking request and it appears here.">
            <Button asChild size="sm" className="mt-3">
              <Link href="/book">Book a visit</Link>
            </Button>
          </EmptyState>
        )}

        {data && leads.length > 0 && shown.length === 0 && <EmptyState icon={Search} title="No leads match" hint="Try a different name or clear the filters." />}

        {shown.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Lead</Th>
                <Th>Source</Th>
                <Th>Status</Th>
                <Th>Created</Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((lead) => (
                <tr key={lead.id} className={cn('transition-colors hover:bg-accent/50', fresh.has(lead.id) && 'arrive')}>
                  <Td>
                    <Link href={`/leads/${lead.id}`} className="flex items-center gap-3 font-semibold hover:text-primary">
                      <Avatar name={lead.name} />
                      <span className="min-w-0">
                        <span className="block truncate">{lead.name}</span>
                        <span className="block truncate text-xs font-normal text-muted">{lead.email ?? 'No email'}</span>
                      </span>
                    </Link>
                  </Td>
                  <Td className="text-muted">{lead.source}</Td>
                  <Td>
                    <Badge tone={STATUS_TONE[lead.status] ?? 'neutral'} className="capitalize">
                      {lead.status}
                    </Badge>
                  </Td>
                  <Td className="whitespace-nowrap text-muted">{lead.createdAt ? formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true }) : ''}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}

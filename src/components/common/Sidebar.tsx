'use client';

import { Activity, CalendarCheck, LifeBuoy, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/lib/utils/cn';
import { ConnectionStatus } from '@/modules/leads/components/ConnectionStatus';
import { useLeads } from '@/modules/leads/hooks/useLeads';

const GROUPS = [
  {
    label: 'For patients',
    items: [
      { href: '/book', label: 'Book a visit', icon: CalendarCheck },
      { href: '/support', label: 'Get support', icon: LifeBuoy },
    ],
  },
  {
    label: 'Clinic team',
    items: [
      { href: '/leads', label: 'Leads', icon: Users },
      { href: '/events', label: 'CRM activity', icon: Activity },
    ],
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { data } = useLeads();
  const waiting = data?.leads.filter((l) => l.status === 'new').length ?? 0;

  return (
    <aside className="flex flex-col gap-4 border-b border-border bg-card px-4 py-4 lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:py-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader />
        <div className="lg:hidden">
          <ConnectionStatus />
        </div>
      </div>
      <nav aria-label="Main" className="flex gap-4 overflow-x-auto lg:flex-1 lg:flex-col lg:gap-6 lg:overflow-visible">
        {GROUPS.map((group) => (
          <div key={group.label} className="flex shrink-0 gap-1 lg:flex-col">
            <p className="hidden px-3 pb-1 text-xs font-semibold text-muted lg:block">{group.label}</p>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href === '/leads' && pathname.startsWith('/leads/'));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                    active ? 'bg-primary text-primary-foreground' : 'text-muted hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                  {href === '/leads' && waiting > 0 && (
                    <span aria-label={`${waiting} waiting for a reply`} className={cn('ml-auto rounded-full px-2 py-0.5 text-xs font-bold', active ? 'bg-white/25' : 'bg-primary text-primary-foreground')}>
                      {waiting}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="hidden lg:block">
        <p className="mb-2 text-xs font-semibold text-muted">Relio CRM</p>
        <ConnectionStatus />
      </div>
    </aside>
  );
}

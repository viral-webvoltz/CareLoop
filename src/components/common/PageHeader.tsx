import { HeartPulse } from 'lucide-react';
import { SITE } from '@/config/site';

// The clinic's wordmark.
export function PageHeader() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
        <HeartPulse className="size-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-xl font-bold tracking-tight">{SITE.name}</span>
        <span className="hidden text-xs text-muted lg:block">Clinic, connected to Relio</span>
      </span>
    </div>
  );
}

import { cn } from '@/lib/utils/cn';

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?';

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={cn('grid size-9 shrink-0 place-items-center rounded-full bg-accent font-display text-sm font-bold text-primary', className)}>
      {initials(name)}
    </span>
  );
}

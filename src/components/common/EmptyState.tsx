import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  hint?: string;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, hint, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-12 text-center">
      <Icon className="size-8 text-primary/60" aria-hidden />
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="text-sm text-muted">{hint}</p>}
      {children}
    </div>
  );
}

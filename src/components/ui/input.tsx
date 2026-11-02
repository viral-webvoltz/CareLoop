import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input({ className, ref, ...props }: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm placeholder:text-muted/70 transition-colors focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

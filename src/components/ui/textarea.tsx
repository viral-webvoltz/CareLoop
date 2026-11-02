import type { Ref, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Textarea({ className, ref, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full resize-y rounded-xl border border-border bg-card px-3.5 py-3 text-sm placeholder:text-muted/70 transition-colors focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

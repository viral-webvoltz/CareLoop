import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <section className={cn('rounded-2xl border border-border bg-card', className)} {...props} />
);

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => <div className={cn('border-b border-border px-5 py-4', className)} {...props} />;

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => <h2 className={cn('font-display text-base font-semibold', className)} {...props} />;

export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => <p className={cn('mt-0.5 text-sm text-muted', className)} {...props} />;

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => <div className={cn('px-5 py-2', className)} {...props} />;

'use client';

import { Button } from '@/components/ui/button';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto grid max-w-md gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted">The page could not be loaded. Please try again.</p>
      <Button onClick={reset} className="mx-auto">
        Try again
      </Button>
    </div>
  );
}

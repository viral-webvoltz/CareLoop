import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-md gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">Page not found</h2>
      <Button asChild className="mx-auto">
        <Link href="/">Back to CareLoop</Link>
      </Button>
    </div>
  );
}

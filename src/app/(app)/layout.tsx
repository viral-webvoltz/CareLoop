import type { ReactNode } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { LiveUpdates } from '@/components/providers/LiveUpdates';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:flex">
      <LiveUpdates />
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>
    </div>
  );
}

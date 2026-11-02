import { PageTitle } from '@/components/common/PageTitle';
import { EventsPanel } from '@/modules/webhooks/components/EventsPanel';

export default function EventsPage() {
  return (
    <>
      <PageTitle title="CRM activity" hint="When something changes in the CRM it notifies CareLoop. Each message is signed and verified." />
      <EventsPanel />
    </>
  );
}

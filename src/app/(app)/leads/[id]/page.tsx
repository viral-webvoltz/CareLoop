import { PageTitle } from '@/components/common/PageTitle';
import { LeadJourney } from '@/modules/leads/components/LeadJourney';

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <PageTitle title="Lead journey" hint="Every email exchanged with this lead, and their status in the CRM. Updates by itself." />
      <LeadJourney id={id} />
    </>
  );
}

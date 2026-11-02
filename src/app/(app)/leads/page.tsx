import { PageTitle } from '@/components/common/PageTitle';
import { LeadsPanel } from '@/modules/leads/components/LeadsPanel';

export default function LeadsPage() {
  return (
    <>
      <PageTitle title="Leads" hint="Every booking request sent to the CRM. Updates by itself." />
      <LeadsPanel />
    </>
  );
}

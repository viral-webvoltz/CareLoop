import { PageTitle } from '@/components/common/PageTitle';
import { NextSteps } from '@/components/common/NextSteps';
import { Card, CardContent } from '@/components/ui/card';
import { SupportForm } from '@/modules/tickets/components/SupportForm';

export default function SupportPage() {
  return (
    <div className="max-w-4xl">
      <PageTitle title="Get support" hint="Opens a ticket in the CRM for the clinic team." />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardContent className="py-5">
            <SupportForm />
          </CardContent>
        </Card>
        <NextSteps
          title="What happens next"
          steps={[
            { heading: 'A ticket is opened', text: 'It appears in the CRM straight away, with your message attached.' },
            { heading: 'The team picks it up', text: 'Someone from the clinic reviews it and follows up by email.' },
            { heading: 'You get an answer', text: 'Include as much detail as you can so it is solved in one reply.' },
          ]}
        />
      </div>
    </div>
  );
}

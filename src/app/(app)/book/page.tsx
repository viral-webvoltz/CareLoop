import { PageTitle } from '@/components/common/PageTitle';
import { NextSteps } from '@/components/common/NextSteps';
import { Card, CardContent } from '@/components/ui/card';
import { BookingForm } from '@/modules/leads/components/BookingForm';

export default function BookPage() {
  return (
    <div className="max-w-4xl">
      <PageTitle title="Book a visit" hint="The clinic team replies within one working day. The request lands in the CRM as a lead." />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardContent className="py-5">
            <BookingForm />
          </CardContent>
        </Card>
        <NextSteps
          title="What happens next"
          steps={[
            { heading: 'Your request reaches the CRM', text: 'It is saved as a new lead within seconds.' },
            { heading: 'The clinic emails you', text: 'An introduction is sent automatically to the address you gave.' },
            { heading: 'You reply, the status updates', text: 'Interested or not, the lead moves to the right stage on its own.' },
          ]}
        />
      </div>
    </div>
  );
}

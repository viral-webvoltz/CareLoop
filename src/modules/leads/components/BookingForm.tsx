'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/lib/api/errors';
import { useSubmitBooking } from '../hooks/useLeads';
import { bookingSchema, type BookingValues } from '../schemas/lead-schema';

export function BookingForm() {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<BookingValues>({ resolver: zodResolver(bookingSchema) });
  const { mutate, isPending } = useSubmitBooking();

  const onSubmit = (values: BookingValues) =>
    mutate(values, {
      onSuccess: () => {
        toast.success('Booking request sent successfully. We will reply by email.');
        reset();
      },
      onError: (err) => {
        // Server-side validation errors are shown on their fields; anything else as a toast.
        const fields = err instanceof ApiError ? err.fieldErrors : undefined;
        if (fields) for (const [name, msgs] of Object.entries(fields)) if (msgs?.[0]) setError(name as keyof BookingValues, { message: msgs[0] });
        toast.error(err.message);
      },
    });

  return (
    <div>
      <p className="mb-5 text-sm text-muted">Tell us a bit about what you need. We reply by email. Fields marked <span className="text-destructive">*</span> are required.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <FormField id="booking-name" required label="Your name" error={errors.name?.message}>
          <Input id="booking-name" aria-required autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'booking-name-error' : undefined} {...register('name')} />
        </FormField>
        <FormField id="booking-email" required label="Email" error={errors.email?.message}>
          <Input id="booking-email" aria-required type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'booking-email-error' : undefined} {...register('email')} />
        </FormField>
        <FormField id="booking-phone" label="Phone (optional)" error={errors.phone?.message}>
          <Input id="booking-phone" type="tel" autoComplete="tel" {...register('phone')} />
        </FormField>
        <FormField id="booking-message" required label="What do you need?" error={errors.message?.message}>
          <Textarea id="booking-message" aria-required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'booking-message-error' : undefined} {...register('message')} />
        </FormField>
        <Button type="submit" disabled={isPending} className="mt-1 w-full">
          {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {isPending ? 'Sending' : 'Request booking'}
        </Button>
      </form>
    </div>
  );
}

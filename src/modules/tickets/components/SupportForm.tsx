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
import { useSubmitTicket } from '../hooks/useSubmitTicket';
import { supportSchema, type SupportValues } from '../schemas/ticket-schema';

export function SupportForm() {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<SupportValues>({ resolver: zodResolver(supportSchema) });
  const { mutate, isPending } = useSubmitTicket();

  const onSubmit = (values: SupportValues) =>
    mutate(values, {
      onSuccess: () => {
        toast.success('Support ticket opened in the CRM');
        reset();
      },
      onError: (err) => {
        const fields = err instanceof ApiError ? err.fieldErrors : undefined;
        if (fields) for (const [name, msgs] of Object.entries(fields)) if (msgs?.[0]) setError(name as keyof SupportValues, { message: msgs[0] });
        toast.error(err.message);
      },
    });

  return (
    <div>
      <p className="mb-5 text-sm text-muted">Already a patient? Tell us what went wrong and we will look into it. Fields marked <span className="text-destructive">*</span> are required.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <FormField id="support-name" required label="Your name" error={errors.name?.message}>
          <Input id="support-name" aria-required autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'support-name-error' : undefined} {...register('name')} />
        </FormField>
        <FormField id="support-email" required label="Email" error={errors.email?.message}>
          <Input id="support-email" aria-required type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'support-email-error' : undefined} {...register('email')} />
        </FormField>
        <FormField id="support-subject" required label="Subject" error={errors.subject?.message}>
          <Input id="support-subject" aria-required aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'support-subject-error' : undefined} {...register('subject')} />
        </FormField>
        <FormField id="support-message" required label="Describe the problem" error={errors.message?.message}>
          <Textarea id="support-message" aria-required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'support-message-error' : undefined} {...register('message')} />
        </FormField>
        <Button type="submit" disabled={isPending} className="mt-1 w-full">
          {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {isPending ? 'Sending' : 'Open ticket'}
        </Button>
      </form>
    </div>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { FormField } from '@/components/common/FormField';
import { RowsSkeleton } from '@/components/common/Skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';
import { useLeadJourney, useSendEmail, useSimulateReply } from '../hooks/useLeads';
import { emailSchema, type EmailValues } from '../schemas/email-schema';
import { replySchema, type ReplyValues } from '../schemas/reply-schema';
import type { LeadEmail } from '../types';
import { STATUS_COLOR, STATUS_HELP, STATUS_ORDER } from '../utils/status-tone';

const DELIVERY_TONE = { queued: 'neutral', sending: 'info', sent: 'success', failed: 'warning' } as const;

const SAMPLE_REPLIES = [
  { label: 'Interested', text: 'Yes, I am interested. Could you send me more details and pricing?' },
  { label: 'Not interested', text: 'Thanks, but we are not interested at the moment.' },
  { label: 'Unclear', text: 'Thanks for the message. I will have a look and come back to you.' },
] as const;

function Message({ mail, name }: { mail: LeadEmail; name: string }) {
  const inbound = mail.direction === 'inbound';
  const Icon = inbound ? ArrowDownLeft : ArrowUpRight;
  return (
    <li className={cn('flex', inbound ? 'justify-start' : 'justify-end')}>
      <div className={cn('max-w-[85%] rounded-2xl border px-4 py-3 text-sm', inbound ? 'border-border bg-background' : 'border-primary/30 bg-primary/10')}>
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <Icon className="size-3.5" aria-hidden />
          <span className="font-semibold text-foreground">{inbound ? name : 'Clinic'}</span>
          <time dateTime={mail.occurredAt}>{format(new Date(mail.occurredAt), 'd MMM, HH:mm:ss')}</time>
          {!inbound && mail.deliveryStatus && <Badge tone={DELIVERY_TONE[mail.deliveryStatus]}>{mail.deliveryStatus}</Badge>}
        </div>
        <p className="font-semibold">{mail.subject}</p>
        {mail.body && <p className="mt-1 whitespace-pre-wrap break-words text-muted">{mail.body}</p>}
        {mail.deliveryStatus === 'failed' && mail.deliveryError && <p className="mt-1 text-xs text-destructive">Not delivered: {mail.deliveryError}</p>}
      </div>
    </li>
  );
}

// The real thing: the clinic writes, the CRM sends it from its mailbox and keeps it on the lead's history.
function ClinicReply({ id, lastSubject }: { id: string; lastSubject: string }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { subject: lastSubject ? (/^re:/i.test(lastSubject) ? lastSubject : `Re: ${lastSubject}`) : '', body: '' },
  });
  const { mutate, isPending } = useSendEmail(id);

  const onSubmit = (values: EmailValues) =>
    mutate(values, {
      onSuccess: () => {
        toast.success('Email sent from the CRM');
        reset({ subject: values.subject, body: '' });
      },
      onError: (err) => toast.error(err.message),
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-3 border-t border-border p-5">
      <div>
        <p className="text-sm font-semibold">Reply to this lead</p>
        <p className="text-sm text-muted">Sent from the CRM&apos;s connected mailbox. Their answer comes back into this conversation.</p>
      </div>
      <FormField id="email-subject" required label="Subject" error={errors.subject?.message}>
        <Input id="email-subject" aria-required aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'email-subject-error' : undefined} {...register('subject')} />
      </FormField>
      <FormField id="email-body" required label="Message" error={errors.body?.message}>
        <Textarea id="email-body" aria-required aria-invalid={!!errors.body} aria-describedby={errors.body ? 'email-body-error' : undefined} {...register('body')} />
      </FormField>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {isPending ? 'Sending' : 'Send email'}
      </Button>
    </form>
  );
}

function ReplySimulator({ id }: { id: string }) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReplyValues>({ resolver: zodResolver(replySchema), defaultValues: { message: '' } });
  const { mutate, isPending } = useSimulateReply(id);

  const onSubmit = (values: ReplyValues) =>
    mutate(values, {
      onSuccess: () => {
        toast.success('Reply sent. Watch the status change.');
        reset();
      },
      onError: (err) => toast.error(err.message),
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-3 border-t border-border p-5">
      <div>
        <p className="text-sm font-semibold">Answer as the lead (demo)</p>
        <p className="text-sm text-muted">Demo only. A real reply arrives by email; this sends the same thing to the CRM so you can show what happens next.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Sample replies">
        {SAMPLE_REPLIES.map((sample) => (
          <Button key={sample.label} type="button" variant="outline" size="sm" onClick={() => setValue('message', sample.text, { shouldValidate: true })}>
            {sample.label}
          </Button>
        ))}
      </div>
      <FormField id="reply-message" required label="Reply" error={errors.message?.message}>
        <Textarea id="reply-message" aria-required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'reply-message-error' : undefined} {...register('message')} />
      </FormField>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {isPending ? 'Sending' : 'Send reply to the CRM'}
      </Button>
    </form>
  );
}

export function LeadJourney({ id }: { id: string }) {
  const { data, isPending, error, refetch } = useLeadJourney(id);

  if (isPending) return <Card className="max-w-3xl"><RowsSkeleton rows={4} /></Card>;
  if (error || !data) {
    return (
      <Card className="grid justify-items-start gap-3 p-5 text-sm" role="alert">
        <p className="text-destructive">{error?.message ?? 'Could not load this lead.'}</p>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          Try again
        </Button>
      </Card>
    );
  }

  const { lead, emails, canSimulateReply } = data;
  const hasSent = emails.some((e) => e.direction === 'outbound');

  return (
    <div className="grid max-w-3xl gap-6">
      <Card className="grid gap-5 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={lead.name} className="size-12 text-base" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-semibold">{lead.name}</h2>
            <p className="truncate text-sm text-muted">{lead.email ?? 'No email'}</p>
          </div>
          <dl className="flex gap-6 text-sm">
            <div>
              <dt className="text-muted">Sent</dt>
              <dd className="font-display text-lg font-bold">{emails.filter((e) => e.direction === 'outbound').length}</dd>
            </div>
            <div>
              <dt className="text-muted">Replies</dt>
              <dd className="font-display text-lg font-bold">{emails.filter((e) => e.direction === 'inbound').length}</dd>
            </div>
            <div>
              <dt className="text-muted">Source</dt>
              <dd className="font-display text-lg font-bold">{lead.source}</dd>
            </div>
          </dl>
        </div>
        <ol aria-label="Lead stage" className="grid grid-cols-4 gap-2">
          {STATUS_ORDER.map((stage) => {
            const current = stage === lead.status;
            return (
              <li key={stage} aria-current={current ? 'step' : undefined}>
                <div className={cn('h-1.5 rounded-full', current ? STATUS_COLOR[stage] : 'bg-accent')} />
                <p className={cn('mt-1.5 text-sm capitalize', current ? 'font-semibold' : 'text-muted')}>{stage}</p>
                {current && <p className="text-xs text-muted">{STATUS_HELP[stage]}</p>}
              </li>
            );
          })}
        </ol>
      </Card>

      <Card>
        <div className="p-5">
          {emails.length === 0 ? (
            <EmptyState icon={Mail} title="No emails yet" hint="When the CRM sends this lead its introduction, it appears here within seconds." />
          ) : (
            <ol className="space-y-3" aria-live="polite">
              {emails.map((mail) => (
                <Message key={mail.id} mail={mail} name={lead.name} />
              ))}
            </ol>
          )}
        </div>
        {lead.email && <ClinicReply id={id} lastSubject={emails.at(-1)?.subject ?? ''} />}
        {hasSent && canSimulateReply && <ReplySimulator id={id} />}
        {hasSent && !canSimulateReply && <p className="border-t border-border p-5 text-sm text-muted">Set CRM_INBOUND_SECRET to also try answering as the lead from here.</p>}
      </Card>

      <Link href="/leads" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Back to leads
      </Link>
    </div>
  );
}

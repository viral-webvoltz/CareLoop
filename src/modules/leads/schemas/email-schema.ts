import { z } from 'zod';

// The clinic writing to a lead from CareLoop; the CRM sends it from its connected mailbox.
export const emailSchema = z.object({
  subject: z.string().trim().min(2, 'Add a subject').max(200),
  body: z.string().trim().min(2, 'Write your message').max(5000),
});

export type EmailValues = z.infer<typeof emailSchema>;

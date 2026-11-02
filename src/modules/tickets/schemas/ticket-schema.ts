import { z } from 'zod';

export const supportSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100),
  email: z.string().trim().email('Enter a valid email').max(200),
  subject: z.string().trim().min(3, 'Add a short subject').max(200),
  message: z.string().trim().min(5, 'Describe the problem').max(5000),
});

export type SupportValues = z.infer<typeof supportSchema>;

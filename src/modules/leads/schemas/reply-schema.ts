import { z } from 'zod';

export const replySchema = z.object({ message: z.string().trim().min(2, 'Write a reply').max(2000) });

export type ReplyValues = z.infer<typeof replySchema>;

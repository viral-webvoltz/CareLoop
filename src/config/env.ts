import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  CRM_BASE_URL: z.string().url(),
  CRM_API_KEY: z.string().min(1),
  // Blank until the webhook is registered; an empty value in .env counts as "not set".
  CRM_WEBHOOK_SECRET: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  // Demo only: lets the "simulate a reply" button post a lead's answer to the CRM's inbound email hook. Same value as INBOUND_EMAIL_SECRET there.
  CRM_INBOUND_SECRET: z
    .string()
    .optional()
    .transform((v) => v || undefined),
});

let cached: z.infer<typeof envSchema> | undefined;

// Validated on first use rather than at import, so `next build` works without secrets but a misconfigured server fails loudly on the first request.
export function getEnv() {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const names = parsed.error.issues.map((i) => i.path.join('.')).join(', ');
    throw new Error(`Invalid server environment: ${names}. See .env.example.`);
  }
  cached = parsed.data;
  return cached;
}

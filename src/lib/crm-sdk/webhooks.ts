import { createHmac, timingSafeEqual } from 'node:crypto';

export interface WebhookEvent<T = unknown> {
  id: string;
  event: string; // e.g. "leads.create"
  createdAt: string;
  data: T;
}

// Header format: `t=<unix seconds>,v1=<hex>[,v1=<hex>...]`. During a secret rotation the CRM sends one v1 per active secret.
// `rawBody` must be the exact request text, not re-serialised JSON.
export function verifyWebhook({
  rawBody,
  signature,
  secret,
  toleranceSeconds = 300,
  now = Date.now(),
}: {
  rawBody: string;
  signature: string | null | undefined;
  secret: string;
  toleranceSeconds?: number;
  now?: number;
}): WebhookEvent {
  if (!signature) throw new Error('Missing x-webhook-signature header');
  const parts = signature.split(',').map((p) => p.trim().split('='));
  const t = Number(parts.find(([k]) => k === 't')?.[1]);
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v ?? '');
  if (!Number.isFinite(t) || sigs.length === 0) throw new Error('Malformed signature header');
  if (Math.abs(now / 1000 - t) > toleranceSeconds) throw new Error('Signature timestamp outside tolerance');
  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest();
  const ok = sigs.some((s) => {
    const got = Buffer.from(s, 'hex');
    return got.length === expected.length && timingSafeEqual(got, expected);
  });
  if (!ok) throw new Error('Invalid signature');
  return JSON.parse(rawBody) as WebhookEvent;
}

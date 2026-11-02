import { verifyWebhook } from '@relio/crm-sdk';
import { getEnv } from '@/config/env';
import { fail, ok } from '@/lib/api/server-response';
import { addEvent } from '@/modules/webhooks/services/event-store';

// Register this URL in the CRM (POST /api/v1/webhooks). Anything that does not carry a valid signature is rejected.
export async function POST(req: Request) {
  const secret = getEnv().CRM_WEBHOOK_SECRET;
  if (!secret) return fail('Webhook receiver is not configured.', 503);

  const rawBody = await req.text(); // the signature covers the exact bytes, so read text, not json
  try {
    const event = verifyWebhook({ rawBody, signature: req.headers.get('x-webhook-signature'), secret });
    addEvent({ id: event.id, event: event.event, at: event.createdAt, data: event.data });
    return ok({ received: true });
  } catch {
    return fail('Invalid webhook signature.', 400);
  }
}

import { ok } from '@/lib/api/server-response';
import { listEvents } from '@/modules/webhooks/services/event-store';

export const dynamic = 'force-dynamic';

export const GET = () => ok(listEvents());

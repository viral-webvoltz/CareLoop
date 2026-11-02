import 'server-only';
import { RelioCRM } from '@relio/crm-sdk';
import { getEnv } from '@/config/env';

let client: RelioCRM | undefined;

// The API key lives only here, on the server. Browser code never imports this file (server-only enforces it).
export function crm() {
  if (!client) {
    const env = getEnv();
    client = new RelioCRM({ baseUrl: env.CRM_BASE_URL, apiKey: env.CRM_API_KEY });
  }
  return client;
}

export { verifyWebhook, type WebhookEvent } from './webhooks';

export interface Page<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export type Query = Record<string, string | number | boolean | undefined>;
export interface RequestOptions {
  query?: Query;
  body?: unknown;
  idempotencyKey?: string;
}
// Rows are loosely typed; use `crm.request()` plus the OpenAPI spec (`/api/v1/docs`) for anything not modelled here.
export type Row = Record<string, unknown> & { id: string };

export class CrmError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly errors?: unknown,
  ) {
    super(message);
    this.name = 'CrmError';
  }
}

export interface ClientOptions {
  baseUrl: string; // e.g. https://crm.example.com (the /api/v1 prefix is added for you)
  apiKey: string; // created in the CRM under API keys. Keep it on a server, never in browser code.
  fetch?: typeof fetch;
  retries?: number; // network errors, 429 and 502/503/504 are retried with backoff; default 2
  timeoutMs?: number; // default 15000
}

const RETRYABLE = new Set([429, 502, 503, 504]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const backoff = (attempt: number, retryAfter?: string | null) => (retryAfter && Number(retryAfter) > 0 ? Math.min(Number(retryAfter), 10) * 1000 : 300 * 2 ** (attempt - 1));

export class RelioCRM {
  private readonly base: string;

  constructor(private readonly opts: ClientOptions) {
    if (!opts.baseUrl || !opts.apiKey) throw new Error('RelioCRM needs baseUrl and apiKey');
    this.base = opts.baseUrl.replace(/\/+$/, '') + '/api/v1';
  }

  // Escape hatch for any of the API's endpoints.
  async request<T = unknown>(method: string, path: string, { query, body, idempotencyKey }: RequestOptions = {}): Promise<{ data: T; meta?: Page<T>['meta'] }> {
    const url = new URL(this.base + path);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    // Retrying a POST is only safe when the server can de-duplicate it, so that needs an idempotency key.
    const canRetry = method === 'GET' || method === 'PUT' || method === 'DELETE' || Boolean(idempotencyKey);
    const attempts = canRetry ? (this.opts.retries ?? 2) + 1 : 1;
    const doFetch = this.opts.fetch ?? fetch;

    for (let attempt = 1; ; attempt++) {
      try {
        const res = await doFetch(url, {
          method,
          headers: {
            authorization: `Bearer ${this.opts.apiKey}`,
            accept: 'application/json',
            ...(body !== undefined && { 'content-type': 'application/json' }),
            ...(idempotencyKey && { 'idempotency-key': idempotencyKey }),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: AbortSignal.timeout(this.opts.timeoutMs ?? 15_000),
        });
        const json = (await res.json().catch(() => ({}))) as { data?: T; meta?: Page<T>['meta']; message?: string; code?: string; errors?: unknown };
        if (res.ok) return { data: json.data as T, meta: json.meta };
        if (RETRYABLE.has(res.status) && attempt < attempts) {
          await sleep(backoff(attempt, res.headers.get('retry-after')));
          continue;
        }
        throw new CrmError(json.message ?? res.statusText, res.status, json.code, json.errors);
      } catch (err) {
        if (err instanceof CrmError || attempt >= attempts) throw err;
        await sleep(backoff(attempt));
      }
    }
  }

  private resource(name: string) {
    return {
      list: (query?: Query) => this.request<Row[]>('GET', `/${name}`, { query }).then((x): Page<Row> => ({ data: x.data, meta: x.meta! })),
      get: (id: string) => this.request<Row>('GET', `/${name}/${id}`).then((x) => x.data),
      create: (input: Record<string, unknown>, o?: { idempotencyKey?: string }) => this.request<Row>('POST', `/${name}`, { body: input, ...o }).then((x) => x.data),
      update: (id: string, input: Record<string, unknown>) => this.request<Row>('PATCH', `/${name}/${id}`, { body: input }).then((x) => x.data),
      remove: (id: string) => this.request('DELETE', `/${name}/${id}`).then(() => undefined),
    };
  }

  // One-to-one email from a lead or contact record. Replies come back into the record's history (and move a lead's status) via the CRM's inbound email hook.
  private emails(path: 'leads' | 'contacts') {
    return {
      sendEmail: (id: string, input: { subject: string; body: string }, o?: { idempotencyKey?: string }) =>
        this.request<Row>('POST', `/${path}/${id}/email`, { body: input, ...o }).then((x) => x.data),
      listEmails: (id: string) => this.request<Row[]>('GET', `/${path}/${id}/emails`).then((x) => x.data),
    };
  }

  readonly leads = {
    ...this.resource('leads'),
    ...this.emails('leads'),
    convert: (id: string) => this.request<Row>('POST', `/leads/${id}/convert`).then((x) => x.data),
  };
  readonly tickets = {
    ...this.resource('tickets'),
    addMessage: (id: string, input: { body: string; isInternal?: boolean }) => this.request<Row>('POST', `/tickets/${id}/messages`, { body: input }).then((x) => x.data),
  };
  readonly contacts = { ...this.resource('contacts'), ...this.emails('contacts') };
  readonly companies = this.resource('companies');
  readonly deals = this.resource('deals');
  readonly tasks = this.resource('tasks');
  readonly products = this.resource('products');
  readonly quotes = this.resource('quotes');
  readonly invoices = this.resource('invoices');
  readonly orders = this.resource('orders');
  readonly appointments = this.resource('appointments');
}

import { ApiError } from './errors';
import type { ApiResult } from './types';

const TIMEOUT_MS = 15_000;

// Browser-side client for this app's route handlers. Normalises network failures, timeouts and { ok: false } bodies into ApiError.
export async function apiRequest<T>(endpoint: string, options: Omit<RequestInit, 'body'> & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = options;
  let res: Response;
  try {
    res = await fetch(endpoint, {
      ...rest,
      headers: { ...(json !== undefined && { 'Content-Type': 'application/json' }), ...headers },
      body: json === undefined ? undefined : JSON.stringify(json),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  const body = (await res.json().catch(() => null)) as ApiResult<T> | null;
  if (!body) throw new ApiError('Unexpected response from the server.', res.status);
  if (!body.ok) throw new ApiError(body.message, res.status, body.fieldErrors);
  return body.data;
}

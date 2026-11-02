import 'server-only';
import { CrmError } from '@relio/crm-sdk';
import type { ZodError } from 'zod';
import type { ApiFailure, ApiSuccess } from './types';

export const ok = <T>(data: T, status = 200) => Response.json({ ok: true, data } satisfies ApiSuccess<T>, { status });

export const fail = (message: string, status: number, fieldErrors?: ApiFailure['fieldErrors']) =>
  Response.json({ ok: false, message, fieldErrors } satisfies ApiFailure, { status });

export const invalid = (error: ZodError) => fail('Please check the highlighted fields.', 422, error.flatten().fieldErrors);

// Maps a thrown error to a safe response. CRM validation text is fine to show; everything else is logged and hidden.
export function fromError(err: unknown) {
  if (err instanceof CrmError) {
    if (err.status === 401 || err.status === 403) {
      console.error('CRM rejected the API key or its scopes', err.code);
      return fail('The CRM connection is not authorised.', 502);
    }
    return fail(err.status < 500 ? err.message : 'The CRM is temporarily unavailable.', err.status < 500 ? err.status : 502);
  }
  console.error('Unexpected error in route handler', err);
  return fail('Something went wrong. Please try again.', 500);
}

// Every route handler in app/api answers with one of these two shapes.
export type FieldErrors = Record<string, string[] | undefined>;

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  message: string;
  fieldErrors?: FieldErrors;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

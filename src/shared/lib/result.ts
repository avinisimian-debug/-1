export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isSuccess<T, E>(
  result: Result<T, E>,
): result is { success: true; data: T } {
  return result.success;
}

export function isFailure<T, E>(
  result: Result<T, E>,
): result is { success: false; error: E } {
  return !result.success;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (isFailure(result)) {
    throw result.error instanceof Error
      ? result.error
      : new Error(String(result.error));
  }
  return result.data;
}

export function map<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U,
): Result<U, E> {
  return isSuccess(result) ? success(fn(result.data)) : result;
}

export function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  return isFailure(result) ? failure(fn(result.error)) : result;
}

/** Wraps a throwing function in a Result at infrastructure boundaries. */
export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return success(fn());
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
}

export async function tryCatchAsync<T>(
  fn: () => Promise<T>,
): Promise<Result<T, Error>> {
  try {
    return success(await fn());
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
}

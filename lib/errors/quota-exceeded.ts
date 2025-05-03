import { BaseError, HttpStatusCode } from "./base";

/**
 * Represents when an action goes over a limit. The limit may be temporary or monthly, etc.
 */
export class QuotaExceededError<TData = object> extends BaseError<TData> {
  constructor(
    message?: string,
    {
      isInternal = true,
      data,
      httpStatus,
    }: {
      readonly isInternal?: boolean;
      readonly data?: TData;
      readonly httpStatus?: HttpStatusCode;
    } = {
      isInternal: true,
    }
  ) {
    super({
      isInternal,
      message,
      httpStatus,
      data,
      name: "QuotaExceededError",
    });
  }
}

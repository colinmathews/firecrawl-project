import { BaseError } from "./base";

export class HttpError<TData = object> extends BaseError<TData> {
  constructor(
    message?: string,
    {
      isInternal = false,
      data,
      statusCode,
    }: {
      readonly isInternal?: boolean;
      readonly data?: TData;
      readonly statusCode?: number;
    } = {
      isInternal: false,
    }
  ) {
    super({
      isInternal,
      message,
      data,
      httpStatus: statusCode,
      name: "HttpError",
    });
  }
}

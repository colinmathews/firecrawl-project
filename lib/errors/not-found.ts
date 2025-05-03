import { BaseError, HttpStatusCode } from "./base";

export class NotFoundError<TData = object> extends BaseError<TData> {
  constructor(
    message?: string,
    {
      isInternal = false,
      data,
    }: {
      readonly isInternal?: boolean;
      readonly data?: TData;
    } = {
      isInternal: false,
    }
  ) {
    super({
      isInternal,
      message,
      data,
      httpStatus: HttpStatusCode.NOT_FOUND,
      name: "NotFoundError",
    });
  }
}

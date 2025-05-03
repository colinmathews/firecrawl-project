import { BaseError, HttpStatusCode } from "./base";

export interface UnauthenticatedErrorData {
  redirect?: string;
}

export class UnauthenticatedError<
  TData = UnauthenticatedErrorData
> extends BaseError<TData> {
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
      httpStatus: HttpStatusCode.UNAUTHORIZED,
      name: "UnauthenticatedError",
    });
  }
}

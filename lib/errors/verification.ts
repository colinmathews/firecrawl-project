import { BaseError, HttpStatusCode } from "./base";

export class VerificationError<TData = object> extends BaseError<TData> {
  constructor(
    message?: string,
    {
      data,
      isInternal,
    }: {
      isInternal?: boolean;
      readonly data?: TData;
    } = {}
  ) {
    super({
      isInternal: typeof isInternal === "boolean" ? isInternal : false,
      message,
      data,
      httpStatus: HttpStatusCode.BAD_REQUEST,
      name: "VerificationError",
    });
  }
}

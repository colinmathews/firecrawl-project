import { BaseError, HttpStatusCode } from "./base";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export class ValidationError<TData = object> extends BaseError<TData> {
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
      name: "ValidationError",
    });
  }

  static fromZodError(error: ZodError): ValidationError {
    const parsedError = fromZodError(error, { prefix: "Issues" });
    return new ValidationError(parsedError.message, {
      data: error,
    });
  }
}

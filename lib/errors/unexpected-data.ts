import { BaseError } from "./base";

export class UnexpectedDataError<TData = object> extends BaseError<TData> {
  constructor(
    message?: string,
    {
      isInternal = true,
      data,
    }: {
      readonly isInternal?: boolean;
      readonly data?: TData;
    } = {
      isInternal: true,
    }
  ) {
    super({
      isInternal,
      message,
      data,
      name: "UnexpectedDataError",
    });
  }
}

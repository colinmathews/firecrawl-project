import { BaseError } from "./base";

export class TimeoutError<TData = object> extends BaseError<TData> {
  constructor(
    message?: string,
    {
      data,
    }: {
      readonly data?: TData;
    } = {}
  ) {
    super({
      isInternal: true,
      message,
      data,
      name: "TimeoutError",
    });
  }
}

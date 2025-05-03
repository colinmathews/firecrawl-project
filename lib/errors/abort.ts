import { BaseError } from "./base";

export class AbortError<TData = object> extends BaseError<TData> {
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
      name: "AbortError",
    });
  }
}

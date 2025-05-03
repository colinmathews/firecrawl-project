import { BaseError } from "./base";

export class BadEnvironmentError<TData = object> extends BaseError<TData> {
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
      name: "BadEnvironmentError",
    });
  }
}

import { BaseError } from "./base";

export class AIError<TData = object> extends BaseError {
  constructor(
    message?: string,
    {
      isInternal = true,
      data,
      query,
    }: {
      readonly isInternal?: boolean;
      readonly data?: TData;
      readonly query?: string;
    } = {
      isInternal: true,
    }
  ) {
    super({
      isInternal,
      message,
      data: {
        ...(data || {}),
        query,
      },
      name: "AIError",
    });
  }
}

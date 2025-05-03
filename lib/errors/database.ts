import { BaseError } from "./base";

export class DatabaseError<TData = object> extends BaseError<
  TData & { query?: string }
> {
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
        ...(data || ({} as TData)),
        query,
      },
      name: "DatabaseError",
    });
  }
}

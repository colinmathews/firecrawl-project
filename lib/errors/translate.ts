import { BaseError } from "./base";

/**
 * Represents errors that occur during the process of translating content into another language.
 */
export class TranslateError<TData = object> extends BaseError<TData> {
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
      name: "TranslateError",
    });
  }
}

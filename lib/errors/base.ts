export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER = 500,
}

const GENERIC_ERROR = "Sorry, there was an unexpected error.";

export interface ErrorHttpResponse<TData = object> {
  readonly name: string;
  readonly message: string;
  readonly data: TData | undefined;
}

export class BaseError<TData = object> extends Error {
  public readonly name: string;
  public readonly httpStatus: HttpStatusCode | number | undefined;
  public readonly data: TData | undefined;
  public readonly isInternal: boolean | undefined;

  /**
   * Ensures we end up with a BaseError object.
   */
  static createFromError(
    error: unknown,
    { isInternal = true }: { isInternal?: boolean } = {}
  ): BaseError {
    if (error instanceof BaseError) {
      return error;
    }
    const output = new BaseError({
      name: (error as Error)?.name || "Unknown error",
      message: (error as Error)?.message,
      isInternal: isInternal ?? true,
      data: {
        error,
      },
    });
    output.stack = (error as Error)?.stack;
    return output;
  }

  constructor({
    name,
    httpStatus,
    isInternal,
    message,
    data,
  }: {
    readonly name: string;
    readonly httpStatus?: HttpStatusCode;
    readonly isInternal?: boolean;
    readonly message?: string;
    readonly data?: TData;
  }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    if (httpStatus) {
      this.httpStatus = httpStatus;
    } else {
      this.httpStatus = isInternal
        ? HttpStatusCode.INTERNAL_SERVER
        : HttpStatusCode.BAD_REQUEST;
    }
    this.isInternal = isInternal;
    this.data = data;
  }

  toHttpResponse(): ErrorHttpResponse<TData> {
    return {
      name: this.name,
      message: this.isInternal ? GENERIC_ERROR : this.message,
      data: this.isInternal ? undefined : this.data,
    };
  }
}

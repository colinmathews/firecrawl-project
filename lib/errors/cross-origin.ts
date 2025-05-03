import { BaseError } from './base';

export interface CrossOriginErrorData {
  origin: string;
  whitelist: string[];
}

export class CrossOriginError<TData extends CrossOriginErrorData = CrossOriginErrorData> extends BaseError {
  constructor(
    message?: string,
    { isInternal = true, data }: {
      readonly isInternal?: boolean;
      readonly data?: TData;
    } = {
      isInternal: true,
    },
  ) {
    super({
      isInternal,
      message,
      data,
      name: 'CrossOriginError',
    });
  }
}

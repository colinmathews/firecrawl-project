import type { StringValue } from "ms";

export interface CachedItemOptions {
  maxAge: StringValue;

  /**
   * Helps ensure that wildly large values don't suck up all the cache's space.
   * Values that exceed this size will be quietly aborted from storing the value.
   */
  maxBytesOfAnyItem?: number;
}

export type CacheKeyValue = {
  key: string;
  value: string;
};

export interface ICache {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string, options: CachedItemOptions): Promise<void>;
  remove(key: string): Promise<void>;
  /**
   * Removes many keys based on a given prefix pattern.
   */
  removeByPrefix(
    prefix: string,
    options?: { keysAtATime?: number }
  ): Promise<{ countDeleted: number }>;

  /**
   * Gets a list of keys based on a given prefix pattern.
   */
  getByPrefix(
    prefix: string,
    options?: { keysAtATime?: number; maxKeys?: number }
  ): Promise<CacheKeyValue[]>;
}

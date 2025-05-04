import type { ICache, CachedItemOptions, CacheKeyValue } from "./icache";
import { MemoryCache } from "./memory-cache";
import { BadEnvironmentError } from "../errors";

export type CacheName = "firecrawl-project";

function factory(cacheName: CacheName): ICache {
  switch (cacheName) {
    case "firecrawl-project":
      return new MemoryCache({ maxSizeInBytes: 1024 * 1024 });
    default:
      throw new BadEnvironmentError(`Unexpected cache name: ${cacheName}`);
  }
}

/**
 * Gets the prefix used for all keys on the cache by this name.
 */
function getCachePrefix(): string {
  return "";
}

export type CacheMiss = (key: string) => Promise<string | undefined>;

class Cache {
  private caches = new Map<string, ICache>();
  private static instance: Cache;

  private constructor() {
    // empty constructor to lock outsiders from using this
  }

  static getInstance() {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  async get<T = string>(
    cacheName: CacheName,
    key: string,
    {
      miss,
      options,
      deserialize,
    }: {
      miss?: CacheMiss;
      options?: CachedItemOptions;
      deserialize?: (value: string) => T;
    } = {}
  ): Promise<T | undefined> {
    const cache = this.getCache(cacheName);
    let found = await cache.get(key);
    if (!found && miss) {
      found = await miss(key);
      if (found) {
        if (!options) {
          throw new BadEnvironmentError(
            'Expected options to be passed for cache.get when "miss" is defined'
          );
        }
        if (this.validateSetValue({ cacheName, key, value: found, options })) {
          await cache.set(key, found, options);
        }
      }
    }
    if (found === undefined) {
      return;
    }
    if (found && deserialize) {
      return deserialize(found);
    }
    return found as unknown as T;
  }

  private validateSetValue({
    cacheName,
    key,
    options,
    value,
  }: {
    cacheName: string;
    key: string;
    value: string;
    options: CachedItemOptions;
  }): boolean {
    if (options.maxBytesOfAnyItem) {
      const valueSize = Buffer.byteLength(value);
      if (valueSize > options.maxBytesOfAnyItem) {
        console.warn({
          message:
            "Skipping storing cache item because it exceeds the allowed size",
          valueSize,
          maxAllowedSize: options.maxBytesOfAnyItem,
          key,
          cacheName,
        });
        return false;
      }
    }
    return true;
  }

  async set(
    cacheName: CacheName,
    key: string,
    value: string,
    options: CachedItemOptions
  ): Promise<void> {
    if (this.validateSetValue({ cacheName, key, value, options })) {
      const cache = this.getCache(cacheName);
      await cache.set(key, value, options);
    }
  }

  async remove(cacheName: CacheName, key: string): Promise<void> {
    const cache = this.getCache(cacheName);
    await cache.remove(key);
  }

  async removeByPrefix(
    cacheName: CacheName,
    prefix: string
  ): Promise<{ countDeleted: number }> {
    const prefixForCache = `${getCachePrefix()}${prefix}`;
    const cache = this.getCache(cacheName);
    return await cache.removeByPrefix(prefixForCache);
  }

  async getByPrefix(
    cacheName: CacheName,
    prefix: string,
    options?: { maxKeys?: number }
  ): Promise<CacheKeyValue[]> {
    const prefixForCache = `${getCachePrefix()}${prefix}`;
    const cache = this.getCache(cacheName);
    return await cache.getByPrefix(prefixForCache, options);
  }

  private getCache(name: CacheName): ICache {
    let found = this.caches.get(name);
    if (found) {
      return found;
    }
    found = factory(name);
    this.caches.set(name, found);
    return found;
  }
}

export const cache = Cache.getInstance();

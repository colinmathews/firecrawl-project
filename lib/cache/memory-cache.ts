import type { ICache, CachedItemOptions, CacheKeyValue } from "./icache";
import ms from "ms";

interface StoredItem {
  value: string;
  expiresAtEpoch: number;
}

export class MemoryCache implements ICache {
  private maxSizeInBytes: number;
  private size = 0;
  private store = new Map<string, StoredItem>();

  constructor({ maxSizeInBytes }: { maxSizeInBytes: number }) {
    this.maxSizeInBytes = maxSizeInBytes;
  }

  async get(key: string): Promise<string | undefined> {
    const item = this.store.get(key);
    if (!item) {
      return;
    }
    const now = new Date().valueOf();
    if (item.expiresAtEpoch < now) {
      await this.removeKeyWithKnownValue(key, item.value);
      return;
    }
    return item.value;
  }

  async set(
    key: string,
    value: string,
    options: CachedItemOptions
  ): Promise<void> {
    const expiresAtEpoch = new Date().valueOf() + ms(options.maxAge);
    await this.remove(key);
    this.addValueToSize(value);
    this.store.set(key, { value, expiresAtEpoch });
    await this.garbageCollect();
  }

  async remove(key: string): Promise<void> {
    const value = await this.get(key);
    if (!value) {
      return;
    }
    await this.removeKeyWithKnownValue(key, value);
  }

  async removeByPrefix(prefix: string): Promise<{ countDeleted: number }> {
    let countDeleted = 0;
    const promises: Promise<void>[] = [];
    this.store.forEach((_value, key) => {
      if (key.indexOf(prefix) === 0) {
        promises.push(this.remove(key));
        countDeleted++;
      }
    });
    await Promise.all(promises);
    return { countDeleted };
  }

  async getByPrefix(
    prefix: string,
    options?: { keysAtATime?: number; maxKeys?: number }
  ): Promise<CacheKeyValue[]> {
    const output: CacheKeyValue[] = [];
    const promises: Promise<void>[] = [];
    let countFound = 0;
    this.store.forEach((_value, key) => {
      if (key.indexOf(prefix) === 0) {
        // Abort if we've hit our limit
        if (options?.maxKeys && countFound >= options.maxKeys) {
          return;
        }

        countFound++;
        const fn = async () => {
          const value = await this.get(key);
          if (value === undefined) {
            return;
          }
          output.push({
            key,
            value,
          });
        };
        promises.push(fn());
      }
    });
    await Promise.all(promises);
    return output;
  }

  private async removeKeyWithKnownValue(
    key: string,
    value: string
  ): Promise<void> {
    this.addValueToSize(value, -1);
    this.store.delete(key);
  }

  private addValueToSize(value: string, multiplier = 1): void {
    const valueSize = Buffer.byteLength(value);
    this.size += multiplier * valueSize;
  }

  private async garbageCollect(): Promise<void> {
    // First eject expired items
    const expired = this.getExpiredKeys();
    while (expired.length > 0 && this.size > this.maxSizeInBytes) {
      const key = expired.shift();
      if (key) {
        await this.remove(key);
      }
    }

    // Then eject earliest items (maps are guaranteed to preserve insertion order)
    const keysIterator = this.store.keys();
    let iteration = keysIterator.next();
    while (!iteration.done && this.size > this.maxSizeInBytes) {
      await this.remove(iteration.value);
      iteration = keysIterator.next();
    }
  }

  private getExpiredKeys(): string[] {
    const now = new Date().valueOf();
    const output: string[] = [];
    for (const key of this.store.keys()) {
      const value = this.store.get(key);
      const isExpired = value && value.expiresAtEpoch < now;
      if (isExpired) {
        output.push(key);
      }
    }
    return output;
  }
}

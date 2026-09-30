import { createCache } from "./create-cache";
import { CacheEntry, CacheStore } from "./types";

export class MemoryCacheStore implements CacheStore {
  private readonly entries = new Map<string, CacheEntry<unknown>>();
  private readonly keysByTagIndex = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<CacheEntry<T> | undefined> {
    const entry = this.entries.get(key) as CacheEntry<T> | undefined;
    return Promise.resolve(entry);
  }

  async set<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    await this.delete(key);
    this.entries.set(key, entry);

    for (const tag of entry.tags) {
      const keys = this.keysByTagIndex.get(tag) ?? new Set<string>();
      keys.add(key);
      this.keysByTagIndex.set(tag, keys);
    }
  }

  async delete(key: string): Promise<void> {
    const entry = this.entries.get(key);
    if (!entry) return;

    this.entries.delete(key);
    for (const tag of entry.tags) {
      const keys = this.keysByTagIndex.get(tag);
      if (!keys) continue;

      keys.delete(key);
      if (keys.size === 0) this.keysByTagIndex.delete(tag);
    }

    return Promise.resolve();
  }

  async clear(): Promise<void> {
    this.entries.clear();
    this.keysByTagIndex.clear();
    return Promise.resolve();
  }

  async keys(): Promise<string[]> {
    return Promise.resolve([...this.entries.keys()]);
  }

  async keysByTag(tag: string): Promise<string[]> {
    return Promise.resolve([...(this.keysByTagIndex.get(tag) ?? [])]);
  }
}

export const memoryCache = createCache(new MemoryCacheStore());

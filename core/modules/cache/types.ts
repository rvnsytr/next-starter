import { CACHE_DURATION } from "./constants";

export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  staleUntil: number;
  tags: string[];
};

export type CacheStore = {
  get: <T>(key: string) => Promise<CacheEntry<T> | undefined>;
  set: <T>(key: string, entry: CacheEntry<T>) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  keys: () => Promise<string[]>;
  keysByTag: (tag: string) => Promise<string[]>;
};

export type CacheDuration = keyof typeof CACHE_DURATION;

export type CacheOptions = {
  /**
   * Time-to-live for a fresh cache entry.
   *
   * Use it with `staleWhileRevalidate` to always serve stale data while refreshing.
   *
   * `0` means the entry is immediately stale.
   *
   * @default 0
   */
  ttl?: CacheDuration | number;

  /**
   * How long an expired entry may still be returned while it refreshes in the background.
   *
   * @default 0
   */
  staleWhileRevalidate?: CacheDuration | number;

  /** Labels for invalidating related entries with `cache.invalidateTag(tag)`. */
  tags?: string[];
};

export type Cache = {
  fetch: <T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions,
  ) => Promise<T>;

  invalidate: (key: string) => Promise<void>;

  invalidateTag: (tag: string) => Promise<void>;

  clear: () => Promise<void>;

  list: () => Promise<string[]>;
};

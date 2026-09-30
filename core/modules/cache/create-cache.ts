import { CACHE_DURATION } from "./constants";
import { Cache, CacheDuration, CacheOptions, CacheStore } from "./types";

export function createCache(store: CacheStore): Cache {
  const refreshes = new Map<string, Promise<unknown>>();

  function resolveDuration(duration: CacheDuration | number): number {
    return typeof duration === "number" ? duration : CACHE_DURATION[duration];
  }

  async function refresh<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions,
  ): Promise<T> {
    const activeRefresh = refreshes.get(key) as Promise<T> | undefined;
    if (activeRefresh) return activeRefresh;

    const refreshPromise = fetcher().then(async (value) => {
      const now = Date.now();

      const ttl = resolveDuration(options.ttl ?? 0);
      const staleWhileRevalidate = resolveDuration(
        options.staleWhileRevalidate ?? 0,
      );

      await store.set(key, {
        value,
        expiresAt: now + ttl,
        staleUntil: now + ttl + staleWhileRevalidate,
        tags: options.tags ?? [],
      });

      return value;
    });

    refreshes.set(key, refreshPromise);

    try {
      return await refreshPromise;
    } finally {
      refreshes.delete(key);
    }
  }

  return {
    fetch: async <T>(
      key: string,
      fetcher: () => Promise<T>,
      options: CacheOptions,
    ): Promise<T> => {
      const entry = await store.get<T>(key);
      const now = Date.now();

      if (!entry || entry.staleUntil <= now)
        return refresh(key, fetcher, options);

      if (entry.expiresAt <= now)
        void refresh(key, fetcher, options).catch(() => undefined);

      return entry.value;
    },

    invalidate: (key: string) => store.delete(key),

    invalidateTag: async (tag: string) => {
      const keys = await store.keysByTag(tag);
      await Promise.all(keys.map((key) => store.delete(key)));
    },

    clear: () => store.clear(),

    list: () => store.keys(),
  };
}

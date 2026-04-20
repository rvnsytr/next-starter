"use client";

import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { ZodType } from "zod";
import { fetcher, FetcherConfig } from "../fetcher";

export type UseValidatedSWRConfig<T> = {
  swr?: SWRConfiguration;
  fetcher?: FetcherConfig<T>;
};

export function useValidatedSWR<T>(
  key: string,
  schema: ZodType<T>,
  config?: UseValidatedSWRConfig<T>,
): SWRResponse<T> {
  const fn = async () => await fetcher(key, { schema, ...config });
  return useSWR(key, fn, config?.swr);
}

import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { ZodType } from "zod";
import { fetcher, FetcherConfig } from "../api";

export type UseValidatedSWRConfig = {
  swr?: SWRConfiguration;
  fetcher?: FetcherConfig;
};

export function useValidatedSWR<T>(
  key: string,
  schema: ZodType<T>,
  config?: UseValidatedSWRConfig,
): SWRResponse<T> {
  const fn = async () => await fetcher(key, schema, config?.fetcher);
  return useSWR(key, fn, config?.swr);
}

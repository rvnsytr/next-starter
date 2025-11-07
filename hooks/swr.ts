import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { ZodType } from "zod";
import {
  apiFetcher,
  ApiFetcherConfig,
  ApiResponse,
  fetcher,
  FetcherConfig,
} from "../lib/api";

export type UseValidatedSWRConfig = {
  swr?: SWRConfiguration;
  fetcher?: FetcherConfig;
};

export type UseApiSWRConfig = {
  swr?: SWRConfiguration;
  fetcher?: ApiFetcherConfig;
};

export function useValidatedSWR<T>(
  key: string,
  schema: ZodType<T>,
  config?: UseValidatedSWRConfig,
): SWRResponse<T> {
  const fn = async () => await fetcher(key, schema, config?.fetcher);
  return useSWR(key, fn, config?.swr);
}

export function useApiSWR<T>(
  key: string,
  schema: ZodType<T>,
  config?: UseApiSWRConfig,
): SWRResponse<ApiResponse<T>> {
  const fn = async () => await apiFetcher(key, schema, config?.fetcher);
  return useSWR(key, fn, config?.swr);
}

import { apiConfig } from "@/shared/config";
import z from "zod";
import { getApiResponseSchema } from "./schema";
import { ApiResponse } from "./types";

export type FetcherConfig<T> = RequestInit & {
  schema?: z.ZodType<T>;
  safeFetch?: boolean;
};

export type ApiFetcherConfig<T> = Omit<FetcherConfig<T>, "credentials">;

const fetcher = async <T>(
  url: string,
  config?: FetcherConfig<T>,
): Promise<T> => {
  const res = await fetch(url, config);
  const json = await res.json().catch(() => res.text());

  if (!res.ok) {
    if (config?.safeFetch) return json;
    throw json;
  }

  if (!config?.schema) return json;
  return config.schema.parse(json);
};

fetcher.postJson = async <T>(
  url: string,
  config?: Omit<ApiFetcherConfig<T>, "method">,
) =>
  await fetcher(url, {
    ...config,
    method: "POST",
    headers: { ...config?.headers, "Content-Type": "application/json" },
  });

fetcher.api = async <T>(
  path: string,
  config?: ApiFetcherConfig<T>,
): Promise<ApiResponse<T>> =>
  await fetcher(`${apiConfig.baseUrl}${path}`, {
    ...config,
    credentials: "include",
    schema: getApiResponseSchema(config?.schema ?? z.any()),
  });

fetcher.apiPostJson = async <T>(
  path: string,
  config?: ApiFetcherConfig<T>,
): Promise<ApiResponse<T>> =>
  await fetcher.api(path, {
    ...config,
    method: "POST",
    headers: { ...config?.headers, "Content-Type": "application/json" },
  });

export { fetcher };

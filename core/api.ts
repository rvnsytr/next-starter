import z, { ZodType } from "zod";
import { appMeta } from "./constants";
import { apiResponseSchema } from "./schemas.zod";

export type FetcherConfig = RequestInit & { safeFetch?: boolean };

export type ApiResponse<T> = z.infer<typeof apiResponseSchema> & { data: T };
export type ApiFetcherConfig = Omit<FetcherConfig, "credentials">;

export async function fetcher<T>(
  url: string,
  schema: ZodType<T>,
  config?: FetcherConfig,
): Promise<T> {
  const res = await fetch(url, config);
  const json = await res.json();

  if (!res.ok) {
    if (config?.safeFetch) return json;
    throw json;
  }

  if (!schema) return json;
  return schema.parse(json);
}

export async function apiFetcher<T>(
  url: string,
  schema: ZodType<T>,
  config?: ApiFetcherConfig,
): Promise<ApiResponse<T>> {
  return await fetcher(
    `${appMeta.apiHost}${url}`,
    apiResponseSchema.extend({ data: schema }),
    { credentials: "include", ...config },
  );
}

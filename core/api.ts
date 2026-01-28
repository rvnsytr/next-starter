import z from "zod";
import { apiConfig } from "./constants/app";

export type FetcherConfig = RequestInit & { safeFetch?: boolean };

export type ApiResponse<T> = z.infer<typeof apiResponseSchema> & {
  data: T;
  error?: unknown;
};

export type ApiFetcherConfig = Omit<FetcherConfig, "credentials">;

export const apiResponseSchema = z.object({
  code: z.number(),
  success: z.boolean(),
  message: z.string(),
  count: z
    .intersection(
      z.object({ total: z.number() }),
      z.record(z.string(), z.number()),
    )
    .optional(),
});

export async function fetcher<T>(
  url: string,
  schema: z.ZodType<T>,
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
  schema: z.ZodType<T>,
  config?: ApiFetcherConfig,
): Promise<ApiResponse<T>> {
  return await fetcher(
    `${apiConfig.baseUrl}${url}`,
    apiResponseSchema.extend({ data: schema }),
    { credentials: "include", ...config },
  );
}

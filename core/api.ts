import z, { ZodType } from "zod";
import { apiResponseSchema } from "./schema.zod";

export type FetcherConfig = RequestInit & { safeFetch?: boolean };

export type ApiResponse<T> = z.infer<typeof apiResponseSchema> & { data: T };
export type ApiFetcherConfig = Omit<FetcherConfig, "credentials">;

export const apiConfig = {
  host: "http://localhost:8000",
  basePath: "/api",

  get baseUrl() {
    return `${this.host}${this.basePath}`;
  },

  get authBaseUrl() {
    return `${this.baseUrl}/auth`;
  },
};

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
    `${apiConfig.baseUrl}${url}`,
    apiResponseSchema.extend({ data: schema }),
    { credentials: "include", ...config },
  );
}

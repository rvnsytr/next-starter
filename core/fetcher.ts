import z from "zod";

export const getApiResponseSchema = <T>(schema: z.ZodType<T>) =>
  z.intersection(
    z.object({
      code: z.number(),
      message: z.string(),
    }),
    z.discriminatedUnion("success", [
      z.object({
        success: z.literal(true),
        count: z
          .intersection(
            z.object({ total: z.number() }),
            z.record(z.string(), z.number()),
          )
          .optional(),
        data: schema,
      }),
      z.object({ success: z.literal(false), error: z.unknown() }),
    ]),
  );

export type ApiResponse<T> = z.infer<
  ReturnType<typeof getApiResponseSchema<T>>
>;

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
  const json = await res.json();

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

export { fetcher };

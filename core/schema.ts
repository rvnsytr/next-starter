import z from "zod";

export function withSchemaPrefix<P extends string, S extends z.ZodRawShape>(
  prefix: P,
  schema: z.ZodObject<S>,
) {
  const prefixedShape = Object.fromEntries(
    Object.entries(schema.shape).map(([k, v]) => [`${prefix}${k}`, v]),
  ) as { [K in keyof S as `${P}${string & K}`]: S[K] };
  return z.object(prefixedShape);
}

export const countSchema = z.intersection(
  z.object({ total: z.number() }),
  z.record(z.string(), z.number()),
);

export const getActionResponseSchema = <T>(schema: z.ZodType<T>) =>
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string().exactOptional(),
      count: countSchema.exactOptional(),
      data: schema,
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      error: z.unknown().exactOptional(),
    }),
  ]);

export const getApiResponseSchema = <T>(schema: z.ZodType<T>) =>
  z.intersection(
    z.object({
      code: z.number(),
      message: z.string(),
    }),
    z.discriminatedUnion("success", [
      z.object({
        success: z.literal(true),
        count: countSchema.exactOptional(),
        data: schema,
      }),
      z.object({
        success: z.literal(false),
        error: z.unknown().exactOptional(),
      }),
    ]),
  );

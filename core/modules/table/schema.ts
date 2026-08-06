import { z } from "zod";

export const filterValueSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.enum(["string"]),
    value: z.string(),
    // operator: z.enum(allFilterOperators),
    // value: z.union([
    //   z.string(),
    //   z.number(),
    //   z.coerce.date(),
    //   z.union([
    //     z.string().array(),
    //     z.number().array(),
    //     z.coerce.date().array(),
    //   ]),
    // ]),
    // columnMeta: z.object({
    //   label: z.string().exactOptional(),
    //   type: z.enum(allDataFilterType),
    // }),
  }),
  // ...othertype
]);

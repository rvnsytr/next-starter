import { z } from "zod";
import { STRING_FILTER_OPERATOR_VALUES } from "./operators";

export const filterValueSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.enum(["string"]),
    operator: z.enum(STRING_FILTER_OPERATOR_VALUES),
    value: z.string(),
  }),
]);

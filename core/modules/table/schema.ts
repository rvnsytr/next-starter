import { z } from "zod";
import {
  NUMBER_FILTER_OPERATOR_VALUES,
  STRING_FILTER_OPERATOR_VALUES,
} from "./operators";

export const stringFilterValueSchema = z.object({
  type: z.literal("string"),
  operator: z.enum(STRING_FILTER_OPERATOR_VALUES),
  value: z.string(),
});

export const numberFilterValueSchema = z.object({
  type: z.literal("number"),
  operator: z.enum(NUMBER_FILTER_OPERATOR_VALUES),
  value: z.number().array().min(1).max(2),
});

export const filterValueSchema = z.discriminatedUnion("type", [
  stringFilterValueSchema,
  // numberFilterValueSchema,
]);

export const filterTypeSchema = z.union(
  filterValueSchema.options.map((s) => s.shape.type),
);

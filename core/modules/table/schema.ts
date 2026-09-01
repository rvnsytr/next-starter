import { z } from "zod";
import {
  BOOLEAN_FILTER_OPERATOR_VALUES,
  MULTI_OPTION_FILTER_OPERATOR_VALUES,
  NUMBER_FILTER_OPERATOR_VALUES,
  OPTION_FILTER_OPERATOR_VALUES,
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

export const booleanFilterValueSchema = z.object({
  type: z.literal("boolean"),
  operator: z.enum(BOOLEAN_FILTER_OPERATOR_VALUES),
  value: z.boolean(),
});

export const optionFilterValueSchema = z.object({
  type: z.literal("option"),
  operator: z.enum(OPTION_FILTER_OPERATOR_VALUES),
  value: z.string().array(),
});

export const multiOptionFilterValueSchema = z.object({
  type: z.literal("multi-option"),
  operator: z.enum(MULTI_OPTION_FILTER_OPERATOR_VALUES),
  value: z.string().array(),
});

export const filterTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "option",
  "multi-option",
]);

export const filterValueSchema = z.compile(
  z.discriminatedUnion("type", [
    stringFilterValueSchema,
    numberFilterValueSchema,
    booleanFilterValueSchema,
    optionFilterValueSchema,
    multiOptionFilterValueSchema,
  ]),
);

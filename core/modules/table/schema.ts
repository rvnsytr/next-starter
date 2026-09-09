import { z } from "zod";
import {
  BOOLEAN_FILTER_OPERATOR_VALUES,
  DATE_TIME_FILTER_OPERATOR_VALUES,
  MULTI_OPTION_FILTER_OPERATOR_VALUES,
  NUMBER_FILTER_OPERATOR_VALUES,
  OPTION_FILTER_OPERATOR_VALUES,
  STRING_FILTER_OPERATOR_VALUES,
  TEMPORAL_FILTER_OPERATOR_VALUES,
} from "./operators";

export const stringFilterSchema = z.object({
  type: z.literal("string"),
  operator: z.enum(STRING_FILTER_OPERATOR_VALUES),
  value: z.string(),
});

export const numberFilterSchema = z.object({
  type: z.literal("number"),
  operator: z.enum(NUMBER_FILTER_OPERATOR_VALUES),
  value: z.number().array().min(1).max(2),
  // value: z.tuple([z.number().optional(), z.number().optional()]),
});

export const booleanFilterSchema = z.object({
  type: z.literal("boolean"),
  operator: z.enum(BOOLEAN_FILTER_OPERATOR_VALUES),
  value: z.boolean(),
});

export const optionFilterSchema = z.object({
  type: z.literal("option"),
  operator: z.enum(OPTION_FILTER_OPERATOR_VALUES),
  value: z.string().array(),
});

export const multiOptionFilterSchema = z.object({
  type: z.literal("multi-option"),
  operator: z.enum(MULTI_OPTION_FILTER_OPERATOR_VALUES),
  value: z.string().array(),
});

export const temporalFilterValueSchema = z.tuple([
  z.date().optional(),
  z.date().optional(),
]);

export const dateTimeFilterSchema = z.object({
  type: z.literal("date-time"),
  operator: z.enum(DATE_TIME_FILTER_OPERATOR_VALUES),
  value: temporalFilterValueSchema,
});

export const dateFilterSchema = z.object({
  type: z.literal("date"),
  operator: z.enum(TEMPORAL_FILTER_OPERATOR_VALUES),
  value: temporalFilterValueSchema,
});

export const timeFilterSchema = z.object({
  type: z.literal("time"),
  operator: z.enum(TEMPORAL_FILTER_OPERATOR_VALUES),
  value: temporalFilterValueSchema,
});

export const temporalFilterSchema = z.discriminatedUnion("type", [
  dateTimeFilterSchema,
  dateFilterSchema,
  timeFilterSchema,
]);

export const filterTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "option",
  "multi-option",
  "date-time",
  "date",
  "time",
]);

export const filterSchema = z.compile(
  z.discriminatedUnion("type", [
    stringFilterSchema,
    numberFilterSchema,
    booleanFilterSchema,
    optionFilterSchema,
    multiOptionFilterSchema,
    dateTimeFilterSchema,
    dateFilterSchema,
    timeFilterSchema,
  ]),
);

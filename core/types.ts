import { sharedSchemas } from "@/shared/schema";
import type { infer as ZodInfer } from "zod";
import {
  countSchema,
  getActionResponseSchema,
  getApiResponseSchema,
} from "./schema";

type Builtin =
  | Date
  | RegExp
  | Error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function
  | Promise<unknown>
  | Map<unknown, unknown>
  | Set<unknown>;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends readonly (infer U)[]
    ? T extends (infer V)[]
      ? DeepPartial<V>[]
      : readonly DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export type Override<T, TOverride> = Omit<T, keyof TOverride> & TOverride;

export type OmitByType<T, TValue> = {
  [K in keyof T as T[K] extends TValue ? never : K]: T[K];
};

export type StringCase =
  "kebab" | "snake" | "camel" | "pascal" | "constant" | "title";

export type TransformableStringCase = Extract<
  StringCase,
  "snake" | "kebab" | "camel"
>;

export type SnakeCase<TString extends string> =
  TString extends `${infer A}${infer B}`
    ? B extends Uncapitalize<B>
      ? `${Lowercase<A>}${SnakeCase<B>}`
      : `${Lowercase<A>}_${SnakeCase<B>}`
    : TString;

export type KebabCase<TString extends string> =
  SnakeCase<TString> extends `${infer A}_${infer B}`
    ? `${A}-${KebabCase<B>}`
    : SnakeCase<TString>;

export type CamelCase<TString extends string> =
  TString extends `${infer A}_${infer B}`
    ? `${A}${Capitalize<CamelCase<B>>}`
    : TString;

export type TransformKeys<
  T,
  TCase extends TransformableStringCase,
> = T extends Builtin
  ? T
  : T extends readonly (infer U)[]
    ? readonly TransformKeys<U, TCase>[]
    : T extends object
      ? {
          [
            K in keyof T as K extends string
              ? TCase extends "snake"
                ? SnakeCase<K>
                : TCase extends "kebab"
                  ? KebabCase<K>
                  : CamelCase<K>
              : K
          ]: TransformKeys<T[K], TCase>;
        }
      : T;

export type FileMetadata = ZodInfer<typeof sharedSchemas.fileMetadata>;

export type FileWithPreview = ZodInfer<
  ReturnType<typeof sharedSchemas.fileWithPreview>
>;

export type Count = ZodInfer<typeof countSchema>;

export type ActionResponse<T = unknown> = ZodInfer<
  ReturnType<typeof getActionResponseSchema<T>>
>;

export type ActionSuccess<T = unknown> = Extract<
  ActionResponse<T>,
  { success: true }
>;

export type ActionError = Extract<ActionResponse, { success: false }>;

export type ApiResponse<T = unknown> = ZodInfer<
  ReturnType<typeof getApiResponseSchema<T>>
>;

export type ApiSuccess<T = unknown> = Extract<
  ApiResponse<T>,
  { success: true }
>;

export type ApiSuccessPayload<T = null> = Partial<ApiSuccess<T>>;

export type ApiError = Extract<ApiResponse, { success: false }>;

export type ApiErrorPayload = Partial<ApiError>;

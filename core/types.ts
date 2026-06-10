import { Role } from "@/shared/permission";
import { Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon } from "lucide-react";
import { Route } from "next";
import z from "zod";
import {
  countSchema,
  getActionResponseSchema,
  getApiResponseSchema,
  sharedSchemas,
} from "./schema";

export type RouteRole = "all" | Role[];

export type Override<T, U> = Omit<T, keyof U> & U;

export type OmitByType<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

export type StringCase =
  | "kebab"
  | "snake"
  | "camel"
  | "pascal"
  | "constant"
  | "title";

export type TransformableStringCase = Extract<
  StringCase,
  "snake" | "kebab" | "camel"
>;

export type SnakeCase<S extends string> = S extends `${infer A}${infer B}`
  ? B extends Uncapitalize<B>
    ? `${Lowercase<A>}${SnakeCase<B>}`
    : `${Lowercase<A>}_${SnakeCase<B>}`
  : S;

export type KebabCase<S extends string> =
  SnakeCase<S> extends `${infer A}_${infer B}`
    ? `${A}-${KebabCase<B>}`
    : SnakeCase<S>;

export type CamelCase<S extends string> = S extends `${infer A}_${infer B}`
  ? `${A}${Capitalize<CamelCase<B>>}`
  : S;

export type TransformKeys<
  T,
  C extends TransformableStringCase,
> = T extends readonly (infer U)[]
  ? readonly TransformKeys<U, C>[]
  : T extends Date | RegExp
    ? T
    : T extends object
      ? {
          [K in keyof T as K extends string
            ? C extends "snake"
              ? SnakeCase<K>
              : C extends "kebab"
                ? KebabCase<K>
                : CamelCase<K>
            : K]: TransformKeys<T[K], C>;
        }
      : T;

export type FileMetadata = z.infer<typeof sharedSchemas.fileMetadata>;
export type FileWithPreview = z.infer<
  ReturnType<typeof sharedSchemas.fileWithPreview>
>;

export type Count = z.infer<typeof countSchema>;

export type ActionResponse<T = unknown> = z.infer<
  ReturnType<typeof getActionResponseSchema<T>>
>;

export type ActionSuccess<T = unknown> = Extract<
  ActionResponse<T>,
  { success: true }
>;

export type ActionError = Extract<ActionResponse, { success: false }>;

export type ApiResponse<T = unknown> = z.infer<
  ReturnType<typeof getApiResponseSchema<T>>
>;

export type ApiSuccess<T = unknown> = Extract<
  ApiResponse<T>,
  { success: true }
>;

export type ApiSuccessPayload<T = null> = Partial<ApiSuccess<T>>;

export type ApiError = Extract<ApiResponse, { success: false }>;

export type ApiErrorPayload = Partial<ApiError>;

export type Menu = { group: string; items: MenuItem[] };

export type MenuItem = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;
  shortcut?: Hotkey;

  // if href is not defined, the Link href prop will be `/${route}#${toCase(label, "kebab")}`
  subItems?: {
    label: string;
    href?: Route | string;
    role?: RouteRole;
    disabled?: boolean;
  }[];
};

import { Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon } from "lucide-react";
import { Route } from "next";
import z from "zod";
import { RouteRole } from "./route";
import { sharedSchemas } from "./schema";

export type Override<T, U> = Omit<T, keyof U> & U;

export type OmitByType<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

export type ActionResponse<T = unknown> = {
  count?: ({ total: number } & Record<string, number>) | undefined;
  message?: string;
} & ({ success: true; data: T } | { success: false; error?: unknown });

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

export type Menu = { group: string; items: MenuItem[] };

export type MenuItem = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;
  shortcut?: Hotkey;

  // if href is not defined, the Link href prop will be `/${route}#${toCase(label, "kebab")}`
  subItems?: { label: string; href?: Route | string; role?: RouteRole }[];
};

export type FileMetadata = z.infer<typeof sharedSchemas.fileMetadata>;
export type FileWithPreview = z.infer<
  ReturnType<typeof sharedSchemas.fileWithPreview>
>;

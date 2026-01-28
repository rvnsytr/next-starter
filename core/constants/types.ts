export type Override<T, U> = Omit<T, keyof U> & U;

export type ActionResponse<TData> = {
  count?: { total: number } & Record<string, number>;
} & ({ success: true; data: TData } | { success: false; error: string });

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

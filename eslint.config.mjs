import nextPlugin from "@next/eslint-plugin-next";
import { tanstackConfig } from "@tanstack/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  reactHooks.configs.flat.recommended,
  ...tanstackConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,

      /** Enabled rules (error) */
      "@typescript-eslint/no-explicit-any": "error",

      /** Enabled rules (warn) */
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/array-type": ["warn", { default: "array" }],

      /** Disabled rules */
      "import/order": "off",
      "sort-imports": "off",
      "no-extra-boolean-cast": "off", // TODO: remove later
      "@typescript-eslint/consistent-type-imports": "off", // TODO: remove later
    },
  },
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "eslint.config.mjs",
    "next.config.js",
    "postcss.config.mjs",
  ]),
]);

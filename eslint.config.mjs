import nextPlugin from "@next/eslint-plugin-next";
import { tanstackConfig } from "@tanstack/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  reactHooks.configs.flat.recommended,
  ...tanstackConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,

      // Enabled rules (warn)
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",

      // Enabled rules (error)
      "@typescript-eslint/no-explicit-any": "error",

      // Disabled rules
      "import/order": "off",
      "sort-imports": "off",
      "no-extra-boolean-cast": "off",
      "@stylistic/spaced-comment": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
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

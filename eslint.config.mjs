import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-specific ignores: skip Python backend and vendored JS.
    "backend/**",
    "node_modules/**",
    "public/**",
  ]),
  {
    // O'zbek tilida apostroflar tabiiy — JSX ichida ham ruxsat berilsin.
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;

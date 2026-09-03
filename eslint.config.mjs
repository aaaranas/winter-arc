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
    // Generated, not authored: the Prisma client, the bundled service worker
    // and the illustration PNGs copied out of @bryllim/workout-guide.
    "src/generated/**",
    "public/sw.js",
    "public/sw.js.map",
    "public/workout-guide/**",
  ]),
]);

export default eslintConfig;

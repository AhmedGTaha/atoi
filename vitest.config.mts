import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    hookTimeout: 30000,
    testTimeout: 20000,
    // Integration tests share one real Postgres database and call
    // resetDatabase() between cases, so test files must not run
    // concurrently against it.
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts"),
      "next/cache": path.resolve(__dirname, "tests/stubs/next-cache.ts"),
      "next/headers": path.resolve(__dirname, "tests/stubs/next-headers.ts"),
      "@": path.resolve(__dirname, "."),
    },
  },
});

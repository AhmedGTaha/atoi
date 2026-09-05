import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { existsSync } from "fs";

const envPath = path.resolve(__dirname, ".env.e2e");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const PORT = process.env.PORT ?? "3100";
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Run against a production build rather than `next dev`: dev mode's
    // Turbopack HMR websocket is prone to noisy, unrelated console errors
    // under fast automated navigation, and a production build is the more
    // representative target for release verification anyway.
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    env: process.env as Record<string, string>,
    timeout: 180_000,
  },
});

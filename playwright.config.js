/**
 * Configuration Playwright — tests E2E maquette Richard La Literie.
 */
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./Tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});

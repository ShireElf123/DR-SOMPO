import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3010";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: "list",
  use: {
    baseURL,
    browserName: "chromium",
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        }
      : undefined,
  },
  // A production build must already exist. An explicit base URL uses a server
  // managed by the caller; otherwise Playwright owns and cleans up this server.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : [{
        command: "npx next start -H 0.0.0.0 -p 3010",
        // The reserved .invalid receiver is test-only. Browser submissions are
        // intercepted; no test can deliver to the practice. Production stays gated.
        env: {
          ENQUIRY_ENABLED: "true",
          ENQUIRY_WEBHOOK_URL: "https://delivery.example.invalid/enquiry",
        },
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      }, {
        // Exercise the actual production delivery-off mode too; never disguise
        // the unavailable receiver by only testing the configured fixture.
        command: "npx next start -H 0.0.0.0 -p 3012",
        env: { ENQUIRY_ENABLED: "false", ENQUIRY_WEBHOOK_URL: "" },
        url: "http://127.0.0.1:3012",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      }],
});

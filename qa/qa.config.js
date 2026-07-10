import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.CERTAINID_URL || 'https://app.certainid.io';
const SIMULATED = process.env.SIMULATED_HASH === 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'reports' }],
    ['list']
  ],
  timeout: 60000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
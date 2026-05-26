import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: true,
    baseURL: process.env.PLAYWRIGHT_BASE_URL
  }
});

import { test, expect } from '@playwright/test';

test('VoiceBotNew web app loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="voicebot-root"]')).toBeVisible();
});

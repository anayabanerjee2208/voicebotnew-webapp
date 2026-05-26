import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('VoiceBotNew Voice Journey', () => {

  test('Simulated voice input produces transcript + bot response', async ({ page }) => {

    // 1. Navigate to the voicebot page
    await page.goto('/voicebot');

    // 2. Ensure UI loaded
    await expect(page.locator('[data-testid="voicebot-container"]')).toBeVisible();

    // 3. Load test audio file
    const audioBuffer = fs.readFileSync('tests/audio/hello.webm');
    const audioBase64 = audioBuffer.toString('base64');

    // 4. Inject audio into the JS SDK conversation
    await page.evaluate(async (audioBase64) => {
      const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
      const blob = new Blob([audioBytes], { type: "audio/webm" });

      // Send audio chunk to the bot
      await window.voiceBot.conversation.sendAudio(blob);

    }, audioBase64);

    // 5. Wait for transcript to appear
    const transcriptArea = page.locator('[data-testid="transcript-area"]');
    await expect(transcriptArea).toContainText(/hello/i, { timeout: 15000 });

    // 6. Wait for bot response
    const botResponseArea = page.locator('[data-testid="bot-response-area"]');
    await expect(botResponseArea).not.toHaveText("Bot responses will appear here...", { timeout: 20000 });

    // 7. Validate bot responded with something meaningful
    const botText = await botResponseArea.textContent();
    expect(botText?.length).toBeGreaterThan(2);
  });

});

import { test, expect } from '@playwright/test';

async function completeOneRound(page: import('@playwright/test').Page) {
  await expect(page.getByRole('button', { name: 'Make a Guess' })).toBeVisible();
  await page.getByRole('button', { name: 'Make a Guess' }).click();
  const ov = page.getByTestId('map-overlay');
  const obox = await ov.boundingBox();
  if (!obox) throw new Error('Map overlay not visible');
  await page.mouse.click(obox.x + obox.width / 2, obox.y + obox.height / 2);
  await page.getByRole('button', { name: 'Confirm Guess' }).click();
}

test('complete a full game and see leaderboard section', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Classic' }).click();

  for (let i = 1; i <= 5; i++) {
    await completeOneRound(page);
    if (i < 5) {
      await page.getByRole('button', { name: 'Next Round' }).click();
    } else {
      await page.getByRole('button', { name: 'View Final Results' }).click();
    }
  }

  await expect(page.getByText(/Leaderboard/)).toBeVisible();
  await page.screenshot({ path: 'test-results/final-results.png', fullPage: true });
});

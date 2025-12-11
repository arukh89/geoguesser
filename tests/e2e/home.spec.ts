import { test, expect } from '@playwright/test';

test('home → start classic → make a guess → results screen', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Farcaster Geo Explorer' })).toBeVisible();

  await page.getByRole('button', { name: 'Classic' }).click();

  await expect(page.getByRole('button', { name: 'Make a Guess' })).toBeVisible();
  await page.getByRole('button', { name: 'Make a Guess' }).click();

  await expect(page.getByText('Click on the map to place your guess')).toBeVisible();

  const ov = page.getByTestId('map-overlay');
  const obox = await ov.boundingBox();
  if (!obox) throw new Error('Map overlay not visible');
  await page.mouse.click(obox.x + obox.width / 2, obox.y + obox.height / 2);

  await page.getByRole('button', { name: 'Confirm Guess' }).click();

  await expect(page.getByText('Round 1 Results')).toBeVisible();

  await page.screenshot({ path: 'test-results/round-1-results.png', fullPage: true });
});

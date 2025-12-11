import { test, expect } from '@playwright/test';

test('home shows all mode buttons and durations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Classic' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'No-Move' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Time Attack', exact: true })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Time Attack 30s' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Time Attack 60s' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Time Attack 90s' })).toBeVisible();
});

test('no-move mode basic flow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'No-Move' }).click();
  await expect(page.getByRole('button', { name: 'Make a Guess' })).toBeVisible();
  await page.getByRole('button', { name: 'Make a Guess' }).click();

  const ov = page.getByTestId('map-overlay');
  const obox = await ov.boundingBox();
  if (!obox) throw new Error('Map overlay not visible');
  await page.mouse.click(obox.x + obox.width / 2, obox.y + obox.height / 2);

  await page.getByRole('button', { name: 'Confirm Guess' }).click();
  await expect(page.getByText('Round 1 Results')).toBeVisible();
});

test('time-attack 30s shows timer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Time Attack 30s' }).click();
  // Header displays time label and seconds with 's' (may be in separate elements)
  await expect(page.getByText('Time')).toBeVisible();
  await expect(page.getByText(/\d+s/)).toBeVisible();
});

import { test, expect } from '@playwright/test';

test('GET /api/location/random returns a location', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/location/random`, { headers: { 'cache-control': 'no-cache' } });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json).toHaveProperty('found');
  if (json.found) {
    expect(json).toHaveProperty('lat');
    expect(json).toHaveProperty('lon');
  }
});

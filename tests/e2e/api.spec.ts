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

test('GET /api/geocode/reverse responds (may be 502 if Nominatim fails)', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/geocode/reverse?lat=0&lon=0`);
  expect([200, 400, 502]).toContain(res.status());
});

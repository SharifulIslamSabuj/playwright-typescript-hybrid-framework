import { test, expect } from '@playwright/test';
import { BrandsApiClient } from '../../src/api/clients/BrandsApiClient';
import { ApiResponse, BrandsListResponse } from '../../src/types/api.types';

test.describe('Brands API', () => {
  test('AE-TC-API-003 @api @brands @step14 @smoke Get all brands list', async ({ request }) => {
    const brandsApi = new BrandsApiClient(request);
    const response = await brandsApi.getAllBrands();

    expect(response.status()).toBe(200);
    const body = (await response.json()) as BrandsListResponse;
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.brands)).toBe(true);
    expect(body.brands.length).toBeGreaterThan(0);

    body.brands.forEach((brand) => {
      expect(typeof brand.id).toBe('number');
      expect(typeof brand.brand).toBe('string');
      expect(brand.brand.length).toBeGreaterThan(0);
    });
  });

  test('AE-TC-API-004 @api @brands @step14 @regression PUT to brands list unsupported', async ({ request }) => {
    const brandsApi = new BrandsApiClient(request);
    const response = await brandsApi.putBrandsList();

    // Automation Exercise always returns HTTP 200 at the transport layer; the real
    // result is carried in the JSON body's responseCode, confirmed via live verification.
    expect(response.status()).toBe(200);
    const body = (await response.json()) as ApiResponse;
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });
});

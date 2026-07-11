import { test, expect } from '@playwright/test';
import { ProductsApiClient } from '../../src/api/clients/ProductsApiClient';
import { readJsonFile } from '../../src/utils/fileUtils';
import { ApiResponse, ApiProduct, ProductsListResponse, SearchProductResponse } from '../../src/types/api.types';

interface ApiPayloads {
  searchProduct: { search_product: string };
}

const apiPayloads = readJsonFile<ApiPayloads>('test-data/api-payloads.json');

function assertValidProductShape(product: ApiProduct): void {
  expect(typeof product.id).toBe('number');
  expect(typeof product.name).toBe('string');
  expect(product.name.length).toBeGreaterThan(0);
  expect(typeof product.price).toBe('string');
  expect(product.price.length).toBeGreaterThan(0);
  expect(typeof product.brand).toBe('string');
  expect(typeof product.category?.category).toBe('string');
  expect(typeof product.category?.usertype?.usertype).toBe('string');
}

function isTshirtRelevant(product: ApiProduct): boolean {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    normalize(product.name).includes('tshirt') ||
    normalize(product.category?.category ?? '').includes('tshirt')
  );
}

test.describe('Products API', () => {
  test('AE-TC-API-001 @api @products @step14 @smoke Get all products list', async ({ request }) => {
    const productsApi = new ProductsApiClient(request);
    const response = await productsApi.getAllProducts();

    expect(response.status()).toBe(200);
    const body = (await response.json()) as ProductsListResponse;
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    body.products.forEach(assertValidProductShape);
  });

  test('AE-TC-API-002 @api @products @step14 @regression POST to products list unsupported', async ({ request }) => {
    const productsApi = new ProductsApiClient(request);
    const response = await productsApi.postProductsList();

    // Automation Exercise always returns HTTP 200 at the transport layer; the real
    // result is carried in the JSON body's responseCode, confirmed via live verification.
    expect(response.status()).toBe(200);
    const body = (await response.json()) as ApiResponse;
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });

  test('AE-TC-API-005 @api @products @step14 @smoke Search product with valid parameter', async ({ request }) => {
    const productsApi = new ProductsApiClient(request);
    const response = await productsApi.searchProduct(apiPayloads.searchProduct.search_product);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as SearchProductResponse;
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    body.products.forEach(assertValidProductShape);
    body.products.forEach((product) => {
      expect(isTshirtRelevant(product)).toBe(true);
    });
  });

  test('AE-TC-API-006 @api @products @step14 @regression Search product without parameter', async ({ request }) => {
    const productsApi = new ProductsApiClient(request);
    const response = await productsApi.searchProductWithoutParam();

    expect(response.status()).toBe(200);
    const body = (await response.json()) as ApiResponse;
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });
});

import { test, expect } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';

interface ProductTestData {
  searchTerms: { primary: string; alternatives: string[] };
  cartQuantity: number;
}

const productData = readJsonFile<ProductTestData>('test-data/products.json');

test.describe('Products', () => {
  test('AE-TC-UI-008 @ui @products @smoke View all products and product details', async ({
    homePage,
    productsPage,
    productDetailsPage,
  }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyAllProductsPage();
    await expect(productsPage.productList.first()).toBeVisible();

    await productsPage.openFirstProductDetails();
    await productDetailsPage.verifyProductDetailsVisible();
  });

  test('AE-TC-UI-009 @ui @products @search @smoke Search product', async ({ homePage, productsPage }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyAllProductsPage();

    await productsPage.searchProduct(productData.searchTerms.primary);
    await productsPage.verifySearchedProducts();

    const productNames = await productsPage.productList.locator('p').allTextContents();
    const hasRelevantResult = productNames.some((name) =>
      name.toLowerCase().includes(productData.searchTerms.primary.toLowerCase())
    );
    expect(hasRelevantResult).toBeTruthy();
  });
});

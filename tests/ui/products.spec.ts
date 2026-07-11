import { test, expect } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';

interface ProductTestData {
  searchTerms: { primary: string; alternatives: string[] };
  cartQuantity: number;
  categories: { women: { category: 'Women' | 'Men'; subCategory: string } };
}

interface ProductReviewData {
  name: string;
  email: string;
  review: string;
}

const productData = readJsonFile<ProductTestData>('test-data/products.json');
const reviewData = readJsonFile<ProductReviewData>('test-data/product-review.json');

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

  test('AE-TC-UI-018 @ui @products @regression @batch2 View category products', async ({ homePage, productsPage }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyCategoriesVisible();

    const { category, subCategory } = productData.categories.women;
    await productsPage.selectCategory(category, subCategory);
    await productsPage.verifyCategoryHeading(`${category} - ${subCategory} Products`);
    await productsPage.verifyCategoryProductsVisible();

    const menSubCategories = await productsPage.getAvailableSubCategories('Men');
    const menSubCategory = menSubCategories[0];
    await productsPage.selectCategory('Men', menSubCategory);
    await productsPage.verifyCategoryHeading(`Men - ${menSubCategory} Products`);
    await productsPage.verifyCategoryProductsVisible();
  });

  test('AE-TC-UI-019 @ui @products @regression @batch2 View brand products', async ({ homePage, productsPage }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyBrandsVisible();

    const brandNames = await productsPage.getVisibleBrandNames();
    const [firstBrand, secondBrand] = brandNames;

    await productsPage.selectBrand(firstBrand);
    await productsPage.verifyBrandHeading(firstBrand);
    await productsPage.verifyBrandProductsVisible();

    await productsPage.selectBrand(secondBrand);
    await productsPage.verifyBrandHeading(secondBrand);
    await productsPage.verifyBrandProductsVisible();
  });

  test('AE-TC-UI-021 @ui @products @regression @batch2 Add review on product', async ({
    homePage,
    productsPage,
    productDetailsPage,
  }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyAllProductsPage();
    await productsPage.openFirstProductDetails();

    await productDetailsPage.verifyWriteYourReviewVisible();
    await productDetailsPage.submitReview(reviewData.name, reviewData.email, reviewData.review);
    await productDetailsPage.verifyReviewSuccessMessage();
  });
});

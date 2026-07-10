import { test } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';

interface ProductTestData {
  searchTerms: { primary: string; alternatives: string[] };
  cartQuantity: number;
}

const productData = readJsonFile<ProductTestData>('test-data/products.json');

test.describe('Cart', () => {
  test('AE-TC-UI-012 @ui @cart @smoke Add multiple products to cart', async ({
    homePage,
    productsPage,
    cartPage,
  }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyAllProductsPage();

    const [firstProduct, secondProduct] = await productsPage.addFirstTwoProductsToCart();
    await homePage.goToCart();

    await cartPage.verifyCartPage();
    await cartPage.verifyMultipleProductsInCart(2);
    await cartPage.verifyCartItemDetails(0, firstProduct.name, firstProduct.price);
    await cartPage.verifyCartItemDetails(1, secondProduct.name, secondProduct.price);
  });

  test('AE-TC-UI-013 @ui @cart @smoke Verify product quantity in cart', async ({
    homePage,
    productsPage,
    productDetailsPage,
    cartPage,
  }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyAllProductsPage();
    await productsPage.openFirstProductDetails();

    await productDetailsPage.verifyProductDetailsVisible();
    await productDetailsPage.setQuantity(productData.cartQuantity);
    await productDetailsPage.addToCart();

    await homePage.goToCart();
    await cartPage.verifyCartPage();
    await cartPage.verifyQuantity(productData.cartQuantity);
  });

  test('AE-TC-UI-017 @ui @cart @smoke Remove product from cart', async ({
    homePage,
    productsPage,
    productDetailsPage,
    cartPage,
  }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyAllProductsPage();
    await productsPage.openFirstProductDetails();
    await productDetailsPage.verifyProductDetailsVisible();
    await productDetailsPage.addToCart();

    await homePage.goToCart();
    await cartPage.verifyCartPage();
    await cartPage.verifyMultipleProductsInCart(1);

    await cartPage.removeProduct();
    await cartPage.verifyMultipleProductsInCart(0);
  });
});

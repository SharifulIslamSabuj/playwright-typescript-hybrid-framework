import { test } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';
import { User } from '../../src/types/user.types';
import { registerNewAccount, deleteAccountSafely } from '../../src/utils/accountHelpers';

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

  test('AE-TC-UI-022 @ui @cart @regression @batch2 Add recommended item to cart', async ({ homePage, cartPage }) => {
    await homePage.navigateToHome();
    await homePage.verifyRecommendedItemsVisible();

    const productName = await homePage.addRecommendedItemToCart();
    await homePage.goToCart();

    await cartPage.verifyCartPage();
    await cartPage.verifyProductInCart(productName);
  });

  test('AE-TC-UI-020 @ui @cart @regression @batch2 Search products and verify cart after login', async ({
    homePage,
    productsPage,
    cartPage,
    signupLoginPage,
  }) => {
    await homePage.navigateToHome();
    await homePage.goToProducts();
    await productsPage.verifyAllProductsPage();
    await productsPage.searchProduct(productData.searchTerms.primary);
    await productsPage.verifySearchedProducts();

    const productName = await productsPage.addFirstSearchedProductToCart();
    await homePage.goToCart();
    await cartPage.verifyCartPage();
    await cartPage.verifyProductInCart(productName);

    let accountCreated = false;
    let isLoggedIn = false;
    let user!: User;
    try {
      user = await registerNewAccount(homePage, signupLoginPage, 'cartlogin');
      accountCreated = true;
      isLoggedIn = true;

      await signupLoginPage.logout();
      isLoggedIn = false;

      await homePage.goToSignupLogin();
      await signupLoginPage.verifyLoginSectionVisible();
      await signupLoginPage.login(user.email, user.password);
      await signupLoginPage.verifyLoggedInAs(user.name);
      isLoggedIn = true;

      await homePage.goToCart();
      await cartPage.verifyCartPage();
      await cartPage.verifyProductInCart(productName);
    } finally {
      if (accountCreated) {
        await deleteAccountSafely(homePage, signupLoginPage, user, isLoggedIn);
      }
    }
  });
});

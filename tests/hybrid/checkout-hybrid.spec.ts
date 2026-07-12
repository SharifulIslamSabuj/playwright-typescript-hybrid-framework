import { test } from '../../src/fixtures/testFixtures';
import { AuthApiClient } from '../../src/api/clients/AuthApiClient';
import { readJsonFile } from '../../src/utils/fileUtils';
import { generateUniqueEmail } from '../../src/utils/dataGenerator';
import { logger } from '../../src/utils/logger';
import { User } from '../../src/types/user.types';
import { CheckoutData } from '../../src/types/product.types';
import { ApiResponse } from '../../src/types/api.types';

const userTemplate = readJsonFile<{ dynamicUser: User }>('test-data/users.json').dynamicUser;
const checkoutData = readJsonFile<CheckoutData>('test-data/checkout.json');

if (!checkoutData.orderComment?.trim()) {
  throw new Error('test-data/checkout.json is missing a required non-blank "orderComment" value.');
}
const orderComment = checkoutData.orderComment;

test.describe('Hybrid - Checkout', () => {
  test('AE-TC-HYBRID-002 @hybrid @checkout @step15 @regression Checkout completion for an API-provisioned account', async ({
    request,
    homePage,
    signupLoginPage,
    productsPage,
    productDetailsPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    const authApi = new AuthApiClient(request);
    const user: User = { ...userTemplate, email: generateUniqueEmail('hybridcheckout') };

    const createResponse = await authApi.createAccount(user);
    const createBody = (await createResponse.json()) as ApiResponse;
    if (createResponse.status() !== 200 || createBody.responseCode !== 201) {
      throw new Error(
        `API setup failed: could not create disposable account for AE-TC-HYBRID-002. ` +
          `HTTP status=${createResponse.status()}, body.responseCode=${createBody.responseCode}, ` +
          `message=${createBody.message}`
      );
    }

    try {
      await homePage.navigateToHome();
      await homePage.goToSignupLogin();
      await signupLoginPage.verifyLoginSectionVisible();
      await signupLoginPage.login(user.email, user.password);
      await signupLoginPage.verifyLoggedInAs(user.name);

      await homePage.goToProducts();
      await productsPage.verifyAllProductsPage();
      await productsPage.openFirstProductDetails();
      await productDetailsPage.verifyProductDetailsVisible();
      await productDetailsPage.addToCart();

      await homePage.goToCart();
      await cartPage.verifyCartPage();
      await cartPage.proceedToCheckout();

      await checkoutPage.verifyAddressDetails(user);
      await checkoutPage.verifyReviewOrder();
      await checkoutPage.enterOrderComment(orderComment);
      await checkoutPage.placeOrder();

      await paymentPage.enterPaymentDetails(checkoutData.card);
      await paymentPage.confirmOrder();
      await paymentPage.verifyOrderPlaced();
    } finally {
      const deleteResponse = await authApi.deleteAccount(user.email, user.password);
      const deleteBody = (await deleteResponse.json()) as ApiResponse;
      if (deleteResponse.status() !== 200 || deleteBody.responseCode !== 200) {
        logger.warn(
          `API cleanup failed for ${user.email}: HTTP status=${deleteResponse.status()}, ` +
            `body.responseCode=${deleteBody.responseCode}, message=${deleteBody.message}`
        );
      }
    }
  });
});

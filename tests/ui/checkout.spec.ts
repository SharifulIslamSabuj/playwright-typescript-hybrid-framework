import fs from 'fs';
import { test, expect } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';
import { generateUniqueEmail } from '../../src/utils/dataGenerator';
import { User } from '../../src/types/user.types';
import { CheckoutData } from '../../src/types/product.types';
import { registerNewAccount, deleteAccountSafely } from '../../src/utils/accountHelpers';
import { HomePage } from '../../src/pages/HomePage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { ProductDetailsPage } from '../../src/pages/ProductDetailsPage';

const userTemplate = readJsonFile<{ dynamicUser: User }>('test-data/users.json').dynamicUser;
const checkoutData = readJsonFile<CheckoutData>('test-data/checkout.json');

if (!checkoutData.orderComment?.trim()) {
  throw new Error('test-data/checkout.json is missing a required non-blank "orderComment" value.');
}
const orderComment = checkoutData.orderComment;

async function addProductToCart(
  homePage: HomePage,
  productsPage: ProductsPage,
  productDetailsPage: ProductDetailsPage
): Promise<void> {
  await homePage.navigateToHome();
  await homePage.goToProducts();
  await productsPage.verifyAllProductsPage();
  await productsPage.openFirstProductDetails();
  await productDetailsPage.verifyProductDetailsVisible();
  await productDetailsPage.addToCart();
}

test.describe('Checkout', () => {
  test('AE-TC-UI-014 @ui @checkout @regression @batch3 Place Order - Register During Checkout', async ({
    homePage,
    productsPage,
    productDetailsPage,
    cartPage,
    signupLoginPage,
    checkoutPage,
    paymentPage,
  }) => {
    await addProductToCart(homePage, productsPage, productDetailsPage);
    await homePage.goToCart();
    await cartPage.verifyCartPage();
    await cartPage.proceedToCheckout();
    await cartPage.goToRegisterLoginFromCheckoutPrompt();

    const user: User = { ...userTemplate, email: generateUniqueEmail('checkoutregisterduring') };
    let accountCreated = false;
    let isLoggedIn = false;

    try {
      await signupLoginPage.verifySignupSectionVisible();
      await signupLoginPage.startSignup(user.name, user.email);
      await signupLoginPage.completeAccountRegistration(user);
      await signupLoginPage.verifyAccountCreated();
      await signupLoginPage.clickContinue();
      accountCreated = true;
      isLoggedIn = true;
      await signupLoginPage.verifyLoggedInAs(user.name);

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
      if (accountCreated) {
        await deleteAccountSafely(homePage, signupLoginPage, user, isLoggedIn);
      }
    }
  });

  test('AE-TC-UI-015 @ui @checkout @regression @batch3 Place Order - Register Before Checkout', async ({
    homePage,
    productsPage,
    productDetailsPage,
    cartPage,
    signupLoginPage,
    checkoutPage,
    paymentPage,
  }) => {
    let accountCreated = false;
    let isLoggedIn = false;
    let user!: User;

    try {
      user = await registerNewAccount(homePage, signupLoginPage, 'checkoutregisterbefore');
      accountCreated = true;
      isLoggedIn = true;
      await signupLoginPage.verifyLoggedInAs(user.name);

      await addProductToCart(homePage, productsPage, productDetailsPage);
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
      if (accountCreated) {
        await deleteAccountSafely(homePage, signupLoginPage, user, isLoggedIn);
      }
    }
  });

  test('AE-TC-UI-016 @ui @checkout @regression @batch3 Place Order - Login Before Checkout', async ({
    homePage,
    productsPage,
    productDetailsPage,
    cartPage,
    signupLoginPage,
    checkoutPage,
    paymentPage,
  }) => {
    let accountCreated = false;
    let isLoggedIn = false;
    let user!: User;

    try {
      user = await registerNewAccount(homePage, signupLoginPage, 'checkoutloginbefore');
      accountCreated = true;
      isLoggedIn = true;

      await signupLoginPage.logout();
      isLoggedIn = false;

      await homePage.goToSignupLogin();
      await signupLoginPage.verifyLoginSectionVisible();
      await signupLoginPage.login(user.email, user.password);
      await signupLoginPage.verifyLoggedInAs(user.name);
      isLoggedIn = true;

      await addProductToCart(homePage, productsPage, productDetailsPage);
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
      if (accountCreated) {
        await deleteAccountSafely(homePage, signupLoginPage, user, isLoggedIn);
      }
    }
  });

  test('AE-TC-UI-023 @ui @checkout @regression @batch3 Verify Address Details During Checkout', async ({
    homePage,
    productsPage,
    productDetailsPage,
    cartPage,
    signupLoginPage,
    checkoutPage,
  }) => {
    let accountCreated = false;
    let isLoggedIn = false;
    let user!: User;

    try {
      user = await registerNewAccount(homePage, signupLoginPage, 'checkoutaddress');
      accountCreated = true;
      isLoggedIn = true;
      await signupLoginPage.verifyLoggedInAs(user.name);

      await addProductToCart(homePage, productsPage, productDetailsPage);
      await homePage.goToCart();
      await cartPage.verifyCartPage();
      await cartPage.proceedToCheckout();

      await checkoutPage.verifyAddressDetails(user);
    } finally {
      if (accountCreated) {
        await deleteAccountSafely(homePage, signupLoginPage, user, isLoggedIn);
      }
    }
  });

  test('AE-TC-UI-024 @ui @checkout @regression @batch3 Download Invoice After Purchase', async ({
    homePage,
    productsPage,
    productDetailsPage,
    cartPage,
    signupLoginPage,
    checkoutPage,
    paymentPage,
  }) => {
    let accountCreated = false;
    let isLoggedIn = false;
    let user!: User;

    try {
      user = await registerNewAccount(homePage, signupLoginPage, 'checkoutinvoice');
      accountCreated = true;
      isLoggedIn = true;
      await signupLoginPage.verifyLoggedInAs(user.name);

      await addProductToCart(homePage, productsPage, productDetailsPage);
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

      const downloadPath = await paymentPage.downloadInvoice();
      expect(fs.existsSync(downloadPath)).toBe(true);

      await paymentPage.clickContinue();
    } finally {
      if (accountCreated) {
        await deleteAccountSafely(homePage, signupLoginPage, user, isLoggedIn);
      }
    }
  });
});

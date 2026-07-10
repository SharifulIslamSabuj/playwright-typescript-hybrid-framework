import { test, expect } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';

interface SubscriptionTestData {
  home: string;
  cart: string;
}

const subscriptionData = readJsonFile<SubscriptionTestData>('test-data/subscription.json');

test.describe('Subscription', () => {
  test('AE-TC-UI-010 @ui @subscription @smoke Subscribe from Home page', async ({ homePage }) => {
    await homePage.navigateToHome();
    await homePage.verifySubscriptionSectionVisible();
    await homePage.subscribeFromHome(subscriptionData.home);
    await expect(homePage.subscribeSuccessMessage).toBeVisible();
    await expect(homePage.subscribeSuccessMessage).toContainText('You have been successfully subscribed!');
  });

  test('AE-TC-UI-011 @ui @subscription @smoke Subscribe from Cart page', async ({ homePage, cartPage }) => {
    await homePage.navigateToHome();
    await homePage.goToCart();
    await cartPage.verifySubscriptionSectionVisible();
    await cartPage.subscribeFromCart(subscriptionData.cart);
    await expect(cartPage.subscribeSuccessMessage).toBeVisible();
    await expect(cartPage.subscribeSuccessMessage).toContainText('You have been successfully subscribed!');
  });
});

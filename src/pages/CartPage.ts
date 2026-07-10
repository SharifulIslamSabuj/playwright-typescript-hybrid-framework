import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible, assertTextContains } from '../utils/assertionUtils';

export class CartPage extends BasePage {
  readonly cartInfo: Locator;
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly deleteItemButtons: Locator;
  readonly cartQuantityCells: Locator;
  readonly cartProductNameCells: Locator;
  readonly subscribeEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscribeSuccessMessage: Locator;
  readonly subscriptionHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.cartInfo = page.locator('#cart_info');
    this.cartItems = page.locator('#cart_info tbody tr');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.deleteItemButtons = page.locator('.cart_quantity_delete');
    this.cartQuantityCells = page.locator('.cart_quantity button');
    this.cartProductNameCells = page.locator('.cart_description h4 a');
    this.subscribeEmailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscribeSuccessMessage = page.locator('#success-subscribe');
    this.subscriptionHeading = page.getByRole('heading', { name: /subscription/i });
  }

  async verifyCartPage(): Promise<void> {
    await assertVisible(this.cartInfo);
  }

  async verifyProductInCart(productName: string): Promise<void> {
    await assertVisible(this.page.locator('.cart_description', { hasText: productName }));
  }

  async verifyMultipleProductsInCart(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async verifyQuantity(expectedQuantity: number): Promise<void> {
    await assertTextContains(this.cartQuantityCells.first(), expectedQuantity.toString());
  }

  async verifyCartItemDetails(
    index: number,
    expectedName: string,
    expectedPrice: string,
    expectedQuantity = 1
  ): Promise<void> {
    const row = this.cartItems.nth(index);
    await assertVisible(row);
    await assertTextContains(row.locator('.cart_description h4 a'), expectedName);
    await assertTextContains(row.locator('.cart_price p'), expectedPrice);
    await assertTextContains(row.locator('.cart_quantity button'), expectedQuantity.toString());
    await assertTextContains(row.locator('.cart_total .cart_total_price'), expectedPrice);
  }

  async removeProduct(): Promise<void> {
    await this.deleteItemButtons.first().click();
  }

  async verifySubscriptionSectionVisible(): Promise<void> {
    await assertVisible(this.subscriptionHeading);
  }

  async subscribeFromCart(email: string): Promise<void> {
    await this.subscribeEmailInput.scrollIntoViewIfNeeded();
    await this.fill(this.subscribeEmailInput, email);
    await this.click(this.subscribeButton);
  }
}

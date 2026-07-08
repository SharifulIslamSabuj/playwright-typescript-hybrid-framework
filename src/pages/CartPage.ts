import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly deleteItemButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('#cart_info tbody tr');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.deleteItemButtons = page.locator('.cart_quantity_delete');
  }
}

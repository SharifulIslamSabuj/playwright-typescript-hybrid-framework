import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly orderCommentTextArea: Locator;
  readonly placeOrderButton: Locator;
  readonly addressDetails: Locator;

  constructor(page: Page) {
    super(page);
    this.orderCommentTextArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a:has-text("Place Order")');
    this.addressDetails = page.locator('#address_delivery');
  }
}

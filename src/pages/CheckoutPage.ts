import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible, assertTextContains } from '../utils/assertionUtils';
import { User } from '../types/user.types';

export class CheckoutPage extends BasePage {
  readonly orderCommentTextArea: Locator;
  readonly placeOrderButton: Locator;
  readonly addressDetails: Locator;
  readonly addressInvoice: Locator;
  readonly reviewOrderHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.orderCommentTextArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a:has-text("Place Order")');
    this.addressDetails = page.locator('#address_delivery');
    this.addressInvoice = page.locator('#address_invoice');
    this.reviewOrderHeading = page.getByRole('heading', { name: 'Review Your Order' });
  }

  async verifyAddressDetails(user: User): Promise<void> {
    await assertVisible(this.addressDetails);
    await assertVisible(this.addressInvoice);

    const expectedFields = [
      `${user.title}. ${user.firstName} ${user.lastName}`,
      user.address.address1,
      user.mobileNumber,
      user.address.city,
      user.address.state,
      user.address.zipcode,
      user.address.country,
    ];
    if (user.company) expectedFields.push(user.company);
    if (user.address.address2) expectedFields.push(user.address.address2);

    for (const field of expectedFields) {
      await assertTextContains(this.addressDetails, field);
      await assertTextContains(this.addressInvoice, field);
    }
  }

  async verifyReviewOrder(): Promise<void> {
    await assertVisible(this.reviewOrderHeading);
  }

  async enterOrderComment(comment: string): Promise<void> {
    await this.fill(this.orderCommentTextArea, comment);
  }

  async placeOrder(): Promise<void> {
    await this.click(this.placeOrderButton);
  }
}

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible } from '../utils/assertionUtils';

export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly writeReviewNameInput: Locator;
  readonly writeReviewEmailInput: Locator;
  readonly writeReviewTextArea: Locator;
  readonly submitReviewButton: Locator;
  readonly availabilityText: Locator;
  readonly conditionText: Locator;
  readonly brandText: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.product-information h2');
    this.productPrice = page.locator('.product-information span span');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    this.writeReviewNameInput = page.locator('#name');
    this.writeReviewEmailInput = page.locator('#email');
    this.writeReviewTextArea = page.locator('#review');
    this.submitReviewButton = page.locator('#button-review');
    this.availabilityText = page.locator('p:has-text("Availability:")');
    this.conditionText = page.locator('p:has-text("Condition:")');
    this.brandText = page.locator('p:has-text("Brand:")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
  }

  async verifyProductDetailsVisible(): Promise<void> {
    await assertVisible(this.productName);
    await assertVisible(this.productPrice);
    await assertVisible(this.availabilityText);
    await assertVisible(this.conditionText);
    await assertVisible(this.brandText);
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(quantity.toString());
  }

  async addToCart(): Promise<void> {
    await this.click(this.addToCartButton);
    await this.click(this.continueShoppingButton);
  }
}

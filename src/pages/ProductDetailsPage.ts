import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly writeReviewNameInput: Locator;
  readonly writeReviewEmailInput: Locator;
  readonly writeReviewTextArea: Locator;
  readonly submitReviewButton: Locator;

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
  }
}

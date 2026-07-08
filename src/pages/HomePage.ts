import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly contactUsLink: Locator;
  readonly featuresItems: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginLink = page.locator('a[href="/login"]');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.productsLink = page.locator('a[href="/products"]');
    this.cartLink = page.locator('a[href="/view_cart"]').first();
    this.contactUsLink = page.locator('a[href="/contact_us"]');
    this.featuresItems = page.locator('.features_items .product-image-wrapper');
  }
}

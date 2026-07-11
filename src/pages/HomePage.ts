import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible } from '../utils/assertionUtils';

export class HomePage extends BasePage {
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly contactUsLink: Locator;
  readonly featuresItems: Locator;
  readonly subscribeEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscribeSuccessMessage: Locator;
  readonly subscriptionHeading: Locator;
  readonly recommendedItemsHeading: Locator;
  readonly recommendedItems: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginLink = page.locator('a[href="/login"]');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.productsLink = page.locator('a[href="/products"]');
    this.cartLink = page.locator('a[href="/view_cart"]').first();
    this.contactUsLink = page.locator('a[href="/contact_us"]');
    this.featuresItems = page.locator('.features_items .product-image-wrapper');
    this.subscribeEmailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscribeSuccessMessage = page.locator('#success-subscribe');
    this.subscriptionHeading = page.getByRole('heading', { name: /subscription/i });
    this.recommendedItemsHeading = page.getByRole('heading', { name: /recommended items/i });
    this.recommendedItems = page.locator('.recommended_items .product-image-wrapper');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
  }

  async navigateToHome(): Promise<void> {
    await this.navigate('/');
  }

  async verifyHomePageVisible(): Promise<void> {
    await assertVisible(this.featuresItems.first());
  }

  async goToSignupLogin(): Promise<void> {
    await this.click(this.signupLoginLink);
  }

  async goToProducts(): Promise<void> {
    await this.click(this.productsLink);
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
  }

  async goToContactUs(): Promise<void> {
    await this.click(this.contactUsLink);
  }

  async verifySubscriptionSectionVisible(): Promise<void> {
    await assertVisible(this.subscriptionHeading);
  }

  async subscribeFromHome(email: string): Promise<void> {
    await this.subscribeEmailInput.scrollIntoViewIfNeeded();
    await this.fill(this.subscribeEmailInput, email);
    await this.click(this.subscribeButton);
  }

  async verifyRecommendedItemsVisible(): Promise<void> {
    await this.recommendedItemsHeading.scrollIntoViewIfNeeded();
    await assertVisible(this.recommendedItemsHeading);
  }

  async addRecommendedItemToCart(): Promise<string> {
    const firstItem = this.recommendedItems.first();
    const name = (await firstItem.locator('p').first().textContent())?.trim();
    if (!name) {
      throw new Error('Failed to extract recommended product name: locator returned no text content.');
    }
    await firstItem.locator('.add-to-cart').first().click();
    await this.click(this.continueShoppingButton);
    return name;
  }
}

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible } from '../utils/assertionUtils';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productList: Locator;
  readonly viewProductLinks: Locator;
  readonly addToCartButtons: Locator;
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productList = page.locator('.features_items .product-image-wrapper');
    this.viewProductLinks = page.locator('a[href^="/product_details/"]');
    this.addToCartButtons = page.locator('.add-to-cart');
    this.allProductsHeading = page.getByText('All Products');
    this.searchedProductsHeading = page.getByText('Searched Products');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
  }

  async verifyAllProductsPage(): Promise<void> {
    await assertVisible(this.allProductsHeading);
  }

  async searchProduct(searchTerm: string): Promise<void> {
    await this.fill(this.searchInput, searchTerm);
    await this.click(this.searchButton);
  }

  async verifySearchedProducts(): Promise<void> {
    await assertVisible(this.searchedProductsHeading);
    const count = await this.productList.count();
    expect(count).toBeGreaterThan(0);
  }

  async openFirstProductDetails(): Promise<void> {
    await this.viewProductLinks.first().click();
  }

  async addFirstTwoProductsToCart(): Promise<[{ name: string; price: string }, { name: string; price: string }]> {
    const firstCard = this.productList.nth(0);
    const secondCard = this.productList.nth(1);

    const firstProduct = await this.readProductSummary(firstCard);
    await firstCard.locator('.add-to-cart').first().click();
    await this.continueShoppingButton.click();

    const secondProduct = await this.readProductSummary(secondCard);
    await secondCard.locator('.add-to-cart').first().click();
    await this.continueShoppingButton.click();

    return [firstProduct, secondProduct];
  }

  private async readProductSummary(card: Locator): Promise<{ name: string; price: string }> {
    const name = (await card.locator('p').first().textContent())?.trim() ?? '';
    const price = (await card.locator('h2').first().textContent())?.trim() ?? '';
    return { name, price };
  }
}

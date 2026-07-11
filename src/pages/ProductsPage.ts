import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible, assertTextContains } from '../utils/assertionUtils';

type PrimaryCategory = 'Women' | 'Men';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productList: Locator;
  readonly viewProductLinks: Locator;
  readonly addToCartButtons: Locator;
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;
  readonly continueShoppingButton: Locator;
  readonly categoryWomenToggle: Locator;
  readonly categoryMenToggle: Locator;
  readonly pageTitleHeading: Locator;
  readonly brandLinks: Locator;

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
    this.categoryWomenToggle = page.locator('a[href="#Women"]');
    this.categoryMenToggle = page.locator('a[href="#Men"]');
    this.pageTitleHeading = page.locator('h2.title.text-center');
    this.brandLinks = page.locator('a[href^="/brand_products/"]');
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

  async addFirstSearchedProductToCart(): Promise<string> {
    const firstCard = this.productList.first();
    const { name } = await this.readProductSummary(firstCard);
    await firstCard.locator('.add-to-cart').first().click();
    await this.continueShoppingButton.click();
    return name;
  }

  private async readProductSummary(card: Locator): Promise<{ name: string; price: string }> {
    const name = (await card.locator('p').first().textContent())?.trim();
    if (!name) {
      throw new Error('Failed to extract product name: locator returned no text content.');
    }
    const price = (await card.locator('h2').first().textContent())?.trim() ?? '';
    return { name, price };
  }

  async verifyCategoriesVisible(): Promise<void> {
    await assertVisible(this.categoryWomenToggle);
  }

  async getAvailableSubCategories(primaryCategory: PrimaryCategory): Promise<string[]> {
    const names = await this.page.locator(`#${primaryCategory} a`).allTextContents();
    return names.map((name) => name.trim());
  }

  async selectCategory(primaryCategory: PrimaryCategory, subCategory: string): Promise<void> {
    const toggle = primaryCategory === 'Women' ? this.categoryWomenToggle : this.categoryMenToggle;
    await this.click(toggle);
    const subCategoryLink = this.page.locator(`#${primaryCategory} a`, { hasText: subCategory });
    await this.click(subCategoryLink);
  }

  async verifyCategoryHeading(expectedText: string): Promise<void> {
    await assertTextContains(this.pageTitleHeading, expectedText);
  }

  async verifyCategoryProductsVisible(): Promise<void> {
    await this.verifyProductsVisible();
  }

  async verifyBrandsVisible(): Promise<void> {
    await assertVisible(this.brandLinks.first());
  }

  async getVisibleBrandNames(): Promise<string[]> {
    const hrefs = await this.brandLinks.evaluateAll((links) => links.map((el) => el.getAttribute('href') ?? ''));
    return hrefs.map((href) => decodeURIComponent(href.replace('/brand_products/', '')));
  }

  async selectBrand(brandName: string): Promise<void> {
    await this.click(this.brandLinks.filter({ hasText: brandName }));
  }

  async verifyBrandHeading(expectedBrand: string): Promise<void> {
    await assertTextContains(this.pageTitleHeading, expectedBrand);
  }

  async verifyBrandProductsVisible(): Promise<void> {
    await this.verifyProductsVisible();
  }

  private async verifyProductsVisible(): Promise<void> {
    await assertVisible(this.productList.first());
  }
}

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productList: Locator;
  readonly viewProductLinks: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productList = page.locator('.features_items .product-image-wrapper');
    this.viewProductLinks = page.locator('a[href^="/product_details/"]');
    this.addToCartButtons = page.locator('.add-to-cart');
  }
}
